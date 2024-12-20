import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LEARNING_PATHS } from "@/lib/learn/constants";
import { LearningPathDetails } from "@/components/learn/LearningPathDetails";

interface LearningPathPageProps {
	params: {
		locale: string;
		level: string;
	};
}

export async function generateMetadata({
	params: { locale, level },
}: LearningPathPageProps): Promise<Metadata> {
	const path = Object.values(LEARNING_PATHS)
		.flat()
		.find((p) => p.id === level);

	return {
		title: path?.title || "Learning Path",
	};
}

export default async function LearningPathPage({
	params: { locale, level },
}: LearningPathPageProps) {
	const t = await getTranslations("learn");

	const path = Object.values(LEARNING_PATHS)
		.flat()
		.find((p) => p.id === level);

	if (!path) {
		// You might want to handle this differently, maybe redirect to 404
		return <div>Path not found</div>;
	}

	// Parse translations with placeholders
	const estimatedTime = t
		.raw("common.estimatedTime")
		.replace("{{hours}}", path.estimatedHours.toString());
	const totalLessons = t
		.raw("common.totalLessons")
		.replace("{{count}}", path.totalLessons.toString());

	return (
		<div className="container mx-auto px-4 py-8">
			<LearningPathDetails
				path={path}
				translations={{
					title: t("title"),
					common: {
						estimatedTime,
						totalLessons,
						prerequisites: t("common.prerequisites"),
						progress: t("common.progress"),
						complete: t("common.complete"),
					},
				}}
			/>
		</div>
	);
}
