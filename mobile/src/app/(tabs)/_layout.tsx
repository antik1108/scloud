import { Tabs } from "expo-router";
import { useMemo } from "react";

import { CapsuleTabBar, colors } from "@/design-system";
import { MAIN_TABS, buildTabItems } from "@/features/navigation/tabs";
import { t } from "@/i18n";
import { useAppStore } from "@/stores/appStore";

export default function TabsLayout() {
  const magicAiNewBadge = useAppStore((s) => s.config.magicAiNewBadge);
  const items = useMemo(() => buildTabItems({ magicAiNewBadge }), [magicAiNewBadge]);

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
      tabBar={({ state, navigateToTab, insets }) => (
        <CapsuleTabBar
          items={items}
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
        <Tabs.Screen key={tab.key} name={tab.key} options={{ title: t(tab.titleKey) }} />
      ))}
    </Tabs>
  );
}
