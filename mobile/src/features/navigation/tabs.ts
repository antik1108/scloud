import type { CapsuleTabItem } from "@/design-system";
import { t, type TranslationKey } from "@/i18n";

type MainTab = { key: string; titleKey: TranslationKey; icon: CapsuleTabItem["icon"] };

/** The four main tabs (SPEC.md §3). `key` must match the route file name in src/app/(tabs). */
export const MAIN_TABS = [
  { key: "photos", titleKey: "tabs.photos", icon: "image-outline" },
  { key: "magic-ai", titleKey: "tabs.magicAI", icon: "sparkles-outline" },
  { key: "videos", titleKey: "tabs.videos", icon: "film-outline" },
  { key: "settings", titleKey: "tabs.settings", icon: "settings-outline" },
] as const satisfies readonly MainTab[];

export type MainTabKey = (typeof MAIN_TABS)[number]["key"];

/** Tab bar items with translated titles; the Magic AI "NEW" badge is controlled by Remote Config. */
export function buildTabItems({ magicAiNewBadge }: { magicAiNewBadge: boolean }): CapsuleTabItem[] {
  return MAIN_TABS.map((tab) => ({
    key: tab.key,
    title: t(tab.titleKey),
    icon: tab.icon,
    badge: tab.key === "magic-ai" && magicAiNewBadge ? t("tabs.new") : undefined,
  }));
}
