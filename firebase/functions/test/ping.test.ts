import { afterEach, describe, expect, it } from "vitest";
import { buildPingResponse } from "../src/ping.js";
import { currentEnvironment } from "../src/lib/env.js";

describe("currentEnvironment", () => {
  afterEach(() => {
    delete process.env.FUNCTIONS_EMULATOR;
  });

  it("detects demo projects as emulator", () => {
    expect(currentEnvironment("demo-lumio")).toBe("emulator");
  });

  it("detects prod and dev", () => {
    expect(currentEnvironment("lumio-prod")).toBe("prod");
    expect(currentEnvironment("lumio-dev")).toBe("dev");
  });

  it("honours FUNCTIONS_EMULATOR", () => {
    process.env.FUNCTIONS_EMULATOR = "true";
    expect(currentEnvironment("lumio-prod")).toBe("emulator");
  });
});

describe("buildPingResponse", () => {
  it("echoes uid and time", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    expect(buildPingResponse("u1", now)).toMatchObject({
      ok: true,
      uid: "u1",
      serverTime: "2026-01-01T00:00:00.000Z",
    });
  });
});
