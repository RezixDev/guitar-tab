// components/fretboard/PositionTracker.tsx
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAllNotePositions } from "@/utils/noteUtils";
import type { Note, Tuning } from "@/utils/noteUtils";

interface PositionTrackerProps {
	currentNote: Note;
	tuning: Tuning;
	foundPositions: Set<string>;
	showNext: boolean;
	isHardMode: boolean;
}

export const PositionTracker: React.FC<PositionTrackerProps> = ({
	currentNote,
	tuning,
	foundPositions,
	showNext,
	isHardMode,
}) => {
	const [stats, setStats] = useState({
		total: 0,
		found: 0,
		remaining: 0,
		progress: 0,
	});

	useEffect(() => {
		if (!currentNote || !isHardMode) return;

		const allPositions = getAllNotePositions(currentNote.note, tuning);
		const maxPossiblePositions = tuning.length; // 6 for standard guitar

		if (allPositions.length > maxPossiblePositions) {
			allPositions.length = maxPossiblePositions;
		}

		const uniquePositions = new Set(
			allPositions.map((pos) => `${pos.string}-${pos.fret}`)
		);
		const foundCount = foundPositions.size;

		const remaining = uniquePositions.size - foundCount;

		setStats({
			total: uniquePositions.size,
			found: foundCount,
			remaining: uniquePositions.size - foundCount,
			progress: (foundCount / uniquePositions.size) * 100,
		});
	}, [currentNote, foundPositions, tuning, isHardMode]);

	if (!isHardMode) return null;

	return (
		<Card className="p-4 mb-4">
			<div className="space-y-2">
				<div className="flex justify-between text-sm">
					<span className="font-medium">
						Positions Found: {stats.found} / {stats.total}
					</span>
					{stats.remaining > 0 && (
						<span className="text-muted-foreground">
							{stats.remaining} position{stats.remaining !== 1 ? "s" : ""}{" "}
							remaining
						</span>
					)}
				</div>
				<Progress value={stats.progress} className="h-2" />
				{showNext && (
					<div className="text-center text-sm text-green-600 font-medium mt-2">
						All positions found! Press Enter or click Next Note to continue
					</div>
				)}
			</div>
		</Card>
	);
};
