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
	return (
		<Card
			className="hover:shadow-lg transition-shadow cursor-pointer"
			onClick={() => onSelect(path.id)}
		>
			<CardHeader>
				<div className="flex justify-between items-start">
					<CardTitle className="text-xl font-bold">{path.title}</CardTitle>
					<Badge
						variant={
							path.difficulty === "beginner"
								? "default"
								: path.difficulty === "intermediate"
								? "secondary"
								: "destructive"
						}
					>
						{path.difficulty}
					</Badge>
				</div>
				<CardDescription>{path.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-4 mb-4">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4" />
						<span className="text-sm">{path.estimatedHours}h</span>
					</div>
					<div className="flex items-center gap-2">
						<BookOpen className="w-4 h-4" />
						<span className="text-sm">{path.totalLessons} lessons</span>
					</div>
				</div>
				<Progress value={progress} className="h-2" />
				<p className="text-sm text-muted-foreground mt-2">
					{progress}% complete
				</p>
			</CardContent>
		</Card>
	);
};
