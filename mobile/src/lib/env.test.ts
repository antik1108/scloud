import { resolveRuntimeEnv } from "./env";

describe("resolveRuntimeEnv", () => {
  it("defaults to dev without emulator", () => {
    expect(resolveRuntimeEnv({ appEnv: undefined, platform: "ios" })).toEqual({
      appEnv: "dev",
      useEmulator: false,
      emulatorHost: "127.0.0.1",
    });
  });

  it("enables the emulator for dev when flagged, with the Android host alias", () => {
    expect(resolveRuntimeEnv({ appEnv: "dev", useEmulatorFlag: "1", platform: "android" })).toMatchObject({
      useEmulator: true,
      emulatorHost: "10.0.2.2",
    });
  });

  it("never uses the emulator in prod", () => {
    expect(resolveRuntimeEnv({ appEnv: "prod", useEmulatorFlag: "1", platform: "ios" }).useEmulator).toBe(false);
  });

  it("honours an explicit host for physical devices", () => {
    expect(
      resolveRuntimeEnv({ appEnv: "dev", useEmulatorFlag: "1", emulatorHost: "192.168.1.20", platform: "ios" })
        .emulatorHost,
    ).toBe("192.168.1.20");
  });
});
