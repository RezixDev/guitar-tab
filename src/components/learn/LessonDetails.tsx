"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Lesson, type LearningPath, type Module } from "@/types/learn";

type LessonDetailsProps = {
	lesson: Lesson;
	path: LearningPath & { modules: Module[] }; // Ensure modules is required
	translations: {
		back: string;
		lesson: string;
		practice: string;
		complete: string;
		next: string;
	};
}

export const LessonDetails = ({
	lesson,
	path,
	translations,
}: LessonDetailsProps) => {
	const modules = path.modules;

	const currentModule = modules.find((m) =>
		m.lessons.some((l) => l.id === lesson.id)
	);

	const currentLessonIndex =
		currentModule?.lessons.findIndex((l) => l.id === lesson.id) ?? -1;

	const nextLesson = currentModule?.lessons[currentLessonIndex + 1];
	const nextModule = modules[currentModule?.order ?? 1];
	const firstLessonOfNextModule = nextModule?.lessons[0];

	const getNextLessonLink = () => {
		if (nextLesson) {
			return `/learn/${path.id}/${nextLesson.id}`;
		}
		if (firstLessonOfNextModule) {
			return `/learn/${path.id}/${firstLessonOfNextModule.id}`;
		}
		return null;
	};

	const handleLessonComplete = () => {
		// TODO: Implement lesson completion logic
		const nextPath = getNextLessonLink();
		if (nextPath) {
			window.location.href = nextPath;
		}
	};

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-6">
				<Link href={`/learn/${path.id}`}>
					<Button variant="ghost" className="pl-0 hover:pl-2 transition-all">
						<ArrowLeft className="mr-2 h-4 w-4" />
						{translations.back}
					</Button>
				</Link>
			</div>

			<div className="mb-8">
				<div className="flex items-center gap-2 text-muted-foreground mb-2">
					<span>{currentModule?.title}</span>
					<span>•</span>
					<span>
						{translations.lesson} {currentLessonIndex + 1}
					</span>
				</div>
				<h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
				<p className="text-lg text-muted-foreground">{lesson.description}</p>
			</div>

			{lesson.content.videoUrl && (
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
							<PlayCircle className="w-16 h-16 text-muted-foreground" />
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="mb-8">
				<CardContent className="p-6 prose prose-slate max-w-none">
					{lesson.content.theory.split("\n").map((paragraph, index) => (
						<React.Fragment key={index}>
							{paragraph.trim() && <p>{paragraph}</p>}
						</React.Fragment>
					))}

					{lesson.content.tablature && (
						<>
							<Separator className="my-6" />
							<pre className="font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto">
								{lesson.content.tablature}
							</pre>
						</>
					)}
				</CardContent>
			</Card>

			{lesson.practiceExercises.length > 0 && (
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">{translations.practice}</h2>
					<div className="space-y-4">
						{lesson.practiceExercises.map((exercise) => (
							<Card key={exercise.id}>
								<CardContent className="p-6">
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-xl font-semibold">{exercise.title}</h3>
										<Badge variant="secondary">
											{exercise.estimatedMinutes} min
										</Badge>
									</div>
									<p className="text-muted-foreground mb-4">
										{exercise.description}
									</p>
									{exercise.tabs && (
										<pre className="font-mono text-sm bg-muted p-4 rounded-lg overflow-x-auto">
											{exercise.tabs}
										</pre>
									)}
									{exercise.requiredTools?.map((tool) => (
										<Badge key={tool} variant="outline" className="mr-2">
											{tool}
										</Badge>
									))}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			<div className="flex justify-between items-center">
				<Button variant="default" size="lg" onClick={handleLessonComplete}>
					{translations.complete}
				</Button>

				{getNextLessonLink() && (
					<Link href={getNextLessonLink()!}>
						<Button variant="ghost" size="lg">
							{translations.next}
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
};
