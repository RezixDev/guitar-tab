import type { ReactNode } from "react";
import type { Locale, Messages } from "@shared/types/i18n";
import { I18nProvider } from "@shared/i18n/I18nProvider";

export function IslandRoot({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      {children}
    </I18nProvider>
  );
}
