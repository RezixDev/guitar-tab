import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from "lucide-react";
import { type LearningPath } from "@/types/learn";
import { useTranslations } from "next-intl";

type LearningPathCardProps = {
	path: LearningPath;
	progress?: number;
	onSelect: (pathId: string) => void;
};

export const LearningPathCard = ({
	path,
	progress = 0,
	onSelect,
}: LearningPathCardProps) => {
	const t = useTranslations("learn");

	return (
		<Card
			className="hover:shadow-lg transition-shadow cursor-pointer"
			onClick={() => onSelect(path.id)}
		>
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-xl font-bold">
						{t(`paths.${path.id}.title`)}
					</CardTitle>
					<Badge
						variant={
							path.difficulty === "beginner"
								? "default"
								: path.difficulty === "intermediate"
								? "secondary"
								: "destructive"
						}
					>
						{t(`levels.${path.difficulty}`)}
					</Badge>
				</div>
				<CardDescription>{t(`paths.${path.id}.description`)}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4 mb-4">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span className="text-sm">
							{t("common.estimatedTime", { hours: path.estimatedHours })}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<BookOpen className="w-4 h-4" />
						<span className="text-sm">
							{t("common.totalLessons", { count: path.totalLessons })}
						</span>
					</div>
				</div>
				<Progress value={progress} className="h-2" />
				<p className="text-sm text-muted-foreground mt-2">
					{progress}% {t("common.complete")}
				</p>
			</CardContent>
		</Card>
	);
};
