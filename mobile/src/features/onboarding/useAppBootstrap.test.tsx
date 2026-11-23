import { act, renderHook, waitFor } from "@testing-library/react-native";

import { DEFAULT_APP_CONFIG } from "@/config/appConfig";

import { useAppBootstrap } from "./useAppBootstrap";

describe("useAppBootstrap", () => {
  it("applies fetched config and becomes ready", async () => {
    const setConfig = jest.fn();
    const remoteConfig = { load: async () => ({ magic_ai_new_badge: "false" }) };
    const { result } = await renderHook(() => useAppBootstrap(remoteConfig, setConfig));
    await waitFor(() => expect(result.current).toBe(true));
    expect(setConfig).toHaveBeenCalledWith({ ...DEFAULT_APP_CONFIG, magicAiNewBadge: false });
  });

  it("becomes ready with defaults when Remote Config fails (offline)", async () => {
    const setConfig = jest.fn();
    const remoteConfig = { load: () => Promise.reject(new Error("offline")) };
    const { result } = await renderHook(() => useAppBootstrap(remoteConfig, setConfig));
    await waitFor(() => expect(result.current).toBe(true));
    expect(setConfig).not.toHaveBeenCalled();
  });

  it("never blocks the splash on a hung native call", async () => {
    jest.useFakeTimers();
    try {
      const remoteConfig = { load: () => new Promise<never>(() => {}) };
      const { result } = await renderHook(() => useAppBootstrap(remoteConfig, jest.fn()));
      expect(result.current).toBe(false);
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
      expect(result.current).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});
