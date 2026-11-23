/** Service interfaces used by features. Implementations live in services/firebase etc.; fakes in services/fakes. */
import type { RawRemoteConfig } from "@/config/appConfig";

import type { PermissionsService } from "./permissions/types";
import type { KeyValueStore } from "./storage/types";

export type PingResult = {
  ok: true;
  env: "emulator" | "dev" | "prod";
  uid: string | null;
  serverTime: string;
};

export interface BackendHealthService {
  ping(): Promise<PingResult>;
}

export interface RemoteConfigService {
  /**
   * Applies defaults, tries to fetch+activate within `timeoutMs`, and returns raw values.
   * Never rejects: offline returns cached or default values.
   */
  load(options: { timeoutMs: number }): Promise<RawRemoteConfig>;
}

export type Services = {
  backendHealth: BackendHealthService;
  remoteConfig: RemoteConfigService;
  permissions: PermissionsService;
  storage: KeyValueStore;
};
