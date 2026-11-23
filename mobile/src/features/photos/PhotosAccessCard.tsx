import { StyleSheet, Text, View } from "react-native";

import { Card, PillButton, SkeletonBlock, colors, spacing, typography } from "@/design-system";
import { t } from "@/i18n";
import { usePermission } from "@/services/permissions/usePermission";

/** Photos tab empty state (SPEC.md H1/H2) for every photo-library permission state. */
export function PhotosAccessCard() {
  const { status, request, openSettings, manageLimitedPhotos } = usePermission("photos");

  if (status === null) {
    return <SkeletonBlock height={320} radius={24} />;
  }

  return (
    <Card style={styles.card}>
      <View style={styles.body} testID={`photos-access-${status}`}>
        <Text style={styles.title}>{t("permissions.photos.title")}</Text>
        {status === "undetermined" || status === "denied" ? (
          <>
            <Text style={styles.message}>{t("permissions.photos.message")}</Text>
            <PillButton
              testID="photos-request"
              title={t("permissions.photos.action")}
              variant="secondary"
              compact
              style={styles.button}
              onPress={() => void request()}
            />
          </>
        ) : null}
        {status === "blocked" ? (
          <>
            <Text style={styles.message}>{t("permissions.photos.blockedMessage")}</Text>
            <PillButton
              testID="photos-open-settings"
              title={t("common.openSettings")}
              variant="secondary"
              compact
              style={styles.button}
              onPress={() => void openSettings()}
            />
          </>
        ) : null}
        {status === "limited" ? (
          <>
            <Text style={styles.message}>{t("permissions.photos.limitedMessage")}</Text>
            <PillButton
              testID="photos-manage"
              title={t("permissions.photos.manageAccess")}
              variant="secondary"
              compact
              style={styles.button}
              onPress={() => void manageLimitedPhotos()}
            />
          </>
        ) : null}
        {status === "granted" ? <Text style={styles.message}>{t("permissions.photos.grantedMessage")}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 320, justifyContent: "center" },
  body: { alignItems: "center", gap: spacing.s, paddingHorizontal: spacing.m },
  title: { ...typography.headline, color: colors.textPrimary, textAlign: "center" },
  message: { ...typography.callout, color: colors.textSecondary, textAlign: "center" },
  button: { alignSelf: "center", marginTop: spacing.s },
});
