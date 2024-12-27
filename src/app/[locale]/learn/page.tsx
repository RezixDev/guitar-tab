import { getTranslations } from "next-intl/server";
import { LearnPageContent } from "@/components/learn/LearnPageContent";

// Define the params type as a Promise
type Params = Promise<{ locale: string }>;

export default async function LearnPage(props: { params: Promise<Params> }) {
	// Await the params Promise
	const { locale } = await props.params;
	const t = await getTranslations("home.learning");

	return (
		<LearnPageContent
			translations={{
				title: t("title"),
				learn: {
					beginner: t("paths.learn.features.beginner"),
					intermediate: t("paths.learn.features.intermediate"),
					advanced: t("paths.learn.features.advanced"),
					practice: t("paths.learn.features.songs"),
				},
			}}
		/>
	);
}
