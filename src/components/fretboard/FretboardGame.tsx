"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { useAudioManager } from "@/hooks/useAudioManager";
import { useGameModes } from "@/hooks/useGameModes";
import { useBestTime } from "@/hooks/useBestTime";

import { GameControls } from "./GameControls";
import { GameSettings } from "./GameSettings";
import { FretboardSVG } from "./FretboardSVG";
import { CompletionModal } from "./CompletionModal";
import { TutorialDialog } from "./TutorialDialog";
import { KeyboardControls } from "./KeyboardControls";

import { PositionTracker } from "./PositionTracker";

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
	const { bestTime, updateBestTime } = useBestTime();

	const [elapsedTime, setElapsedTime] = useState(0);
	const [startTime, setStartTime] = useState(Date.now());

	// Custom hooks
	const { gameState, handleGuess, resetGame, updateGameState } =
		useGameState(tuning);
	const { audioManager, isAudioLoaded } = useAudioManager();
	const {
		gameMode,
		setGameMode,
		isNewbieMode,
		isEasyMode,
		isHardMode,
		isTimeChallenge,
	} = useGameModes();

	const handleNextNote = useCallback(() => {
		const randomNote = generateRandomNote(tuning);
		updateGameState({
			currentNote: randomNote,
			feedback: "",
			showNext: false,
			guessedPositions: [],
			correctPositionsCount: 0,
			foundPositions: new Set(),
		});
	}, [tuning, updateGameState]);

	// Timer effect
	useEffect(() => {
		if (!isTimeChallenge || gameState.showNext || !isGameStarted) return;

		const timer = setInterval(() => {
			setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
		}, 1000);

		return () => clearInterval(timer);
	}, [isTimeChallenge, gameState.showNext, startTime, isGameStarted]);

	// Game completion effect
	useEffect(() => {
		if (gameState.points >= gameState.targetPoints) {
			const finalTime = elapsedTime;
			if (isTimeChallenge) {
				updateBestTime(finalTime);
			}
			setShowCompletionModal(true);
		}
	}, [
		gameState.points,
		gameState.targetPoints,
		elapsedTime,
		isTimeChallenge,
		updateBestTime,
	]);

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
			handleGuess(visualString, fret, isNewbieMode, isHardMode);
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
		setGameMode("newbie");
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
					gameMode={gameMode}
					onGameModeChange={setGameMode}
					disabled={isGameStarted}
					displayTuning={tuning}
				/>

				<Separator />

				<GameControls
					points={gameState.points}
					targetPoints={gameState.targetPoints}
					streak={gameState.streak}
					bestTime={bestTime}
					timeChallenge={isTimeChallenge}
					elapsedTime={elapsedTime}
					showNext={gameState.showNext}
					currentNote={gameState.currentNote}
					isGameStarted={isGameStarted}
					feedback={gameState.feedback}
					onNextNote={handleNextNote}
					onStartGame={handleStartGame}
					onReset={handleReset}
				/>

				{isGameStarted && isHardMode && (
					<PositionTracker
						currentNote={gameState.currentNote}
						tuning={tuning}
						foundPositions={gameState.foundPositions}
						showNext={gameState.showNext}
						isHardMode={isHardMode}
					/>
				)}

				{isGameStarted && (
					<FretboardSVG
						tuning={tuning}
						width={900}
						height={300}
						onFretClick={handleFretClick}
						showNext={gameState.showNext}
						currentNote={gameState.currentNote}
						guessedPositions={gameState.guessedPositions}
						isEasyMode={isEasyMode}
						isNewbieMode={isNewbieMode}
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
