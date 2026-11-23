import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { useServices } from "../ServicesProvider";
import type { PermissionKind, PermissionStatus } from "./types";

/**
 * Current status of one permission, re-checked whenever the app returns to the foreground
 * (e.g. after the user flips the switch in Settings). `status` is null until the first check.
 */
export function usePermission(kind: PermissionKind) {
  const { permissions } = useServices();
  const [status, setStatus] = useState<PermissionStatus | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await permissions.check(kind));
    } catch {
      setStatus("undetermined");
    }
  }, [kind, permissions]);

  useEffect(() => {
    let active = true;
    const check = () => {
      permissions.check(kind).then(
        (next) => active && setStatus(next),
        () => active && setStatus("undetermined"),
      );
    };
    check();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") check();
    });
    return () => {
      active = false;
      sub.remove();
    };
  }, [kind, permissions]);

  const request = useCallback(async () => {
    const next = await permissions.request(kind);
    setStatus(next);
    return next;
  }, [kind, permissions]);

  return {
    status,
    request,
    refresh,
    openSettings: permissions.openSettings,
    manageLimitedPhotos: permissions.manageLimitedPhotos,
  };
}
