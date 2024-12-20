// app/[locale]/learn/page.tsx
import { getTranslations } from "next-intl/server";
import { LearnPageContent } from "@/components/learn/LearnPageContent";

export default async function LearnPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
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
