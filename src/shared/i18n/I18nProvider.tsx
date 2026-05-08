import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale, Messages } from "@shared/types/i18n";
import { makeTranslator } from "./translate";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslations(namespace?: string) {
  const { messages } = useI18n();
  return useMemo(() => makeTranslator(messages, namespace), [messages, namespace]);
}

export function useLocale(): Locale {
  return useI18n().locale;
}
