import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing, typography } from "../tokens";

type Props = PropsWithChildren<{
  /** Large left-aligned title ("Photos", "Settings"). */
  title?: string;
  /** Element shown to the right of the title (e.g. Upgrade pill). */
  accessory?: ReactNode;
  scroll?: boolean;
  /** Extra bottom padding so content clears the floating tab bar. */
  tabBarSpacing?: boolean;
}>;

/** Standard dark screen container with an optional large title. */
export function Screen({ title, accessory, scroll = true, tabBarSpacing = false, children }: Props) {
  const header = title ? (
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {accessory}
    </View>
  ) : null;
  const bottom = tabBarSpacing ? 110 : spacing.l;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottom }]}>
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill, { paddingBottom: bottom }]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  content: { paddingHorizontal: spacing.gutter, gap: spacing.m },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.l,
    marginBottom: spacing.xs,
  },
  title: { ...typography.display, color: colors.textSecondary },
});
