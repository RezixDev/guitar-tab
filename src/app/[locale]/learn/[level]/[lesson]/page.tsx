import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LessonDetails } from "@/components/learn/LessonDetails";
import { LEARNING_PATHS } from "@/lib/learn/constants";
import { notFound } from "next/navigation";

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
	const path = Object.values(LEARNING_PATHS)
		.flat()
		.find((p) => p.id === level);

  const lessonData = path?.modules?.flatMap((module) => module.lessons)
		.find((l) => l.id === lesson);

	return {
		title: lessonData?.title || "Lesson",
	};
}

export default async function LessonPage({
	params: { locale, level, lesson },
}: LessonPageProps) {
	const t = await getTranslations("learn");

	const path = Object.values(LEARNING_PATHS)
		.flat()
		.find((p) => p.id === level);

  if (!path || !path.modules) {
    return notFound();
  }

  const lessonData = path.modules
		.flatMap((module) => module.lessons)
		.find((l) => l.id === lesson);

  if (!lessonData) {
		return notFound();
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
