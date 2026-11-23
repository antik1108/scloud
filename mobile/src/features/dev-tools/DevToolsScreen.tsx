import { StyleSheet, Text, View } from "react-native";

import { Card, PillButton, Screen, SectionHeader, colors, spacing, typography } from "@/design-system";

import { PermissionsPanel } from "./PermissionsPanel";
import { useDevToolsScreen } from "./useDevToolsScreen";

/** Phase 0 smoke test: shows the runtime environment and pings the backend. */
export function DevToolsScreen() {
  const { env, ping, runPing, hasOnboarded, resetOnboarding } = useDevToolsScreen();

  return (
    <Screen>
      <View>
        <SectionHeader title="Environment" />
        <Card style={styles.rows}>
          <Row label="App env" value={env.appEnv} />
          <Row label="Firebase emulator" value={env.useEmulator ? `on (${env.emulatorHost})` : "off"} />
          <Row label="Onboarded" value={hasOnboarded ? "yes" : "no"} />
        </Card>
      </View>

      <View>
        <SectionHeader title="Permissions" />
        <Card>
          <PermissionsPanel />
        </Card>
      </View>

      <View>
        <SectionHeader title="Onboarding" />
        <PillButton
          testID="reset-onboarding"
          title="Reset onboarding"
          variant="destructive"
          onPress={resetOnboarding}
        />
      </View>

      <View>
        <SectionHeader title="Backend" />
        <Card style={styles.rows}>
          <PillButton
            testID="ping-button"
            title="Ping backend"
            variant="secondary"
            loading={ping.status === "loading"}
            onPress={runPing}
          />
          {ping.status === "success" ? (
            <View testID="ping-success" style={styles.rows}>
              <Row label="Server env" value={ping.result.env} />
              <Row label="Signed-in uid" value={ping.result.uid ?? "none"} />
              <Row label="Server time" value={ping.result.serverTime} />
            </View>
          ) : null}
          {ping.status === "error" ? (
            <Text testID="ping-error" style={styles.error}>
              {ping.message}
            </Text>
          ) : null}
        </Card>
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { gap: spacing.s },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.m },
  label: { ...typography.callout, color: colors.textSecondary },
  value: { ...typography.callout, color: colors.textPrimary, flexShrink: 1, textAlign: "right" },
  error: { ...typography.callout, color: colors.destructive },
});
