/** Maps any thrown value to short, user-facing copy. Never surfaces raw server messages. */
export function toUserMessage(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  if (code.includes("unavailable") || code.includes("network")) return "You're offline. Check your connection.";
  if (code.includes("unauthenticated")) return "Please sign in again.";
  if (code.includes("permission-denied")) return "You don't have access to that.";
  if (code.includes("resource-exhausted")) return "Too many attempts. Try again in a moment.";
  return "Something went wrong. Please try again.";
}
