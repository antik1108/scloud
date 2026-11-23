/** Synchronous key-value store for small local settings and flags (not secrets). */
export interface KeyValueStore {
  getString(key: string): string | undefined;
  getBoolean(key: string): boolean | undefined;
  set(key: string, value: string | boolean): void;
  remove(key: string): void;
}

/** All storage keys in one place to avoid collisions. */
export const StorageKeys = {
  hasOnboarded: "onboarding.completed",
  trackingStatus: "onboarding.trackingStatus",
} as const;
