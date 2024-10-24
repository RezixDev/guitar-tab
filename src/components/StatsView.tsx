// components/StatsView.tsx
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface StatsViewProps {
	statsManager: StatisticsManager;
}

const StatsView: React.FC<StatsViewProps> = ({ statsManager }) => {
	const challengingNotes = statsManager.getMostChallengingNotes();
	const progressData = statsManager.getProgressOverTime();
	const patterns = statsManager.getLearningPatterns();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Progress Over Time</CardTitle>
					<CardDescription>Your accuracy improvement</CardDescription>
				</CardHeader>
				<CardContent className="h-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={progressData}>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line type="monotone" dataKey="accuracy" stroke="#2563eb" />
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Learning Insights</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h4 className="font-medium">Best Practice Time</h4>
							<p className="text-sm text-muted-foreground">
								{patterns.bestTimeOfDay}
							</p>
						</div>
						<div>
							<h4 className="font-medium">Strongest Notes</h4>
							<div className="flex gap-2 mt-1">
								{patterns.bestPerformingNotes.map((note) => (
									<Badge key={note} variant="secondary">
										{note}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h4 className="font-medium">Need Practice</h4>
							<div className="flex gap-2 mt-1">
								{patterns.recommendedPractice.map((note) => (
									<Badge key={note} variant="outline" className="text-red-500">
										{note}
									</Badge>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default StatsView;
