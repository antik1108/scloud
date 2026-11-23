import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

import { colors, spacing } from "@/design-system";
import { t } from "@/i18n";

const logo = require("../../../assets/splash-icon.png");

/**
 * JS continuation of the native splash (SPEC.md O1): same background and mark, plus the wordmark.
 * Hides the native splash once drawn and fades out when `ready`.
 */
export function SplashOverlay({ ready }: { ready: boolean }) {
  const [opacity] = useState(() => new Animated.Value(1));
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => setGone(true));
  }, [ready, opacity]);

  if (gone) return null;

  return (
    <Animated.View
      testID="splash"
      style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
      pointerEvents={ready ? "none" : "auto"}
      onLayout={() => void SplashScreen.hideAsync().catch(() => {})}
      accessibilityLabel={t("splash.wordmark")}
    >
      <Image source={logo} style={styles.logo} contentFit="contain" />
      <Text style={styles.wordmark}>{t("splash.wordmark")}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: spacing.m },
  logo: { width: 120, height: 120 },
  wordmark: { color: colors.textPrimary, fontSize: 32, fontWeight: "700", letterSpacing: 0.5 },
});
