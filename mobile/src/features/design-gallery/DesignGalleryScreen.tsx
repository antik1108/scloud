import { useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  CapsuleTabBar,
  Card,
  EmptyState,
  PillButton,
  Screen,
  SectionHeader,
  SegmentedPill,
  SkeletonGrid,
  colors,
  radii,
  spacing,
  useToast,
} from "@/design-system";
import { MAIN_TABS } from "@/features/navigation/tabs";

const swatches = [colors.background, colors.surface, colors.surfaceElevated, colors.accent, colors.highlight, colors.destructive];

/** Dev-only catalogue of design-system components. */
export function DesignGalleryScreen() {
  const toast = useToast();
  const [plan, setPlan] = useState<"Weekly" | "Monthly">("Weekly");
  const [resolution, setResolution] = useState<"FullHD" | "4K" | "Max">("4K");
  const [tab, setTab] = useState<string>(MAIN_TABS[0].key);

  return (
    <Screen>
      <SectionHeader title="Colours" />
      <View style={styles.swatches}>
        {swatches.map((c) => (
          <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
        ))}
      </View>

      <SectionHeader title="Buttons" />
      <PillButton title="Primary" onPress={() => toast.show({ text: "Primary tapped", kind: "success" })} />
      <PillButton title="Continue with Email" icon="mail-outline" variant="secondary" onPress={() => {}} />
      <View style={styles.row}>
        <PillButton title="Upgrade" icon="diamond" variant="accent" compact onPress={() => {}} />
        <PillButton title="My creations" variant="highlight" compact onPress={() => {}} />
      </View>
      <PillButton title="Continue" variant="highlight" loading onPress={() => {}} />
      <PillButton title="Delete Account & Data" variant="destructive" onPress={() => {}} />

      <SectionHeader title="Segmented" />
      <SegmentedPill options={["Weekly", "Monthly"] as const} value={plan} onChange={setPlan} />
      <SegmentedPill
        options={["FullHD", "4K", "Max"] as const}
        value={resolution}
        onChange={setResolution}
        isLocked={(o) => o === "Max"}
        onLockedPress={() => toast.show({ text: "Max is a Pro feature" })}
      />

      <SectionHeader title="Card & empty state" />
      <Card>
        <EmptyState title="No creations yet" message="All your generations will be saved here" />
      </Card>

      <SectionHeader title="Skeleton" />
      <SkeletonGrid rows={2} />

      <SectionHeader title="Tab bar" />
      <View style={styles.tabBarDemo}>
        <CapsuleTabBar items={MAIN_TABS} activeKey={tab} onSelect={setTab} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  swatches: { flexDirection: "row", gap: spacing.xs },
  swatch: { flex: 1, height: 40, borderRadius: radii.s, borderWidth: 1, borderColor: colors.separator },
  row: { flexDirection: "row", gap: spacing.s },
  tabBarDemo: { height: 80 },
});
