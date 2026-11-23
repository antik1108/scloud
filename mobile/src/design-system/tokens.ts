import type { TextStyle } from "react-native";

/** Colour tokens. Lumio is dark-first; features never use raw hex values. */
export const colors = {
  background: "#0E0E10",
  surface: "#1C1C20",
  surfaceElevated: "#2A2A30",
  separator: "#3A3A42",

  textPrimary: "#FFFFFF",
  textSecondary: "#9A9AA3",
  textTertiary: "#62626B",
  textOnLight: "#0E0E10",

  /** Pro / Upgrade / Top-up accent. */
  accent: "#B79CFF",
  /** Auth CTAs and "My creations". */
  highlight: "#FFC94D",
  success: "#4ADE80",
  destructive: "#FF5A5F",
  badge: "#FF3B5C",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  /** Horizontal screen gutter. */
  gutter: 20,
} as const;

export const radii = {
  s: 10,
  m: 16,
  l: 24,
  xl: 32,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 41, fontWeight: "700" },
  title: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 22, fontWeight: "400" },
  callout: { fontSize: 15, lineHeight: 20, fontWeight: "400" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" },
  sectionHeader: { fontSize: 13, lineHeight: 18, fontWeight: "500", letterSpacing: 0.4 },
  tabLabel: { fontSize: 11, lineHeight: 13, fontWeight: "500" },
} as const satisfies Record<string, TextStyle>;
