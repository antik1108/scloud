import { fireEvent, screen } from "@testing-library/react-native";

import { createFakeServices } from "@/services/fakes";
import { createMemoryStore } from "@/services/storage/memory";
import { StorageKeys } from "@/services/storage/types";
import { renderWithProviders } from "@/test-utils";

import { DevToolsScreen } from "./DevToolsScreen";

describe("DevToolsScreen", () => {
  it("shows the server response after a successful ping", async () => {
    await renderWithProviders(<DevToolsScreen />);
    await fireEvent.press(screen.getByTestId("ping-button"));
    expect(await screen.findByTestId("ping-success")).toBeTruthy();
    expect(screen.getByText("emulator")).toBeTruthy();
  });

  it("shows friendly copy when the ping fails", async () => {
    const services = createFakeServices({
      backendHealth: { ping: () => Promise.reject(Object.assign(new Error("x"), { code: "functions/unavailable" })) },
    });
    await renderWithProviders(<DevToolsScreen />, { services });
    await fireEvent.press(screen.getByTestId("ping-button"));
    expect(await screen.findByText("You're offline. Check your connection.")).toBeTruthy();
  });

  it("resets onboarding", async () => {
    const services = createFakeServices({ storage: createMemoryStore({ [StorageKeys.hasOnboarded]: true }) });
    const { store } = await renderWithProviders(<DevToolsScreen />, { services });
    expect(store.getState().hasOnboarded).toBe(true);
    await fireEvent.press(screen.getByTestId("reset-onboarding"));
    expect(store.getState().hasOnboarded).toBe(false);
    expect(services.storage.getBoolean(StorageKeys.hasOnboarded)).toBeUndefined();
  });
});
