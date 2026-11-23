import { createExpoPermissionsService } from "../permissions/expoPermissions";
import { createMMKVStore } from "../storage/mmkv";
import type { Services } from "../types";
import { firebaseBackendHealth } from "./backendHealth";
import { firebaseNotificationPermission } from "./notificationPermission";
import { firebaseRemoteConfig } from "./remoteConfig";

export { initFirebase } from "./bootstrap";

export function createLiveServices(): Services {
  return {
    backendHealth: firebaseBackendHealth,
    remoteConfig: firebaseRemoteConfig,
    permissions: createExpoPermissionsService(firebaseNotificationPermission),
    storage: createMMKVStore(),
  };
}
