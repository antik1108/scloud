import { getApp } from "@react-native-firebase/app";
import { initializeAppCheck, ReactNativeFirebaseAppCheckProvider } from "@react-native-firebase/app-check";
import { connectAuthEmulator, getAuth } from "@react-native-firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "@react-native-firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "@react-native-firebase/functions";
import { connectStorageEmulator, getStorage } from "@react-native-firebase/storage";

import { EMULATOR_PORTS, FUNCTIONS_REGION, type RuntimeEnv } from "@/lib/env";

let initialized = false;

/**
 * Wires Firebase for the current environment. Must run before any Firebase call.
 * Native Firebase itself is initialised from GoogleService-Info.plist / google-services.json.
 */
export function initFirebase(env: RuntimeEnv): void {
  if (initialized) return;
  initialized = true;

  const app = getApp();

  if (env.useEmulator) {
    const host = env.emulatorHost;
    connectAuthEmulator(getAuth(app), `http://${host}:${EMULATOR_PORTS.auth}`);
    connectFirestoreEmulator(getFirestore(app), host, EMULATOR_PORTS.firestore);
    connectStorageEmulator(getStorage(app), host, EMULATOR_PORTS.storage);
    connectFunctionsEmulator(getFunctions(app, FUNCTIONS_REGION), host, EMULATOR_PORTS.functions);
  }

  const provider = new ReactNativeFirebaseAppCheckProvider();
  provider.configure({
    apple: { provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback" },
    android: { provider: __DEV__ ? "debug" : "playIntegrity" },
  });
  try {
    initializeAppCheck(app, { provider, isTokenAutoRefreshEnabled: true });
  } catch (error) {
    console.warn("App Check init failed", error);
  }
}
