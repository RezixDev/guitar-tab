import { BookOpen, Clock } from "lucide-react";
import type { LearningPath } from "@shared/types/learn";
import { useTranslations } from "@shared/i18n/I18nProvider";
import { Badge } from "@shared/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/Card";
import { Progress } from "@shared/ui/Progress";

type LearningPathCardProps = {
  path: LearningPath;
  progress?: number;
  onSelect: (pathId: string) => void;
};

export function LearningPathCard({
  path,
  progress = 0,
  onSelect,
}: LearningPathCardProps) {
  const t = useTranslations("learn");

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => onSelect(path.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold">
            {t(`paths.${path.id}.title`)}
          </CardTitle>
          <Badge
            variant={
              path.difficulty === "beginner"
                ? "default"
                : path.difficulty === "intermediate"
                  ? "secondary"
                  : "danger"
            }
          >
            {t(`levels.${path.difficulty}`)}
          </Badge>
        </div>
        <CardDescription>{t(`paths.${path.id}.description`)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span className="text-sm">
              {t("common.estimatedTime", { hours: path.estimatedHours })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span className="text-sm">
              {t("common.totalLessons", { count: path.totalLessons })}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          {progress}% {t("common.complete")}
        </p>
      </CardContent>
    </Card>
  );
}
