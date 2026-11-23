import { mapExpoPermission } from "./mapExpoPermission";

describe("mapExpoPermission", () => {
  it.each([
    [{ status: "granted", canAskAgain: true }, "granted"],
    [{ status: "granted", canAskAgain: true, accessPrivileges: "all" }, "granted"],
    [{ status: "granted", canAskAgain: true, accessPrivileges: "limited" }, "limited"],
    [{ status: "undetermined", canAskAgain: true }, "undetermined"],
    [{ status: "denied", canAskAgain: true }, "denied"],
    [{ status: "denied", canAskAgain: false }, "blocked"],
  ] as const)("%j -> %s", (input, expected) => {
    expect(mapExpoPermission(input)).toBe(expected);
  });
});
