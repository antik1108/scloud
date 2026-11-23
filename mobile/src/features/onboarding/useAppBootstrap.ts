import { useEffect, useState } from "react";

import { parseAppConfig, type AppConfig } from "@/config/appConfig";
import { withTimeout } from "@/lib/async";
import type { RemoteConfigService } from "@/services/types";

/** Splash budget for Remote Config (SPEC.md O1). */
export const BOOTSTRAP_CONFIG_TIMEOUT_MS = 1500;
/** Hard cap so a hung native call can never keep the splash up. */
const HARD_CAP_MS = BOOTSTRAP_CONFIG_TIMEOUT_MS + 1000;

/**
 * Work done while the splash is visible. Resolves `ready` even when offline:
 * the app then runs on cached or default config.
 */
export function useAppBootstrap(remoteConfig: RemoteConfigService, setConfig: (config: AppConfig) => void) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await withTimeout(remoteConfig.load({ timeoutMs: BOOTSTRAP_CONFIG_TIMEOUT_MS }), HARD_CAP_MS);
        if (!cancelled) setConfig(parseAppConfig(raw));
      } catch {
        // Keep defaults.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [remoteConfig, setConfig]);

  return ready;
}
