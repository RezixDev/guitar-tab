// components/learn/ModuleSection.tsx

interface ModuleSectionProps {
	module: Module;
	completedLessons: string[];
}

export const ModuleSection = ({
	module,
	completedLessons,
}: ModuleSectionProps) => {
	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">{module.title}</h2>
				<Badge variant="outline">{module.estimatedWeeks} weeks</Badge>
			</div>
			<p className="text-muted-foreground">{module.description}</p>

			<div className="grid gap-4">
				{module.lessons.map((lesson) => (
					<LessonCard
						key={lesson.id}
						lesson={lesson}
						isAccessible={isLessonAccessible(
							lesson.id,
							module.id,
							completedLessons
						)}
						isCompleted={completedLessons.includes(lesson.id)}
					/>
				))}
			</div>
		</div>
	);
};
