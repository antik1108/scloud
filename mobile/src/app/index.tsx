import { Redirect } from "expo-router";

import { useAppStore } from "@/stores/appStore";

/** Entry: first run goes to Welcome, everyone else to the Photos tab. Phase 2 inserts login. */
export default function Index() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);
  return <Redirect href={hasOnboarded ? "/photos" : "/welcome"} />;
}
