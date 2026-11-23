import { router } from "expo-router";

import { WelcomeScreen } from "@/features/onboarding/WelcomeScreen";

export default function WelcomeRoute() {
  return <WelcomeScreen onFinished={() => router.replace("/photos")} />;
}
