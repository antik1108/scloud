import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider, colors } from "@/design-system";
import { SplashOverlay } from "@/features/onboarding/SplashOverlay";
import { useAppBootstrap } from "@/features/onboarding/useAppBootstrap";
import { runtimeEnv } from "@/lib/env";
import { ServicesProvider, useServices } from "@/services/ServicesProvider";
import { createLiveServices, initFirebase } from "@/services/firebase";
import { AppStoreProvider, createAppStore, useAppStore } from "@/stores/appStore";

// Module scope: runs once, before any screen renders or touches Firebase.
void SplashScreen.preventAutoHideAsync().catch(() => {});
initFirebase(runtimeEnv);
const services = createLiveServices();
const appStore = createAppStore(services.storage);

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <ServicesProvider services={services}>
          <AppStoreProvider store={appStore}>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <StatusBar style="light" />
                <RootNavigator />
              </ToastProvider>
            </QueryClientProvider>
          </AppStoreProvider>
        </ServicesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const { remoteConfig } = useServices();
  const setConfig = useAppStore((s) => s.setConfig);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  const ready = useAppBootstrap(remoteConfig, setConfig);

  // The navigator always mounts (expo-router requires it); the splash overlays it until ready.
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
        }}
      >
        <Stack.Protected guard={!hasOnboarded}>
          <Stack.Screen name="welcome" options={{ animation: "fade" }} />
        </Stack.Protected>
        <Stack.Protected guard={hasOnboarded}>
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="dev-tools" options={{ headerShown: true, title: "Developer tools" }} />
          <Stack.Screen name="design-system" options={{ headerShown: true, title: "Design system" }} />
        </Stack.Protected>
      </Stack>
      <SplashOverlay ready={ready} />
    </>
  );
}
