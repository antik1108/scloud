import type { Services } from "../types";
import { firebaseBackendHealth } from "./backendHealth";

export { initFirebase } from "./bootstrap";

export function createLiveServices(): Services {
  return { backendHealth: firebaseBackendHealth };
}
