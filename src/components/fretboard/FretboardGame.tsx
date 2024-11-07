"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { useAudioManager } from "@/hooks/useAudioManager";
import { useGameModes } from "@/hooks/useGameModes";
import { GameControls } from "./GameControls";
import { GameSettings } from "./GameSettings";
import { FretboardSVG } from "./FretboardSVG";
import { CompletionModal } from "./CompletionModal";
import { TutorialDialog } from "./TutorialDialog";
import { KeyboardControls } from "./KeyboardControls";

import {
	standardTuning,
	generateRandomNote,
	type Tuning,
	type Note,
	type TuningNotes,
} from "@/utils/noteUtils";

// Remove the string conversion function as we'll handle the flip differently
export const FretboardGame = () => {
	// Game state
	const [tuning, setTuning] = useState<Tuning>(standardTuning);
	const [isGameStarted, setIsGameStarted] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [showCompletionModal, setShowCompletionModal] = useState(false);

	// Time tracking
	const [bestTime, setBestTime] = useState<number | null>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [startTime, setStartTime] = useState(Date.now());

	// Custom hooks
	const { gameState, handleGuess, resetGame, updateGameState } =
		useGameState(tuning);
	const { audioManager, isAudioLoaded } = useAudioManager();
	const { modes, setMode, setTimeChallenge } = useGameModes();

	const handleNextNote = useCallback(() => {
		const randomNote = generateRandomNote(tuning);
		updateGameState({
			currentNote: randomNote,
			feedback: "",
			showNext: false,
			guessedPositions: [],
		});
	}, [tuning, updateGameState]);

	// Timer effect
	useEffect(() => {
		if (!modes.timeChallenge || gameState.showNext || !isGameStarted) return;

		const timer = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);

		return () => clearInterval(timer);
	}, [modes.timeChallenge, gameState.showNext, startTime, isGameStarted]);

	// Game completion effect
	useEffect(() => {
		if (gameState.points >= gameState.targetPoints) {
			const finalTime = elapsedTime;
			if (bestTime === null || finalTime < bestTime) {
				setBestTime(finalTime);
			}
			setShowCompletionModal(true);
		}
	}, [gameState.points, gameState.targetPoints, elapsedTime, bestTime]);

	// Keyboard controls
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === "Enter" && gameState.showNext) {
				event.preventDefault();
				handleNextNote();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [gameState.showNext, handleNextNote]);

	// Game actions
	const handleTuningChange = (newTuning: string) => {
		const tuningArray = newTuning.split("") as Tuning;
		setTuning(tuningArray);
		resetGame();
	};

	const handleFretClick = (visualString: number, fret: number) => {
		if (!gameState.showNext && isGameStarted) {
			handleGuess(visualString, fret);
			if (audioManager && isAudioLoaded) {
				audioManager.playNote(visualString.toString(), fret);
			}
		}
	};

	const handleStartGame = () => {
		setIsGameStarted(true);
		setStartTime(Date.now());
		const randomNote = generateRandomNote(tuning);
		updateGameState({
			currentNote: randomNote,
			points: 0,
			feedback: "",
			showNext: false,
			guessedPositions: [],
		});
	};

	const handleReset = () => {
		setIsGameStarted(false);
		resetGame();
		setElapsedTime(0);
		setStartTime(Date.now());
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
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<GameSettings
					onTuningChange={handleTuningChange}
					targetPoints={gameState.targetPoints}
					onTargetPointsChange={(value) =>
						updateGameState({ targetPoints: value })
					}
					modes={modes}
					onModeChange={(mode: "newbie" | "easy" | "hard", value: boolean) => {
						const modeMap = {
							newbie: "newbieMode",
							easy: "easyMode",
							hard: "hardMode",
						} as const;

						Object.keys(modeMap).forEach((key) => {
							if (key === mode) {
								setMode(modeMap[key as keyof typeof modeMap], value);
							} else {
								setMode(modeMap[key as keyof typeof modeMap], false);
							}
						});
					}}
					onTimeChallengeChange={setTimeChallenge}
					disabled={isGameStarted}
					displayTuning={tuning}
				/>

				<Separator />

				<GameControls
					points={gameState.points}
					targetPoints={gameState.targetPoints}
					streak={gameState.streak}
					bestTime={bestTime}
					timeChallenge={modes.timeChallenge}
					elapsedTime={elapsedTime}
					showNext={gameState.showNext}
					currentNote={gameState.currentNote}
					isGameStarted={isGameStarted}
					onNextNote={handleNextNote}
					onStartGame={handleStartGame}
				/>

				{isGameStarted && (
					<FretboardSVG
						tuning={tuning}
						width={900}
						height={300}
						onFretClick={handleFretClick}
						showNext={gameState.showNext}
						currentNote={gameState.currentNote}
						guessedPositions={gameState.guessedPositions}
						easyMode={modes.easyMode}
						highContrast={false}
						isFlipped={true}
					/>
				)}

				<KeyboardControls />

				<CompletionModal
					isOpen={showCompletionModal}
					onClose={() => {
						setShowCompletionModal(false);
						handleReset();
					}}
					stats={{
						correctGuesses: gameState.points,
						totalGuesses: gameState.totalAttempts,
						time: elapsedTime,
						streak: gameState.streak,
						bestTime: bestTime ?? undefined,
					}}
				/>

				<TutorialDialog
					isOpen={showTutorial}
					onClose={() => setShowTutorial(false)}
				/>
			</CardContent>
		</Card>
	);
};
