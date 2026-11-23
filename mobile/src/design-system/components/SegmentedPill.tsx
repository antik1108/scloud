import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../tokens";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (option: T) => string;
  /** Locked (Pro) options show a crown and call `onLockedPress` instead of selecting. */
  isLocked?: (option: T) => boolean;
  onLockedPress?: (option: T) => void;
  testID?: string;
};

/** Pill segmented control: Female/Male, Weekly/Monthly, export settings rows. */
export function SegmentedPill<T extends string>({
  options,
  value,
  onChange,
  getLabel = (o) => o,
  isLocked = () => false,
  onLockedPress,
  testID,
}: Props<T>) {
  return (
    <View style={styles.track} accessibilityRole="radiogroup" testID={testID}>
      {options.map((option) => {
        const selected = option === value;
        const locked = isLocked(option);
        return (
          <Pressable
            key={option}
            onPress={() => (locked ? onLockedPress?.(option) : onChange(option))}
            accessibilityRole="radio"
            accessibilityLabel={locked ? `${getLabel(option)}, Pro` : getLabel(option)}
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Text style={[styles.label, selected ? styles.labelSelected : null]}>{getLabel(option)}</Text>
            {locked ? <Ionicons name="diamond" size={11} color={colors.accent} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xxs,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.s,
    borderRadius: radii.pill,
  },
  segmentSelected: { backgroundColor: colors.white },
  label: { ...typography.callout, color: colors.textSecondary },
  labelSelected: { color: colors.textOnLight, fontWeight: "600" },
});
