import { DEFAULT_APP_CONFIG, parseAppConfig } from "./appConfig";

describe("parseAppConfig", () => {
  it("uses defaults for an empty config (offline first launch)", () => {
    expect(parseAppConfig({})).toEqual({
      magicAiNewBadge: true,
      socialProof: null,
      privacyPolicyUrl: "https://example.com/lumio/privacy",
      termsUrl: "https://example.com/lumio/terms",
    });
  });

  it("parses booleans from Remote Config strings", () => {
    expect(parseAppConfig({ magic_ai_new_badge: "false" }).magicAiNewBadge).toBe(false);
    expect(parseAppConfig({ magic_ai_new_badge: "garbage" }).magicAiNewBadge).toBe(true);
  });

  it("parses valid social proof", () => {
    const raw = { welcome_social_proof: '{"rating":4.84,"ratingsCount":"12K+","usersCount":"1M+"}' };
    expect(parseAppConfig(raw).socialProof).toEqual({ rating: 4.8, ratingsCount: "12K+", usersCount: "1M+" });
  });

  it.each([
    "not json",
    '{"rating":7,"ratingsCount":"1K","usersCount":"1M"}',
    '{"rating":4.5,"ratingsCount":"","usersCount":"1M"}',
    '{"rating":"4.5","ratingsCount":"1K","usersCount":"1M"}',
  ])("hides invalid social proof %s", (value) => {
    expect(parseAppConfig({ welcome_social_proof: value }).socialProof).toBeNull();
  });

  it("rejects non-https legal URLs", () => {
    expect(parseAppConfig({ terms_url: "http://insecure.example" }).termsUrl).toBe(DEFAULT_APP_CONFIG.termsUrl);
    expect(parseAppConfig({ terms_url: "https://legal.example/terms" }).termsUrl).toBe("https://legal.example/terms");
  });
});
