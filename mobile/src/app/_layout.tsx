import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider, colors } from "@/design-system";
import { runtimeEnv } from "@/lib/env";
import { ServicesProvider } from "@/services/ServicesProvider";
import { createLiveServices, initFirebase } from "@/services/firebase";

// Runs once, before any screen can touch Firebase.
initFirebase(runtimeEnv);
const services = createLiveServices();

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <ServicesProvider services={services}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  headerStyle: { backgroundColor: colors.background },
                  headerTintColor: colors.textPrimary,
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="dev-tools" options={{ headerShown: true, title: "Developer tools" }} />
                <Stack.Screen name="design-system" options={{ headerShown: true, title: "Design system" }} />
              </Stack>
            </ToastProvider>
          </QueryClientProvider>
        </ServicesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
