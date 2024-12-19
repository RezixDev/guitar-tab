// app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";
import { HomePage } from "@/components/HomePage";
import { NextIntlClientProvider } from "@/components/providers/NextIntlClientProvider";

export default async function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	const messages = (await import(`@/messages/${locale}.json`)).default;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<HomePage />
		</NextIntlClientProvider>
	);
}
