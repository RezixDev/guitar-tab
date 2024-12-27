import { getTranslations } from "next-intl/server";
import { HomePage } from "@/components/HomePage";
import { NextIntlClientProvider } from "@/components/providers/NextIntlClientProvider";

type Params = Promise<{ locale: string }>;

export default async function Page(props: { params: Promise<Params> }) {
	const { locale } = await props.params;
	const messages = (await import(`@/messages/${locale}.json`)).default;

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<HomePage />
		</NextIntlClientProvider>
	);
}
