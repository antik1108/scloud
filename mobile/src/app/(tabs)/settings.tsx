import { router } from "expo-router";
import { View } from "react-native";

import { PillButton, SectionHeader } from "@/design-system";
import { PlaceholderScreen } from "@/features/placeholder/PlaceholderScreen";
import { t } from "@/i18n";
import { runtimeEnv } from "@/lib/env";

export default function SettingsTab() {
  return (
    <PlaceholderScreen title={t("tabs.settings")} phase="Phase 8">
      {runtimeEnv.appEnv === "dev" ? (
        <View style={{ gap: 12 }}>
          <SectionHeader title="Developer" />
          <PillButton title="Developer tools" variant="secondary" onPress={() => router.push("/dev-tools")} />
          <PillButton title="Design system" variant="secondary" onPress={() => router.push("/design-system")} />
        </View>
      ) : null}
    </PlaceholderScreen>
  );
}
