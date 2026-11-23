import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radii, spacing, typography } from "../tokens";

export type PillButtonVariant = "primary" | "secondary" | "accent" | "highlight" | "destructive";

export type PillButtonProps = {
  title: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  icon?: ComponentProps<typeof Ionicons>["name"];
  loading?: boolean;
  disabled?: boolean;
  /** Content-width pill (e.g. "Upgrade") instead of full width. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const palette: Record<PillButtonVariant, { bg: string; fg: string }> = {
  primary: { bg: colors.white, fg: colors.textOnLight },
  secondary: { bg: colors.surfaceElevated, fg: colors.textPrimary },
  accent: { bg: colors.accent, fg: colors.textOnLight },
  highlight: { bg: colors.highlight, fg: colors.textOnLight },
  destructive: { bg: colors.surfaceElevated, fg: colors.destructive },
};

/** Capsule button for primary actions ("Get Started", "Subscribe Now", "Upgrade"). */
export function PillButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  compact = false,
  style,
  testID,
}: PillButtonProps) {
  const { bg, fg } = palette[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.full,
        { backgroundColor: bg, opacity: disabled ? 0.45 : 1 },
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.content, loading && styles.hidden]}>
        {icon ? <Ionicons name={icon} size={compact ? 16 : 18} color={fg} /> : null}
        <Text style={[compact ? styles.labelCompact : styles.label, { color: fg }]}>{title}</Text>
      </View>
      {loading ? <ActivityIndicator style={StyleSheet.absoluteFill} color={fg} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.pill, alignItems: "center", justifyContent: "center" },
  full: { alignSelf: "stretch", paddingVertical: spacing.m, paddingHorizontal: spacing.l },
  compact: { alignSelf: "flex-start", paddingVertical: spacing.xs, paddingHorizontal: spacing.m },
  pressed: { transform: [{ scale: 0.97 }] },
  content: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  hidden: { opacity: 0 },
  label: typography.headline,
  labelCompact: { ...typography.callout, fontWeight: "600" },
});
