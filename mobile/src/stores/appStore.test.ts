import { createMemoryStore } from "@/services/storage/memory";
import { StorageKeys } from "@/services/storage/types";

import { createAppStore } from "./appStore";

describe("appStore", () => {
  it("starts not onboarded on a fresh install", () => {
    expect(createAppStore(createMemoryStore()).getState().hasOnboarded).toBe(false);
  });

  it("persists onboarding completion and tracking answer", () => {
    const kv = createMemoryStore();
    createAppStore(kv).getState().completeOnboarding("denied");
    const reopened = createAppStore(kv).getState();
    expect(reopened.hasOnboarded).toBe(true);
    expect(reopened.trackingStatus).toBe("denied");
  });

  it("ignores corrupt persisted tracking values", () => {
    const kv = createMemoryStore({ [StorageKeys.trackingStatus]: "nonsense" });
    expect(createAppStore(kv).getState().trackingStatus).toBeNull();
  });

  it("resetOnboarding clears persisted state", () => {
    const kv = createMemoryStore();
    const store = createAppStore(kv);
    store.getState().completeOnboarding("granted");
    store.getState().resetOnboarding();
    expect(createAppStore(kv).getState().hasOnboarded).toBe(false);
  });
});
