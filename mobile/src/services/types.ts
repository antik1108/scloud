/** Service interfaces used by features. Implementations live in services/firebase; fakes in services/fakes. */

export type PingResult = {
  ok: true;
  env: "emulator" | "dev" | "prod";
  uid: string | null;
  serverTime: string;
};

export interface BackendHealthService {
  ping(): Promise<PingResult>;
}

export type Services = {
  backendHealth: BackendHealthService;
};
