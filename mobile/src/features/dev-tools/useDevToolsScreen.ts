import { useCallback, useState } from "react";

import { runtimeEnv } from "@/lib/env";
import { toUserMessage } from "@/lib/errors";
import { useServices } from "@/services/ServicesProvider";
import type { PingResult } from "@/services/types";

export type PingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: PingResult }
  | { status: "error"; message: string };

export function useDevToolsScreen() {
  const { backendHealth } = useServices();
  const [ping, setPing] = useState<PingState>({ status: "idle" });

  const runPing = useCallback(async () => {
    setPing({ status: "loading" });
    try {
      setPing({ status: "success", result: await backendHealth.ping() });
    } catch (error) {
      setPing({ status: "error", message: toUserMessage(error) });
    }
  }, [backendHealth]);

  return { env: runtimeEnv, ping, runPing };
}
