import { createMMKV } from "react-native-mmkv";

import type { KeyValueStore } from "./types";

export function createMMKVStore(id = "lumio.settings"): KeyValueStore {
  const mmkv = createMMKV({ id });
  return {
    getString: (key) => mmkv.getString(key),
    getBoolean: (key) => mmkv.getBoolean(key),
    set: (key, value) => mmkv.set(key, value),
    remove: (key) => {
      mmkv.remove(key);
    },
  };
}
