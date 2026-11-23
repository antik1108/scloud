import type { PermissionStatus } from "./types";

/** Shape shared by every Expo permission response. */
export type ExpoPermissionLike = {
  status: "granted" | "denied" | "undetermined";
  canAskAgain: boolean;
  accessPrivileges?: "all" | "limited" | "none";
};

export function mapExpoPermission(response: ExpoPermissionLike): PermissionStatus {
  if (response.status === "granted") {
    return response.accessPrivileges === "limited" ? "limited" : "granted";
  }
  if (response.status === "undetermined") return "undetermined";
  return response.canAskAgain ? "denied" : "blocked";
}
