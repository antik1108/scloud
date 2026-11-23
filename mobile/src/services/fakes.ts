import type { PermissionKind, PermissionStatus, PermissionsService } from "./permissions/types";
import { createMemoryStore } from "./storage/memory";
import type { PingResult, Services } from "./types";

export const fakePingResult: PingResult = {
  ok: true,
  env: "emulator",
  uid: null,
  serverTime: "2026-01-01T00:00:00.000Z",
};

/** Permissions fake: `statuses` is the current state; `onRequest` decides the answer to a prompt. */
export function createFakePermissions(
  statuses: Partial<Record<PermissionKind, PermissionStatus>> = {},
  onRequest: (kind: PermissionKind) => PermissionStatus = () => "granted",
): PermissionsService & { calls: { request: PermissionKind[]; openSettings: number; manageLimitedPhotos: number } } {
  const current = { ...statuses };
  const calls = { request: [] as PermissionKind[], openSettings: 0, manageLimitedPhotos: 0 };
  return {
    calls,
    check: async (kind) => current[kind] ?? "undetermined",
    request: async (kind) => {
      calls.request.push(kind);
      current[kind] = onRequest(kind);
      return current[kind];
    },
    openSettings: async () => void calls.openSettings++,
    manageLimitedPhotos: async () => void calls.manageLimitedPhotos++,
  };
}

/** In-memory services for tests and the design gallery. */
export function createFakeServices(overrides: Partial<Services> = {}): Services {
  return {
    backendHealth: { ping: async () => fakePingResult },
    remoteConfig: { load: async () => ({}) },
    permissions: createFakePermissions(),
    storage: createMemoryStore(),
    ...overrides,
  };
}
