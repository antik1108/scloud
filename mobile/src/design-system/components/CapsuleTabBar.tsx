import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../tokens";

export type CapsuleTabItem = {
  key: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  badge?: string;
};

type Props = {
  items: readonly CapsuleTabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  bottomInset?: number;
};

/** Floating capsule tab bar (Photos / Magic AI / Videos / Settings). */
export function CapsuleTabBar({ items, activeKey, onSelect, bottomInset = 0 }: Props) {
  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(bottomInset, spacing.xs) }]} pointerEvents="box-none">
      <View style={styles.bar} accessibilityRole="tablist">
        {items.map((item) => {
          const active = item.key === activeKey;
          const tint = active ? colors.textPrimary : colors.textSecondary;
          return (
            <Pressable
              key={item.key}
              testID={`tab-${item.key}`}
              onPress={() => onSelect(item.key)}
              accessibilityRole="tab"
              accessibilityLabel={item.title}
              accessibilityState={{ selected: active }}
              style={[styles.item, active && styles.itemActive]}
            >
              <Ionicons name={item.icon} size={22} color={tint} />
              <Text style={[styles.label, { color: tint }]}>{item.title}</Text>
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.m },
  bar: {
    flexDirection: "row",
    padding: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: "rgba(28,28,32,0.94)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  item: { flex: 1, alignItems: "center", paddingVertical: spacing.xs, borderRadius: radii.pill, gap: 2 },
  itemActive: { backgroundColor: colors.surfaceElevated },
  label: typography.tabLabel,
  badge: {
    position: "absolute",
    top: 0,
    right: "14%",
    backgroundColor: colors.badge,
    borderRadius: radii.pill,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "700" },
});
