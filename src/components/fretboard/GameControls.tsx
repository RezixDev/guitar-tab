import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target, Music, Play } from "lucide-react";
import type { Note } from "@/utils/noteUtils";


interface GameControlsProps {
    points: number;
    targetPoints: number;
    streak: number;
    bestTime: number | null;
    timeChallenge: boolean;
    elapsedTime: number;
    showNext: boolean;
    currentNote: Note;  // Changed from string to Note type
    isGameStarted: boolean;
    onNextNote: () => void;
    onStartGame: () => void;
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
	onNextNote,
	onStartGame,
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
				<div className="text-5xl font-bold tracking-wider">{currentNote.note}</div>


				{showNext && (
					<div className="text-sm text-muted-foreground mt-2">
						Great! Press Enter or click Next Note to continue
					</div>
				)}
			</div>

			{/* Stats and Controls */}
			<div className="flex justify-between items-center">
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
				{showNext && (
					<Button onClick={onNextNote} className="flex items-center gap-2">
						Next Note
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
							<span className="text-xs">⏎</span>
							Enter
						</kbd>
					</Button>
				)}
			</div>
		</div>
	);
};
