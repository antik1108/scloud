import { fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ServicesProvider } from "@/services/ServicesProvider";
import { createFakeServices } from "@/services/fakes";
import type { Services } from "@/services/types";

import { DevToolsScreen } from "./DevToolsScreen";

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

function renderWith(services: Services) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ServicesProvider services={services}>
        <DevToolsScreen />
      </ServicesProvider>
    </SafeAreaProvider>,
  );
}

describe("DevToolsScreen", () => {
  it("shows the server response after a successful ping", async () => {
    await renderWith(createFakeServices());
    await fireEvent.press(screen.getByTestId("ping-button"));
    expect(await screen.findByTestId("ping-success")).toBeTruthy();
    expect(screen.getByText("emulator")).toBeTruthy();
  });

  it("shows friendly copy when the ping fails", async () => {
    const services = createFakeServices({
      backendHealth: { ping: () => Promise.reject(Object.assign(new Error("x"), { code: "functions/unavailable" })) },
    });
    await renderWith(services);
    await fireEvent.press(screen.getByTestId("ping-button"));
    expect(await screen.findByText("You're offline. Check your connection.")).toBeTruthy();
  });
});
