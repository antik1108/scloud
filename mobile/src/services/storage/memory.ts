import type { KeyValueStore } from "./types";

export function createMemoryStore(initial: Record<string, string | boolean> = {}): KeyValueStore {
  const data = new Map<string, string | boolean>(Object.entries(initial));
  return {
    getString: (key) => {
      const v = data.get(key);
      return typeof v === "string" ? v : undefined;
    },
    getBoolean: (key) => {
      const v = data.get(key);
      return typeof v === "boolean" ? v : undefined;
    },
    set: (key, value) => void data.set(key, value),
    remove: (key) => void data.delete(key),
  };
}
