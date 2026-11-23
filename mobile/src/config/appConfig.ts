/**
 * Remote Config keys, defaults and the typed AppConfig the UI reads.
 * Keep in sync with firebase/remoteconfig.template.json.
 */
export const REMOTE_CONFIG_DEFAULTS = {
  magic_ai_new_badge: true,
  /** JSON: {"rating":4.8,"ratingsCount":"10K+","usersCount":"1M+"}. Empty = hide the block. Real numbers only. */
  welcome_social_proof: "",
  // Placeholder URLs — replace with the hosted legal pages before release.
  privacy_policy_url: "https://example.com/lumio/privacy",
  terms_url: "https://example.com/lumio/terms",
} as const satisfies Record<string, string | boolean | number>;

export type RemoteConfigKey = keyof typeof REMOTE_CONFIG_DEFAULTS;
/** Raw values as strings, the way Remote Config stores them. */
export type RawRemoteConfig = Partial<Record<string, string>>;

export type SocialProof = { rating: number; ratingsCount: string; usersCount: string };

export type AppConfig = {
  magicAiNewBadge: boolean;
  socialProof: SocialProof | null;
  privacyPolicyUrl: string;
  termsUrl: string;
};

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  const v = value.trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(v)) return true;
  if (["false", "0", "no", "off"].includes(v)) return false;
  return fallback;
}

function parseHttpsUrl(value: string | undefined, fallback: string): string {
  return value && /^https:\/\/[^\s]+$/.test(value.trim()) ? value.trim() : fallback;
}

function isShortLabel(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= 12;
}

function parseSocialProof(value: string | undefined): SocialProof | null {
  if (!value?.trim()) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { rating, ratingsCount, usersCount } = parsed as Record<string, unknown>;
    if (typeof rating !== "number" || !(rating > 0 && rating <= 5)) return null;
    if (!isShortLabel(ratingsCount) || !isShortLabel(usersCount)) return null;
    return { rating: Math.round(rating * 10) / 10, ratingsCount, usersCount };
  } catch {
    return null;
  }
}

/** Turns raw Remote Config strings into a validated AppConfig; bad values fall back to defaults. */
export function parseAppConfig(raw: RawRemoteConfig): AppConfig {
  const d = REMOTE_CONFIG_DEFAULTS;
  return {
    magicAiNewBadge: parseBool(raw.magic_ai_new_badge, d.magic_ai_new_badge),
    socialProof: parseSocialProof(raw.welcome_social_proof),
    privacyPolicyUrl: parseHttpsUrl(raw.privacy_policy_url, d.privacy_policy_url),
    termsUrl: parseHttpsUrl(raw.terms_url, d.terms_url),
  };
}

export const DEFAULT_APP_CONFIG: AppConfig = parseAppConfig({});
