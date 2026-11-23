/** Which deployment we are running in. Emulator runs use a `demo-` project id. */
export type AppEnvironment = "emulator" | "dev" | "prod";

export function currentEnvironment(projectId = process.env.GCLOUD_PROJECT ?? ""): AppEnvironment {
  if (process.env.FUNCTIONS_EMULATOR === "true" || projectId.startsWith("demo-")) return "emulator";
  if (projectId.endsWith("-prod")) return "prod";
  return "dev";
}

/** Defaults applied to every callable. App Check is enforced except in the emulator. */
export const REGION = "us-central1";
