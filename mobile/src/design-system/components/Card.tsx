import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, radii, spacing, typography } from "../tokens";

/** Rounded grey container for grouped content. */
export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Uppercase label above a card ("PROFILE", "SUBSCRIPTION"). */
export function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionHeader} accessibilityRole="header">
      {title.toUpperCase()}
    </Text>
  );
}

/** Centered empty state ("No creations yet"). */
export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.l, padding: spacing.m },
  sectionHeader: {
    ...typography.sectionHeader,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xxs,
  },
  empty: { alignItems: "center", padding: spacing.l, gap: spacing.xs },
  emptyTitle: { ...typography.headline, color: colors.textSecondary, textAlign: "center" },
  emptyMessage: { ...typography.callout, color: colors.textTertiary, textAlign: "center" },
});
