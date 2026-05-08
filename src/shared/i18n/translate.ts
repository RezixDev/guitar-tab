import type { Messages } from "@shared/types/i18n";

type Params = Record<string, string | number>;

const PLACEHOLDER = /\{(\w+)\}/g;

function lookup(messages: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let cursor: unknown = messages;
  for (const part of parts) {
    if (cursor && typeof cursor === "object" && part in (cursor as object)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof cursor === "string" ? cursor : undefined;
}

export function makeTranslator(messages: Messages, namespace?: string) {
  return function t(key: string, params?: Params): string {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const raw = lookup(messages, fullKey) ?? key;
    if (!params) return raw;
    return raw.replace(PLACEHOLDER, (_, name: string) => {
      const value = params[name];
      return value === undefined ? `{${name}}` : String(value);
    });
  };
}
