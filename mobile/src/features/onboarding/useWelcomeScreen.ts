import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useState } from "react";

import { useServices } from "@/services/ServicesProvider";
import type { PermissionStatus } from "@/services/permissions/types";
import { useAppStore } from "@/stores/appStore";

/**
 * Welcome (O2) → ATT (O3). The app must behave identically whatever the user answers,
 * so tracking failures never block onboarding.
 */
export function useWelcomeScreen(onFinished: () => void) {
  const { permissions } = useServices();
  const config = useAppStore((s) => s.config);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [busy, setBusy] = useState(false);

  const getStarted = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    let tracking: PermissionStatus | null = null;
    try {
      const current = await permissions.check("tracking");
      tracking = current === "undetermined" ? await permissions.request("tracking") : current;
    } catch {
      tracking = null;
    }
    completeOnboarding(tracking);
    onFinished();
  }, [busy, permissions, completeOnboarding, onFinished]);

  const openLegal = useCallback((url: string) => {
    openBrowserAsync(url).catch(() => {});
  }, []);

  return { config, busy, getStarted, openLegal };
}
