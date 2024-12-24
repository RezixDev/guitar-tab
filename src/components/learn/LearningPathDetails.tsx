import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, ArrowLeft } from "lucide-react";
import { type LearningPath, type Module } from "@/types/learn";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserProgress } from "@/lib/learn/utils";

interface LearningPathDetailsProps {
	path: LearningPath;
	translations: {
		title: string;
		common: {
			estimatedTime: string;
			totalLessons: string;
			prerequisites: string;
			progress: string;
			complete: string;
		};
	};
}

export const LearningPathDetails = ({
	path,
	translations,
}: LearningPathDetailsProps) => {
	const progress = getUserProgress(path.id);

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-6">
				<Link href="/learn">
					<Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Learning Paths
					</Button>
				</Link>
			</div>

			<div className="flex justify-between items-start mb-6">
				<div>
					<h1 className="text-3xl font-bold mb-2">{path.title}</h1>
					<p className="text-muted-foreground">{path.description}</p>
				</div>
				<Badge
					variant={
						path.difficulty === "beginner"
							? "default"
							: path.difficulty === "intermediate"
							? "secondary"
							: "destructive"
					}
					className="text-sm"
				>
					{path.difficulty}
				</Badge>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-muted-foreground" />
					<span>
						{translations.common.estimatedTime.replace(
							"{{hours}}",
							path.estimatedHours.toString()
						)}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<BookOpen className="w-4 h-4 text-muted-foreground" />
					<span>
						{translations.common.totalLessons.replace(
							"{{count}}",
							path.totalLessons.toString()
						)}
					</span>
				</div>
			</div>

			<div className="mb-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">
						{translations.common.progress}
					</h2>
					<span className="text-sm text-muted-foreground">
						{progress}% {translations.common.complete}
					</span>
				</div>
				<Progress value={progress} className="h-2" />
			</div>

			<div className="space-y-8">
				{path.modules.map((module) => (
					<div key={module.id} className="border rounded-lg p-6">
						<div className="mb-4">
							<h2 className="text-xl font-semibold">{module.title}</h2>
							<p className="text-muted-foreground">{module.description}</p>
							<div className="mt-2 text-sm text-muted-foreground">
								Estimated: {module.estimatedWeeks} weeks
							</div>
						</div>

						<div className="space-y-3">
							{module.lessons.map((lesson) => (
								<Link
									key={lesson.id}
									href={`/learn/${path.id}/${lesson.id}`}
									className="block p-4 rounded-lg border hover:shadow-md transition-shadow"
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium">{lesson.title}</h3>
											<p className="text-sm text-muted-foreground">
												{lesson.description}
											</p>
										</div>
										{getUserProgress(lesson.id) > 0 && (
											<Badge variant="secondary">Completed</Badge>
										)}
									</div>
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
