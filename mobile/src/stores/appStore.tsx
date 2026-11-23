import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { createStore, useStore, type StoreApi } from "zustand";

import { DEFAULT_APP_CONFIG, type AppConfig } from "@/config/appConfig";
import { StorageKeys, type KeyValueStore } from "@/services/storage/types";
import type { PermissionStatus } from "@/services/permissions/types";

export type AppState = {
  /** True once the user has finished Welcome (+ ATT). Persisted. */
  hasOnboarded: boolean;
  /** Last known App Tracking Transparency answer. Persisted; Phase 9 maps it to analytics consent. */
  trackingStatus: PermissionStatus | null;
  config: AppConfig;
  completeOnboarding: (trackingStatus: PermissionStatus | null) => void;
  setConfig: (config: AppConfig) => void;
  /** Dev tools only. */
  resetOnboarding: () => void;
};

export type AppStore = StoreApi<AppState>;

const TRACKING_VALUES: readonly PermissionStatus[] = ["undetermined", "granted", "limited", "denied", "blocked"];

export function createAppStore(kv: KeyValueStore, config: AppConfig = DEFAULT_APP_CONFIG): AppStore {
  const storedTracking = kv.getString(StorageKeys.trackingStatus);
  return createStore<AppState>()((set) => ({
    hasOnboarded: kv.getBoolean(StorageKeys.hasOnboarded) ?? false,
    trackingStatus: TRACKING_VALUES.find((v) => v === storedTracking) ?? null,
    config,
    completeOnboarding: (trackingStatus) => {
      kv.set(StorageKeys.hasOnboarded, true);
      if (trackingStatus) kv.set(StorageKeys.trackingStatus, trackingStatus);
      set({ hasOnboarded: true, trackingStatus });
    },
    setConfig: (next) => set({ config: next }),
    resetOnboarding: () => {
      kv.remove(StorageKeys.hasOnboarded);
      kv.remove(StorageKeys.trackingStatus);
      set({ hasOnboarded: false, trackingStatus: null });
    },
  }));
}

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ store, children }: PropsWithChildren<{ store: AppStore }>) {
  const [value] = useState(store);
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error("useAppStore must be used inside <AppStoreProvider>");
  return useStore(store, selector);
}
