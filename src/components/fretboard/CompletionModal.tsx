// components/CompletionModal.tsx
import React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CompletionModalProps {
	isOpen: boolean;
	onClose: () => void;
	stats: {
		correctGuesses: number;
		totalGuesses: number;
		time: number;
		streak: number;
		bestTime?: number;
	};
}

const CompletionModal: React.FC<CompletionModalProps> = ({
	isOpen,
	onClose,
	stats,
}) => {
	const accuracy = (stats.correctGuesses / stats.totalGuesses) * 100;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trophy className="w-6 h-6 text-yellow-500" />
						Congratulations!
					</DialogTitle>
					<DialogDescription>Youve completed the challenge!</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<Target className="w-4 h-4 text-blue-500" />
							<span className="text-sm">Correct: {stats.correctGuesses}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-green-500" />
							<span className="text-sm">Time: {stats.time.toFixed(1)}s</span>
						</div>
						<div className="flex items-center gap-2">
							<Star className="w-4 h-4 text-purple-500" />
							<span className="text-sm">Streak: {stats.streak}</span>
						</div>
						{stats.bestTime && (
							<div className="flex items-center gap-2">
								<Trophy className="w-4 h-4 text-yellow-500" />
								<span className="text-sm">
									Best: {stats.bestTime.toFixed(1)}s
								</span>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>Accuracy</span>
							<span>{accuracy.toFixed(1)}%</span>
						</div>
						<Progress value={accuracy} className="h-2" />
					</div>
				</div>

				<DialogFooter className="flex gap-2">
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
					<Button
						onClick={() => {
							onClose();
							// Add logic to start new game
						}}
					>
						Play Again
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CompletionModal;
