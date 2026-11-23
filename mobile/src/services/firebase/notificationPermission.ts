import {
  AuthorizationStatus,
  getMessaging,
  hasPermission,
  requestPermission,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

import type { NotificationPermissionAdapter, PermissionStatus } from "../permissions/types";

function fromAuthorizationStatus(status: number): PermissionStatus {
  switch (status) {
    case AuthorizationStatus.AUTHORIZED:
    case AuthorizationStatus.PROVISIONAL:
    case AuthorizationStatus.EPHEMERAL:
      return "granted";
    case AuthorizationStatus.NOT_DETERMINED:
      return "undetermined";
    default:
      // iOS never re-shows the prompt after a denial.
      return "blocked";
  }
}

const ANDROID_13 = 33;
const needsAndroidRuntimePermission = () =>
  Platform.OS === "android" && typeof Platform.Version === "number" && Platform.Version >= ANDROID_13;

export const firebaseNotificationPermission: NotificationPermissionAdapter = {
  async check() {
    if (Platform.OS === "android") {
      if (!needsAndroidRuntimePermission()) return "granted";
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      // Android can't tell "never asked" from "denied" via check(); request() resolves it.
      return granted ? "granted" : "undetermined";
    }
    return fromAuthorizationStatus(await hasPermission(getMessaging()));
  },
  async request() {
    if (Platform.OS === "android") {
      if (!needsAndroidRuntimePermission()) return "granted";
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (result === PermissionsAndroid.RESULTS.GRANTED) return "granted";
      return result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? "blocked" : "denied";
    }
    return fromAuthorizationStatus(await requestPermission(getMessaging()));
  },
};
