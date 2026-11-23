import { render } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from "@/design-system";
import { ServicesProvider } from "@/services/ServicesProvider";
import { createFakeServices } from "@/services/fakes";
import type { Services } from "@/services/types";
import { AppStoreProvider, createAppStore, type AppStore } from "@/stores/appStore";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

/** Renders `ui` inside every app-level provider, with fakes by default. */
export async function renderWithProviders(
  ui: ReactElement,
  { services = createFakeServices(), store }: { services?: Services; store?: AppStore } = {},
) {
  const appStore = store ?? createAppStore(services.storage);
  const result = await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ServicesProvider services={services}>
        <AppStoreProvider store={appStore}>
          <ToastProvider>{ui}</ToastProvider>
        </AppStoreProvider>
      </ServicesProvider>
    </SafeAreaProvider>,
  );
  return { ...result, services, store: appStore };
}
