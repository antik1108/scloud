import { onCall } from "firebase-functions/v2/https";
import { currentEnvironment, REGION } from "./lib/env.js";

export interface PingResponse {
  ok: true;
  env: ReturnType<typeof currentEnvironment>;
  uid: string | null;
  serverTime: string;
}

export function buildPingResponse(uid: string | null, now = new Date()): PingResponse {
  return { ok: true, env: currentEnvironment(), uid, serverTime: now.toISOString() };
}

/** Phase 0 smoke-test callable: proves the app can reach Functions in each environment. */
export const ping = onCall(
  { region: REGION, enforceAppCheck: false, maxInstances: 5, timeoutSeconds: 10 },
  (request) => buildPingResponse(request.auth?.uid ?? null),
);
