import type { PingResult, Services } from "./types";

export const fakePingResult: PingResult = {
  ok: true,
  env: "emulator",
  uid: null,
  serverTime: "2026-01-01T00:00:00.000Z",
};

/** In-memory services for tests and the design gallery. */
export function createFakeServices(overrides: Partial<Services> = {}): Services {
  return {
    backendHealth: { ping: async () => fakePingResult },
    ...overrides,
  };
}
