"use client";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Guitar,
	Music,
	BookOpen,
	Target,
	GraduationCap,
	FileText,
	ChevronRight,
	PlayCircle,
	Settings,
	Mic,
	Dumbbell,
} from "lucide-react";

export function HomePage() {
	const t = useTranslations("home");
	const locale = useLocale();

	console.log("Current locale:", locale); // Debug log
	console.log("Translation test:", t("hero.title")); // Debug log

	const toolSections = [
		{
			title: t("tools.fretboard.title"),
			description: t("tools.fretboard.description"),
			icon: Guitar,
			href: `/${locale}/tools/fretboard`,
			color: "text-blue-500",
		},
		{
			title: t("tools.scales.title"),
			description: t("tools.scales.description"),
			icon: Music,
			href: `/${locale}/tools/scales`,
			color: "text-purple-500",
		},
		{
			title: t("tools.chords.title"),
			description: t("tools.chords.description"),
			icon: BookOpen,
			href: `/${locale}/tools/chords`,
			color: "text-green-500",
		},
		{
			title: t("tools.tuner.title"),
			description: t("tools.tuner.description"),
			icon: Mic,
			href: `/${locale}/tools/tuner`,
			color: "text-yellow-500",
		},
		{
			title: t("tools.practice.title"),
			description: t("tools.practice.description"),
			icon: Dumbbell,
			href: `/${locale}/tools/practice`,
			color: "text-orange-500",
		},
	];

	const mainSections = [
		{
			title: t("learning.paths.learn.title"),
			description: t("learning.paths.learn.description"),
			icon: GraduationCap,
			href: `/${locale}/learn`,
			features: [
				t("learning.paths.learn.features.beginner"),
				t("learning.paths.learn.features.intermediate"),
				t("learning.paths.learn.features.advanced"),
				t("learning.paths.learn.features.songs"),
			],
		},
		{
			title: t("learning.paths.practice.title"),
			description: t("learning.paths.practice.description"),
			icon: Target,
			href: `/${locale}/practice`,
			features: [
				t("learning.paths.practice.features.exercises"),
				t("learning.paths.practice.features.routines"),
				t("learning.paths.practice.features.sessions"),
				t("learning.paths.practice.features.progress"),
			],
		},
		{
			title: t("learning.paths.theory.title"),
			description: t("learning.paths.theory.description"),
			icon: BookOpen,
			href: `/${locale}/theory`,
			features: [
				t("learning.paths.theory.features.circle"),
				t("learning.paths.theory.features.keys"),
				t("learning.paths.theory.features.chords"),
				t("learning.paths.theory.features.harmony"),
			],
		},
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="px-4 py-12 md:py-24">
				<div className="max-w-6xl mx-auto text-center">
					<Guitar className="w-16 h-16 mx-auto mb-6 text-primary" />
					<h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
						{t("hero.title")}
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground mb-8">
						{t("hero.subtitle")}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Button size="lg" className="bg-primary hover:bg-primary/90">
							{t("hero.getStarted")}
						</Button>
						<Button size="lg" variant="outline">
							{t("hero.exploreTools")}
						</Button>
					</div>
				</div>
			</section>

			{/* Quick Access Tools */}
			<section className="px-4 py-12 bg-muted/50">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
						{t("tools.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{toolSections.map((tool, index) => (
							<Card
								key={index}
								className="hover:border-primary transition-colors"
							>
								<CardHeader>
									<tool.icon className={`w-12 h-12 ${tool.color} mb-4`} />
									<CardTitle>{tool.title}</CardTitle>
									<CardDescription>{tool.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<Button variant="ghost" className="w-full" asChild>
										<a href={tool.href}>
											{t("tools.launchTool")}
											<ChevronRight className="ml-2 h-4 w-4" />
										</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Main Sections */}
			<section className="px-4 py-12">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
						{t("learning.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{mainSections.map((section, index) => (
							<Card
								key={index}
								className="hover:border-primary transition-colors"
							>
								<CardHeader>
									<section.icon className="w-12 h-12 text-primary mb-4" />
									<CardTitle>{section.title}</CardTitle>
									<CardDescription>{section.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 mb-4">
										{section.features.map((feature, i) => (
											<li
												key={i}
												className="flex items-center text-muted-foreground"
											>
												<ChevronRight className="mr-2 h-4 w-4" />
												{feature}
											</li>
										))}
									</ul>
									<Button variant="outline" className="w-full" asChild>
										<a href={section.href}>
											{t("learning.explore")} {section.title}
										</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
