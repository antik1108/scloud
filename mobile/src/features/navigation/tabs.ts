import type { CapsuleTabItem } from "@/design-system";

/** The four main tabs (SPEC.md §3). `key` must match the route file name in app/(tabs). */
export const MAIN_TABS = [
  { key: "photos", title: "Photos", icon: "image-outline" },
  { key: "magic-ai", title: "Magic AI", icon: "sparkles-outline", badge: "NEW" },
  { key: "videos", title: "Videos", icon: "film-outline" },
  { key: "settings", title: "Settings", icon: "settings-outline" },
] as const satisfies readonly CapsuleTabItem[];

export type MainTabKey = (typeof MAIN_TABS)[number]["key"];
