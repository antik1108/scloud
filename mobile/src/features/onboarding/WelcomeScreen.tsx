import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PillButton, colors, spacing, typography } from "@/design-system";
import type { SocialProof } from "@/config/appConfig";
import { t } from "@/i18n";

import { useWelcomeScreen } from "./useWelcomeScreen";

/** SPEC.md O2. Social proof renders only when Remote Config supplies real numbers. */
export function WelcomeScreen({ onFinished }: { onFinished: () => void }) {
  const { config, busy, getStarted, openLegal } = useWelcomeScreen(onFinished);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t("welcome.eyebrow")}</Text>
        <Text style={styles.title} accessibilityRole="header">
          {t("welcome.title")}
        </Text>
        <Text style={styles.tagline}>{t("welcome.tagline")}</Text>
      </View>

      <View style={styles.middle}>
        {config.socialProof ? <SocialProofBlock proof={config.socialProof} /> : <FeatureList />}
      </View>

      <View style={styles.footer}>
        <PillButton testID="get-started" title={t("welcome.getStarted")} loading={busy} onPress={getStarted} />
        <Text style={styles.legal}>
          {t("welcome.legalPrefix")}{" "}
          <Text style={styles.link} accessibilityRole="link" onPress={() => openLegal(config.privacyPolicyUrl)}>
            {t("welcome.privacyPolicy")}
          </Text>{" "}
          {t("welcome.and")}{" "}
          <Text style={styles.link} accessibilityRole="link" onPress={() => openLegal(config.termsUrl)}>
            {t("welcome.termsOfUse")}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

function SocialProofBlock({ proof }: { proof: SocialProof }) {
  return (
    <View style={styles.proof} testID="social-proof">
      <View style={styles.ratingRow}>
        <Text style={styles.rating}>{proof.rating.toFixed(1)}</Text>
        <Text style={styles.ratingOutOf}>{t("welcome.ratingOutOf")}</Text>
      </View>
      <Stars rating={proof.rating} />
      <Text style={styles.caption}>{t("welcome.ratingsCount", { count: proof.ratingsCount })}</Text>
      <Text style={styles.join}>{t("welcome.joinUsers", { count: proof.usersCount })}</Text>
      <Text style={styles.caption}>{t("welcome.joinUsersSubtitle")}</Text>
    </View>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {[1, 2, 3, 4, 5].map((i) => {
        const name = rating >= i ? "star" : rating >= i - 0.5 ? "star-half" : "star-outline";
        return <Ionicons key={i} name={name} size={18} color={colors.highlight} />;
      })}
    </View>
  );
}

function FeatureList() {
  const items = [
    { icon: "color-wand-outline", text: t("welcome.featureRetouch") },
    { icon: "sparkles-outline", text: t("welcome.featureMagic") },
    { icon: "film-outline", text: t("welcome.featureVideo") },
  ] as const;
  return (
    <View style={styles.features} testID="feature-list">
      {items.map((item) => (
        <View key={item.text} style={styles.featureRow}>
          <View style={styles.featureIcon}>
            <Ionicons name={item.icon} size={20} color={colors.accent} />
          </View>
          <Text style={styles.featureText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.gutter },
  header: { alignItems: "center", marginTop: spacing.xxl, gap: spacing.xs },
  eyebrow: { ...typography.headline, color: colors.textSecondary, fontWeight: "400" },
  title: { fontSize: 56, lineHeight: 64, fontWeight: "800", color: colors.textPrimary, letterSpacing: -1 },
  tagline: { ...typography.callout, color: colors.textSecondary },
  middle: { flex: 1, justifyContent: "center" },
  proof: { alignItems: "center", gap: spacing.xs },
  ratingRow: { flexDirection: "row", alignItems: "flex-end" },
  rating: { fontSize: 44, fontWeight: "700", color: colors.textPrimary },
  ratingOutOf: { ...typography.callout, color: colors.textSecondary, marginBottom: 8, marginLeft: 2 },
  stars: { flexDirection: "row", gap: 2 },
  join: { ...typography.title, color: colors.textPrimary, marginTop: spacing.l },
  caption: { ...typography.callout, color: colors.textSecondary },
  features: { gap: spacing.m, alignSelf: "center" },
  featureRow: { flexDirection: "row", alignItems: "center", gap: spacing.s },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { ...typography.body, color: colors.textPrimary },
  footer: { gap: spacing.m, paddingBottom: spacing.m },
  legal: { ...typography.caption, color: colors.textTertiary, textAlign: "center", lineHeight: 18 },
  link: { color: colors.textSecondary, textDecorationLine: "underline" },
});
