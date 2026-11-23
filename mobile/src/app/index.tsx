import { Redirect } from "expo-router";

// Phase 1 replaces this with the splash → welcome → onboarding gate.
export default function Index() {
  return <Redirect href="/photos" />;
}
