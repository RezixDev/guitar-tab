import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target, Music, Play, RefreshCcw } from "lucide-react";
import type { Note } from "@/utils/noteUtils";

interface GameControlsProps {
	points: number;
	targetPoints: number;
	streak: number;
	bestTime: number | null;
	timeChallenge: boolean;
	elapsedTime: number;
	showNext: boolean;
	currentNote: Note;
	isGameStarted: boolean;
	feedback?: string; // Add feedback prop
	onNextNote: () => void;
	onStartGame: () => void;
	onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
	points,
	targetPoints,
	streak,
	bestTime,
	timeChallenge,
	elapsedTime,
	showNext,
	currentNote,
	isGameStarted,
	feedback = "", // Default to empty string
	onNextNote,
	onStartGame,
	onReset,
}) => {
	if (!isGameStarted) {
		return (
			<div className="flex flex-col items-center justify-center py-8 space-y-4">
				<h2 className="text-2xl font-bold text-center">
					Ready to test your fretboard knowledge?
				</h2>
				<Button
					size="lg"
					onClick={onStartGame}
					className="flex items-center gap-2"
				>
					<Play className="w-5 h-5" />
					Start Game
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Current Note Display */}
			<div className="flex flex-col items-center justify-center bg-muted p-6 rounded-lg">
				<div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
					<Music className="w-4 h-4" />
					Find this note on the fretboard:
				</div>
				<div className="text-5xl font-bold tracking-wider mb-2">
					{currentNote.note}
				</div>

				{/* Feedback Message */}
				{feedback && (
					<div
						className={`text-sm mt-2 ${
							feedback.includes("Correct") ||
							feedback.includes("Perfect") ||
							feedback.includes("Great")
								? "text-green-600"
								: "text-red-600"
						}`}
					>
						{feedback}
					</div>
				)}

				{showNext && (
					<div className="text-sm text-muted-foreground mt-2">
						Press Enter or click Next Note to continue
					</div>
				)}
			</div>

			{/* Stats and Controls */}
			<div className="space-y-4">
				{/* Stats Row */}
				<div className="flex items-center gap-4">
					<Badge variant="outline" className="flex gap-1">
						<Target className="w-4 h-4" />
						<span>
							{points} / {targetPoints}
						</span>
					</Badge>
					<Badge variant="secondary" className="flex gap-1">
						<Trophy className="w-4 h-4" />
						<span>Streak: {streak}</span>
					</Badge>
					{timeChallenge && (
						<Badge variant="secondary" className="flex gap-1">
							<Clock className="w-4 h-4" />
							<span>{elapsedTime}s</span>
						</Badge>
					)}
					{bestTime && (
						<Badge variant="outline" className="flex gap-1">
							<Trophy className="w-4 h-4" />
							<span>Best: {bestTime}s</span>
						</Badge>
					)}
				</div>

				{/* Controls Row */}
				<div className="flex justify-between gap-4">
					<Button
						variant="outline"
						onClick={onReset}
						className="flex items-center gap-2"
					>
						<RefreshCcw className="w-4 h-4" />
						Reset Game
					</Button>

					{showNext && (
						<Button onClick={onNextNote} className="flex-1">
							Next Note
							<kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
								<span className="text-xs">⏎</span>
								Enter
							</kbd>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
