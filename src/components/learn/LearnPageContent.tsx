// components/learn/LearnPageContent.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningPathCard } from "@/components/learn/LearningPathCard";
import { getUserProgress } from "@/lib/learn/utils";
import { useRouter } from "next/navigation";
import { LEARNING_PATHS } from "@/lib/learn/constants";

type LearnPageContentProps = {
	translations: {
		title: string;
		learn: {
			beginner: string;
			intermediate: string;
			advanced: string;
			practice: string;
		};
	};
};

export const LearnPageContent = ({ translations }: LearnPageContentProps) => {
	const router = useRouter();

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8">{translations.title}</h1>

			<Tabs defaultValue="beginner" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="beginner">
						{translations.learn.beginner}
					</TabsTrigger>
					<TabsTrigger value="intermediate">
						{translations.learn.intermediate}
					</TabsTrigger>
					<TabsTrigger value="advanced">
						{translations.learn.advanced}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="beginner" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{LEARNING_PATHS.beginner.map((path) => (
							<LearningPathCard
								key={path.id}
								path={path}
								progress={getUserProgress(path.id)}
								onSelect={(pathId) => router.push(`/learn/${pathId}`)}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="intermediate" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{LEARNING_PATHS.intermediate.map((path) => (
							<LearningPathCard
								key={path.id}
								path={path}
								progress={getUserProgress(path.id)}
								onSelect={(pathId) => router.push(`/learn/${pathId}`)}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="advanced" className="mt-6">
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{LEARNING_PATHS.advanced.map((path) => (
							<LearningPathCard
								key={path.id}
								path={path}
								progress={getUserProgress(path.id)}
								onSelect={(pathId) => router.push(`/learn/${pathId}`)}
							/>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};
