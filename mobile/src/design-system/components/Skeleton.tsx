import { useEffect, useState } from "react";
import { Animated, StyleSheet, View, type DimensionValue } from "react-native";

import { colors, radii } from "../tokens";

type Props = { width?: DimensionValue; height?: DimensionValue; radius?: number; aspectRatio?: number };

/** Pulsing placeholder block for loading states. */
export function SkeletonBlock({ width = "100%", height, radius = radii.s, aspectRatio }: Props) {
  const [opacity] = useState(() => new Animated.Value(0.5));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height, aspectRatio, borderRadius: radius, backgroundColor: colors.surfaceElevated, opacity }}
    />
  );
}

/** Grid of skeleton tiles, e.g. while the photo library loads. */
export function SkeletonGrid({ columns = 3, rows = 4, gap = 2 }: { columns?: number; rows?: number; gap?: number }) {
  return (
    <View style={[styles.grid, { gap }]} accessibilityLabel="Loading" accessible>
      {Array.from({ length: columns * rows }, (_, i) => (
        <View key={i} style={{ width: `${100 / columns - 1}%` }}>
          <SkeletonBlock aspectRatio={1} radius={4} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});
