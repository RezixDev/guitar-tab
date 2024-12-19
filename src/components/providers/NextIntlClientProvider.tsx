// components/providers/NextIntlClientProvider.tsx
"use client";

import { NextIntlClientProvider as BaseNextIntlClientProvider } from "next-intl";

export function NextIntlClientProvider({
	messages,
	locale,
	children,
}: {
	messages: any;
	locale: string;
	children: React.ReactNode;
}) {
	return (
		<BaseNextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</BaseNextIntlClientProvider>
	);
}
