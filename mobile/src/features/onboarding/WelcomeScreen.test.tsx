import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { DEFAULT_APP_CONFIG } from "@/config/appConfig";
import { createFakePermissions, createFakeServices } from "@/services/fakes";
import { createMemoryStore } from "@/services/storage/memory";
import { createAppStore } from "@/stores/appStore";
import { renderWithProviders } from "@/test-utils";

import { WelcomeScreen } from "./WelcomeScreen";

describe("WelcomeScreen", () => {
  it("shows the feature list when no social proof is configured", async () => {
    await renderWithProviders(<WelcomeScreen onFinished={jest.fn()} />);
    expect(screen.getByTestId("feature-list")).toBeTruthy();
    expect(screen.queryByTestId("social-proof")).toBeNull();
  });

  it("shows social proof from Remote Config", async () => {
    const services = createFakeServices();
    const store = createAppStore(services.storage, {
      ...DEFAULT_APP_CONFIG,
      socialProof: { rating: 4.8, ratingsCount: "12K+", usersCount: "1M+" },
    });
    await renderWithProviders(<WelcomeScreen onFinished={jest.fn()} />, { services, store });
    expect(screen.getByText("4.8")).toBeTruthy();
    expect(screen.getByText("Join 1M+ users")).toBeTruthy();
  });

  it("asks for tracking, completes onboarding and finishes", async () => {
    const permissions = createFakePermissions({}, () => "blocked");
    const services = createFakeServices({ permissions, storage: createMemoryStore() });
    const onFinished = jest.fn();
    const { store } = await renderWithProviders(<WelcomeScreen onFinished={onFinished} />, { services });

    await fireEvent.press(screen.getByTestId("get-started"));

    await waitFor(() => expect(onFinished).toHaveBeenCalledTimes(1));
    expect(permissions.calls.request).toEqual(["tracking"]);
    expect(store.getState()).toMatchObject({ hasOnboarded: true, trackingStatus: "blocked" });
  });

  it("does not re-prompt when tracking was already answered", async () => {
    const permissions = createFakePermissions({ tracking: "granted" });
    const onFinished = jest.fn();
    await renderWithProviders(<WelcomeScreen onFinished={onFinished} />, {
      services: createFakeServices({ permissions }),
    });
    await fireEvent.press(screen.getByTestId("get-started"));
    await waitFor(() => expect(onFinished).toHaveBeenCalled());
    expect(permissions.calls.request).toEqual([]);
  });

  it("still finishes onboarding when the tracking prompt throws", async () => {
    const permissions = createFakePermissions();
    permissions.check = () => Promise.reject(new Error("native failure"));
    const onFinished = jest.fn();
    const { store } = await renderWithProviders(<WelcomeScreen onFinished={onFinished} />, {
      services: createFakeServices({ permissions }),
    });
    await fireEvent.press(screen.getByTestId("get-started"));
    await waitFor(() => expect(onFinished).toHaveBeenCalled());
    expect(store.getState()).toMatchObject({ hasOnboarded: true, trackingStatus: null });
  });
});
