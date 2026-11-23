import { Tabs } from "expo-router";

import { CapsuleTabBar, colors } from "@/design-system";
import { MAIN_TABS } from "@/features/navigation/tabs";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
      tabBar={({ state, navigateToTab, insets }) => (
        <CapsuleTabBar
          items={MAIN_TABS}
          activeKey={state.routes[state.index]?.name ?? MAIN_TABS[0].key}
          bottomInset={insets.bottom}
          onSelect={(name) => {
            // navigateToTab expects the route *key*; our tab items are keyed by route *name*.
            const route = state.routes.find((r) => r.name === name);
            if (route) navigateToTab(route.key);
          }}
        />
      )}
    >
      {MAIN_TABS.map((tab) => (
        <Tabs.Screen key={tab.key} name={tab.key} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}
