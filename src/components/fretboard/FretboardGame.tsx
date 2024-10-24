"use client";

import React, { useState, useEffect } from "react";
import FretboardSVG from "./FretboardSVG";
import ModeToggle from "./ModeToggle";
import CompletionModal from "./CompletionModal";
import { AudioManager } from "../../app/utils/audioUtils";
import { StatisticsManager } from "../../app/services/statisticsService";
import { tutorialSteps } from "../../app/services/tutorialService";
import {
	standardTuning,
	halfStepDownTuning,
	dropDTuning,
	generateRandomNote,
	getAllNotePositions,
	getNote,
	Note,
	Tuning,
	NotePosition,
} from "../../app/utils/noteUtils";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
	Trophy,
	Clock,
	Target,
	HelpCircle,
	// Add any other icons you need
} from "lucide-react";

const pointsOptions = [5, 10, 20, 30, 40, 50];

const TuningSelector = ({
  onChange,
}: {
  onChange: (value: string) => void;
}) => (
  <Select onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select Tuning" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="standard">Standard</SelectItem>
      <SelectItem value="halfStepDown">Half Step Down</SelectItem>
      <SelectItem value="dropD">Drop D</SelectItem>
    </SelectContent>
  </Select>
);

const PointsSelector = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <Select onValueChange={(val) => onChange(Number(val))} value={value.toString()}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select Target Points" />
    </SelectTrigger>
    <SelectContent>
      {pointsOptions.map((points) => (
        <SelectItem key={points} value={points.toString()}>
          {points} points
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);



const FretboardGame: React.FC = () => {
	// Existing state
	const [tuning, setTuning] = useState<Tuning>(standardTuning);
	const [currentNote, setCurrentNote] = useState<Note | null>(null);

	const [feedback, setFeedback] = useState<string>("");
	const [points, setPoints] = useState<number>(0);
	const [targetPoints, setTargetPoints] = useState<number>(30);
	const [showNext, setShowNext] = useState<boolean>(false);
	const [newbieMode, setNewbieMode] = useState<boolean>(true);
	const [easyMode, setEasyMode] = useState<boolean>(false);
	const [hardMode, setHardMode] = useState<boolean>(false);
	const [guessedPositions, setGuessedPositions] = useState<NotePosition[]>([]);
	const [startTime, setStartTime] = useState<number>(Date.now());
	const [elapsedTime, setElapsedTime] = useState<number>(0);
	const [timeChallenge, setTimeChallenge] = useState<boolean>(false);
	const [bestTime, setBestTime] = useState<number | null>(null);
	const [streak, setStreak] = useState<number>(0);

	// New state for added features
	const [showCompletionModal, setShowCompletionModal] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
	const [audioManager] = useState(() => new AudioManager());
	const [statsManager] = useState(() => new StatisticsManager());
	const [totalAttempts, setTotalAttempts] = useState(0);

	const [isAudioLoaded, setIsAudioLoaded] = useState(false);

	useEffect(() => {
		const loadAudio = async () => {
			try {
				await audioManager.preloadAllNotes();
				setIsAudioLoaded(true);
			} catch (error) {
				console.warn('Failed to load audio:', error);
				// Continue without audio
				setIsAudioLoaded(false);
			}
		};

		loadAudio();
	}, []);

	const handleTuningChange = (value: string) => {
		const selectedTuning =
			value === "standard"
				? standardTuning
				: value === "halfStepDown"
					? halfStepDownTuning
					: dropDTuning;
		setTuning(selectedTuning);
		resetGame();
	};

	const resetGame = () => {
		setPoints(0);
		setStreak(0);
		setGuessedPositions([]);
		setFeedback("");
		setShowNext(false);
		setStartTime(Date.now());
		setElapsedTime(0);
		setCurrentNote(generateRandomNote(tuning));
	};

	// Initialize audio and load sounds
	useEffect(() => {
		audioManager.preloadAllNotes();
	}, []);

	useEffect(() => {
		setCurrentNote(generateRandomNote(tuning));
	}, [tuning])

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			// Handle Enter key press when "Next" button is visible
			if (event.key === 'Enter' && showNext) {
				event.preventDefault();
				setCurrentNote(generateRandomNote(tuning));
				setFeedback("");
				setShowNext(false);
				setGuessedPositions([]);
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		// Cleanup
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [showNext, tuning]);

	// Tutorial navigation
	const handleTutorialNext = () => {
		if (currentTutorialStep < tutorialSteps.length - 1) {
			setCurrentTutorialStep((prev) => prev + 1);
		} else {
			setShowTutorial(false);
		}
	};

	const handleTutorialPrev = () => {
		if (currentTutorialStep > 0) {
			setCurrentTutorialStep((prev) => prev - 1);
		}
	};

	useEffect(() => {
		if (!currentNote) {
			setCurrentNote(generateRandomNote(standardTuning));
		}
	}, [currentNote]);

	useEffect(() => {
		if (tuning) {
			setCurrentNote(generateRandomNote(tuning));
		}
	}, [tuning]);

	// Modified handleFretClick with audio and statistics
	const handleFretClick = (string: number, fret: number) => {
		if (!currentNote) {
			setCurrentNote(generateRandomNote(tuning));
			return;
		}

		if (!newbieMode && !easyMode && !hardMode) {
			setFeedback("Please select a mode to start playing.");
			return;
		}

		const clickedNote = getNote(string, fret, tuning);
		const correctPositions = getAllNotePositions(currentNote.note, tuning);
		const isCorrect = correctPositions.some(
			(position) => position.string === string && position.fret === fret
		);

		setTotalAttempts((prev) => prev + 1);

		if (isCorrect) {
			if (isAudioLoaded) {
				audioManager.playNote(clickedNote, 3);
			}
			const note = getNote(string, fret, tuning);
			setGuessedPositions((prev) => [...prev, { string, fret, note }]);
			setPoints((prev) => prev + 1);
			setStreak((prev) => prev + 1);
			setFeedback("Correct! 🎯");

			// Update statistics
			statsManager.updateNoteStats(clickedNote, true, elapsedTime);

			if (points + 1 === targetPoints) {
				const finalTime = parseFloat(
					((Date.now() - startTime) / 1000).toFixed(2)
				);
				if (timeChallenge && (!bestTime || finalTime < bestTime)) {
					setBestTime(finalTime);
				}

				// Save session statistics
				statsManager.saveSession({
					date: new Date(),
					mode: hardMode ? "hard" : easyMode ? "easy" : "newbie",
					totalAttempts,
					correctAttempts: points + 1,
					timeSpent: finalTime,
					notesPlayed: guessedPositions.map((pos) => pos.note),
				});

				// Show completion modal
				setShowCompletionModal(true);
			}

			if (hardMode) {
				const allGuessed = correctPositions.every(
					(position) =>
						guessedPositions.some(
							(guessed) =>
								guessed.string === position.string &&
								guessed.fret === position.fret
						) ||
						(position.string === string && position.fret === fret)
				);

				if (allGuessed) {
					setShowNext(true);
				}
			} else {
				setShowNext(true);
			}
		} else {
			if (isAudioLoaded) {
				audioManager.playNote(clickedNote, 3);
			}
			setFeedback(`Try again! That was ${clickedNote}`);
			setStreak(0);
			statsManager.updateNoteStats(clickedNote, false, elapsedTime);
		}
	};

	// Handle completion modal close
	const handleCompletionModalClose = () => {
		setShowCompletionModal(false);
		resetGame();
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<CardTitle className="text-2xl font-bold">
							Fretboard Master
						</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowTutorial(true)}
						>
							<HelpCircle className="w-4 h-4 mr-2" />
							Tutorial
						</Button>
					</div>
					<div className="flex gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Badge variant="secondary" className="flex gap-1">
										<Trophy className="w-4 h-4" />
										<span>Streak: {streak}</span>
									</Badge>
								</TooltipTrigger>
								<TooltipContent>Current winning streak</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						{timeChallenge && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Badge variant="secondary" className="flex gap-1">
											<Clock className="w-4 h-4" />
											<span>{elapsedTime}s</span>
										</Badge>
									</TooltipTrigger>
									<TooltipContent>Current time</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label>Tuning</Label>
							<TuningSelector onChange={handleTuningChange} />
						</div>
						<div className="space-y-2">
							<Label>Target Score</Label>
							<PointsSelector value={targetPoints} onChange={setTargetPoints} />
						</div>
					</div>
					<div className="space-y-4">
						<Label>Game Modes</Label>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<ModeToggle
								label="Show All Notes"
								checked={newbieMode}
								onChange={(checked) => {
									setNewbieMode(checked);
									setEasyMode(false);
									setHardMode(false);
								}}
							/>
							<ModeToggle
								label="Guess One Position"
								checked={easyMode}
								onChange={(checked) => {
									setEasyMode(checked);
									setNewbieMode(false);
									setHardMode(false);
								}}
							/>
							<ModeToggle
								label="Guess All Positions"
								checked={hardMode}
								onChange={(checked) => {
									setHardMode(checked);
									setNewbieMode(false);
									setEasyMode(false);
								}}
							/>
							<ModeToggle
								label="Time Challenge"
								checked={timeChallenge}
								onChange={(checked) => {
									setTimeChallenge(checked);
									setStartTime(Date.now());
									setElapsedTime(0);
								}}
							/>
						</div>
					</div>
				</div>

				<Separator />

				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<div className="space-y-1">
							<h3 className="text-xl font-semibold">
								Find note: {currentNote ? currentNote.note : "Loading..."}
							</h3>
							<p
								className={`text-sm ${
									feedback.includes("Correct")
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{feedback}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Badge variant="outline" className="flex gap-1">
								<Target className="w-4 h-4" />
								<span>
                {points} / {targetPoints}
              </span>
							</Badge>
							{bestTime && (
								<Badge variant="outline" className="flex gap-1">
									<Trophy className="w-4 h-4" />
									<span>Best: {bestTime}s</span>
								</Badge>
							)}
						</div>
					</div>

    {showNext && (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            setCurrentNote(generateRandomNote(tuning));
            setFeedback("");
            setShowNext(false);
            setGuessedPositions([]);
          }}
          className="flex items-center gap-2"
        >
          Next Note
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
            <span className="text-xs">⏎</span>
            Enter
          </kbd>
        </Button>
      </div>
    )}

    <div className="relative overflow-x-auto">
      <FretboardSVG
        tuning={tuning}
        width={900}
        height={300}
        onFretClick={handleFretClick}
        showNext={showNext}
        currentNote={currentNote}
        guessedPositions={guessedPositions}
        easyMode={newbieMode}
      />
    </div>

    <div className="mt-4 text-sm text-muted-foreground">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span>Navigate:</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ←↑↓→
          </kbd>
        </div>
        <div className="flex items-center gap-2">
          <span>Select Note:</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Space
          </kbd>
        </div>
        <div className="flex items-center gap-2">
          <span>Next Note:</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Enter
          </kbd>
        </div>
      </div>
    </div>
  </div>
</CardContent>

			<CompletionModal
				isOpen={showCompletionModal}
				onClose={handleCompletionModalClose}
				stats={{
					correctGuesses: points,
					totalGuesses: totalAttempts,
					time: elapsedTime,
					streak,
					bestTime,
				}}
			/>

			{showTutorial && (
				<Dialog open={showTutorial} onOpenChange={setShowTutorial}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{tutorialSteps[currentTutorialStep].title}
							</DialogTitle>
							<DialogDescription>
								{tutorialSteps[currentTutorialStep].content}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={handleTutorialPrev}
								disabled={currentTutorialStep === 0}
							>
								Previous
							</Button>
							<Button onClick={handleTutorialNext}>
								{currentTutorialStep === tutorialSteps.length - 1
									? "Finish"
									: "Next"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</Card>
	);
};

export default FretboardGame;
