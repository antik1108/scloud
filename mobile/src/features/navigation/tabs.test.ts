import { buildTabItems } from "./tabs";

describe("buildTabItems", () => {
  it("shows the NEW badge on Magic AI only when enabled", () => {
    const on = buildTabItems({ magicAiNewBadge: true });
    expect(on.find((i) => i.key === "magic-ai")?.badge).toBe("NEW");
    expect(on.filter((i) => i.badge)).toHaveLength(1);
    expect(buildTabItems({ magicAiNewBadge: false }).some((i) => i.badge)).toBe(false);
  });

  it("translates titles", () => {
    expect(buildTabItems({ magicAiNewBadge: false }).map((i) => i.title)).toEqual([
      "Photos",
      "Magic AI",
      "Videos",
      "Settings",
    ]);
  });
});
