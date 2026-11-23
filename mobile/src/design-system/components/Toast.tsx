import Ionicons from "@expo/vector-icons/Ionicons";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii, spacing, typography } from "../tokens";

export type ToastKind = "info" | "success" | "error";
export type ToastInput = { text: string; kind?: ToastKind; durationMs?: number };
type ToastState = ToastInput & { id: number };

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

const icons = { info: "information-circle", success: "checkmark-circle", error: "warning" } as const;
const tints = { info: colors.textSecondary, success: colors.success, error: colors.destructive } as const;

/** Provides `useToast()`; renders one auto-dismissing toast at the top of the screen. */
export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const nextId = useRef(0);
  const show = useCallback((input: ToastInput) => setToast({ ...input, id: ++nextId.current }), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast ? <ToastView key={toast.id} toast={toast} onDone={() => setToast(null)} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return useMemo(() => ({ show }), [show]);
}

function ToastView({ toast, onDone }: { toast: ToastState; onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [opacity] = useState(() => new Animated.Value(0));
  const kind = toast.kind ?? "info";

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => onDone());
    }, toast.durationMs ?? 2500);
    return () => clearTimeout(timer);
  }, [opacity, onDone, toast.durationMs]);

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.toast, { top: insets.top + spacing.xs, opacity }]}
    >
      <Ionicons name={icons[kind]} size={18} color={tints[kind]} />
      <Text style={styles.text}>{toast.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceElevated,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: { ...typography.callout, color: colors.textPrimary },
});
