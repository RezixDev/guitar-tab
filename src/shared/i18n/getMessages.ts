import type { Locale, Messages } from "@shared/types/i18n";
import { DEFAULT_LOCALE, LOCALES } from "@shared/types/i18n";

import en from "@messages/en.json";
import de from "@messages/de.json";
import pl from "@messages/pl.json";

const ALL: Record<Locale, Messages> = {
  en: en as Messages,
  de: de as Messages,
  pl: pl as Messages,
};

export function getMessages(locale: string): Messages {
  return ALL[(locale as Locale) ?? DEFAULT_LOCALE] ?? ALL[DEFAULT_LOCALE];
}

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
