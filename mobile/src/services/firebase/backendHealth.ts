import { getApp } from "@react-native-firebase/app";
import { getFunctions, httpsCallable } from "@react-native-firebase/functions";

import { FUNCTIONS_REGION } from "@/lib/env";

import type { BackendHealthService, PingResult } from "../types";

export const firebaseBackendHealth: BackendHealthService = {
  async ping() {
    const ping = httpsCallable<Record<string, never>, PingResult>(
      getFunctions(getApp(), FUNCTIONS_REGION),
      "ping",
    );
    const result = await ping({});
    return result.data;
  },
};
