import { fireEvent, screen } from "@testing-library/react-native";

import { createFakePermissions, createFakeServices } from "@/services/fakes";
import type { PermissionStatus } from "@/services/permissions/types";
import { renderWithProviders } from "@/test-utils";

import { PhotosAccessCard } from "./PhotosAccessCard";

async function setup(status: PermissionStatus, onRequest?: () => PermissionStatus) {
  const permissions = createFakePermissions({ photos: status }, onRequest);
  await renderWithProviders(<PhotosAccessCard />, { services: createFakeServices({ permissions }) });
  return permissions;
}

describe("PhotosAccessCard", () => {
  it("asks for access when undetermined and shows the granted state after", async () => {
    const permissions = await setup("undetermined", () => "granted");
    await fireEvent.press(await screen.findByTestId("photos-request"));
    expect(permissions.calls.request).toEqual(["photos"]);
    expect(await screen.findByTestId("photos-access-granted")).toBeTruthy();
  });

  it("sends blocked users to Settings", async () => {
    const permissions = await setup("blocked");
    await fireEvent.press(await screen.findByTestId("photos-open-settings"));
    expect(permissions.calls.openSettings).toBe(1);
    expect(permissions.calls.request).toEqual([]);
  });

  it("lets limited users manage their selection", async () => {
    const permissions = await setup("limited");
    await fireEvent.press(await screen.findByTestId("photos-manage"));
    expect(permissions.calls.manageLimitedPhotos).toBe(1);
  });

  it("moves to blocked when the user refuses for good", async () => {
    await setup("denied", () => "blocked");
    await fireEvent.press(await screen.findByTestId("photos-request"));
    expect(await screen.findByTestId("photos-access-blocked")).toBeTruthy();
  });
});
