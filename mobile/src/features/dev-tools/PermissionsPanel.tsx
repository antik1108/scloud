import { StyleSheet, Text, View } from "react-native";

import { PillButton, colors, spacing, typography } from "@/design-system";
import type { PermissionKind } from "@/services/permissions/types";
import { usePermission } from "@/services/permissions/usePermission";

const KINDS: readonly PermissionKind[] = ["photos", "camera", "notifications", "tracking"];

/** Dev-only: see and exercise every permission state. */
export function PermissionsPanel() {
  return (
    <View style={styles.list}>
      {KINDS.map((kind) => (
        <PermissionRow key={kind} kind={kind} />
      ))}
    </View>
  );
}

function PermissionRow({ kind }: { kind: PermissionKind }) {
  const { status, request, openSettings } = usePermission(kind);
  const blocked = status === "blocked";
  return (
    <View style={styles.row} testID={`perm-${kind}`}>
      <View style={styles.text}>
        <Text style={styles.kind}>{kind}</Text>
        <Text style={styles.status}>{status ?? "…"}</Text>
      </View>
      <PillButton
        title={blocked ? "Settings" : "Request"}
        variant="secondary"
        compact
        onPress={() => void (blocked ? openSettings() : request())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.s },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  text: { gap: 2 },
  kind: { ...typography.callout, color: colors.textPrimary, textTransform: "capitalize" },
  status: { ...typography.caption, color: colors.textSecondary },
});
