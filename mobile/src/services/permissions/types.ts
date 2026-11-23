export type PermissionKind = "photos" | "camera" | "notifications" | "tracking";

/**
 * - undetermined: never asked — show our explanation, then the system prompt.
 * - granted / limited: usable (limited = iOS/Android selected-photos access).
 * - denied: refused but the system prompt can still be shown again (Android).
 * - blocked: refused permanently — only Settings can change it.
 */
export type PermissionStatus = "undetermined" | "granted" | "limited" | "denied" | "blocked";

export interface PermissionsService {
  check(kind: PermissionKind): Promise<PermissionStatus>;
  request(kind: PermissionKind): Promise<PermissionStatus>;
  openSettings(): Promise<void>;
  /** iOS/Android limited photo access: let the user change the selection. */
  manageLimitedPhotos(): Promise<void>;
}

/** Notification permission is owned by Firebase Messaging; it plugs into the permissions service. */
export interface NotificationPermissionAdapter {
  check(): Promise<PermissionStatus>;
  request(): Promise<PermissionStatus>;
}

export function isUsable(status: PermissionStatus): boolean {
  return status === "granted" || status === "limited";
}
