import { en } from "./en";
import { setDictionaryForTests, t } from "./index";

describe("t", () => {
  afterEach(() => setDictionaryForTests(en));

  it("returns the English string", () => {
    expect(t("welcome.getStarted")).toBe("Get Started");
  });

  it("interpolates parameters", () => {
    expect(t("welcome.joinUsers", { count: "2M+" })).toBe("Join 2M+ users");
  });

  it("leaves unknown placeholders intact", () => {
    expect(t("welcome.joinUsers")).toBe("Join {{count}} users");
  });

  it("falls back to English when the active locale lacks a key", () => {
    const partial = JSON.parse(JSON.stringify(en));
    delete partial.welcome.getStarted;
    setDictionaryForTests(partial);
    expect(t("welcome.getStarted")).toBe("Get Started");
  });
});
