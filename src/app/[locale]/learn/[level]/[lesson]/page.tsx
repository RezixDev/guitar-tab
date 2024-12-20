import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LessonDetails } from "@/components/learn/LessonDetails";
import { FUNDAMENTALS_LESSONS } from "@/lib/learn/lessons";
import { LEARNING_PATHS } from "@/lib/learn/constants";

interface LessonPageProps {
	params: {
		locale: string;
		level: string;
		lesson: string;
	};
}

export async function generateMetadata({
	params: { locale, level, lesson },
}: LessonPageProps): Promise<Metadata> {
	const lessonData = FUNDAMENTALS_LESSONS.find((l) => l.id === lesson);

	return {
		title: lessonData?.title || "Lesson",
	};
}

export default async function LessonPage({
	params: { locale, level, lesson },
}: LessonPageProps) {
	const t = await getTranslations("learn");

	const lessonData = FUNDAMENTALS_LESSONS.find((l) => l.id === lesson);
	const path = Object.values(LEARNING_PATHS)
		.flat()
		.find((p) => p.id === level);

	if (!lessonData || !path) {
		// You might want to handle this differently, maybe redirect to 404
		return <div>Lesson not found</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<LessonDetails
				lesson={lessonData}
				path={path}
				translations={{
					back: t("back"),
					lesson: t("lesson"),
					practice: t("practice"),
					complete: t("complete"),
					next: t("next"),
				}}
			/>
		</div>
	);
}
