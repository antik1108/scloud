import Constants from "expo-constants";
import { Platform } from "react-native";

export type AppEnv = "dev" | "prod";

export type RuntimeEnv = {
  appEnv: AppEnv;
  /** True only for non-prod builds with EXPO_PUBLIC_USE_EMULATOR=1. */
  useEmulator: boolean;
  emulatorHost: string;
};

/** Must match firebase/firebase.json. */
export const EMULATOR_PORTS = { auth: 9099, firestore: 8085, storage: 9199, functions: 5001 } as const;
export const FUNCTIONS_REGION = "us-central1";

export function resolveRuntimeEnv(input: {
  appEnv: unknown;
  useEmulatorFlag?: string;
  emulatorHost?: string;
  platform: string;
}): RuntimeEnv {
  const appEnv: AppEnv = input.appEnv === "prod" ? "prod" : "dev";
  const useEmulator = appEnv !== "prod" && input.useEmulatorFlag === "1";
  const defaultHost = input.platform === "android" ? "10.0.2.2" : "127.0.0.1";
  return { appEnv, useEmulator, emulatorHost: input.emulatorHost || defaultHost };
}

export const runtimeEnv: RuntimeEnv = resolveRuntimeEnv({
  appEnv: Constants.expoConfig?.extra?.appEnv,
  useEmulatorFlag: process.env.EXPO_PUBLIC_USE_EMULATOR,
  emulatorHost: process.env.EXPO_PUBLIC_EMULATOR_HOST,
  platform: Platform.OS,
});
