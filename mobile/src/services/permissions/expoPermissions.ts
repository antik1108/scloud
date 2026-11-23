import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { Linking } from "react-native";

import { mapExpoPermission } from "./mapExpoPermission";
import type { NotificationPermissionAdapter, PermissionKind, PermissionsService } from "./types";

const LIBRARY_TYPES: MediaLibrary.GranularPermission[] = ["photo", "video"];

/** Permissions backed by Expo modules; notifications are delegated to Firebase Messaging. */
export function createExpoPermissionsService(notifications: NotificationPermissionAdapter): PermissionsService {
  const check = async (kind: PermissionKind) => {
    switch (kind) {
      case "photos":
        return mapExpoPermission(await MediaLibrary.getPermissionsAsync(false, LIBRARY_TYPES));
      case "camera":
        return mapExpoPermission(await Camera.getCameraPermissionsAsync());
      case "tracking":
        return mapExpoPermission(await getTrackingPermissionsAsync());
      case "notifications":
        return notifications.check();
    }
  };

  const request = async (kind: PermissionKind) => {
    switch (kind) {
      case "photos":
        return mapExpoPermission(await MediaLibrary.requestPermissionsAsync(false, LIBRARY_TYPES));
      case "camera":
        return mapExpoPermission(await Camera.requestCameraPermissionsAsync());
      case "tracking":
        return mapExpoPermission(await requestTrackingPermissionsAsync());
      case "notifications":
        return notifications.request();
    }
  };

  return {
    check,
    request,
    openSettings: () => Linking.openSettings(),
    manageLimitedPhotos: () => MediaLibrary.presentPermissionsPicker(["photo"]),
  };
}
