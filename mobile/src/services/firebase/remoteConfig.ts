import { getApp } from "@react-native-firebase/app";
import { fetchAndActivate, getAll, getRemoteConfig } from "@react-native-firebase/remote-config";

import { REMOTE_CONFIG_DEFAULTS } from "@/config/appConfig";
import { withTimeout } from "@/lib/async";

import type { RemoteConfigService } from "../types";

const ONE_HOUR = 60 * 60 * 1000;

export const firebaseRemoteConfig: RemoteConfigService = {
  async load({ timeoutMs }) {
    const rc = getRemoteConfig(getApp());
    rc.settings = { minimumFetchIntervalMillis: __DEV__ ? 0 : ONE_HOUR, fetchTimeoutMillis: timeoutMs };
    rc.defaultConfig = REMOTE_CONFIG_DEFAULTS;
    try {
      await withTimeout(fetchAndActivate(rc), timeoutMs);
    } catch {
      // Offline or slow: fall through to cached/activated values or defaults.
    }
    return Object.fromEntries(Object.entries(getAll(rc)).map(([key, value]) => [key, value.asString()]));
  },
};
