import { getLocales } from "expo-localization";

import { en, type Dictionary } from "./en";

type Leaves<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type TranslationKey = Leaves<Dictionary>;
export type TranslationParams = Record<string, string | number>;

const dictionaries: Record<string, Dictionary> = { en };

function pickDictionary(): Dictionary {
  for (const locale of getLocales()) {
    const dict = locale.languageCode ? dictionaries[locale.languageCode] : undefined;
    if (dict) return dict;
  }
  return en;
}

let active: Dictionary = pickDictionary();

/** Test hook: force a dictionary. */
export function setDictionaryForTests(dict: Dictionary) {
  active = dict;
}

function lookup(dict: Dictionary, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Translate a key, interpolating `{{name}}` placeholders. Falls back to English, then the key. */
export function t(key: TranslationKey, params?: TranslationParams): string {
  const template = lookup(active, key) ?? lookup(en, key) ?? key;
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
