"use client";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/hooks/useGameState";
import { useLocalStorage } from "@/hooks/useLocalStorage";
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
import type { Points } from "@/components/fretboard/PointsSelector";

import {
	standardTuning,
	halfStepDownTuning,
	dropDTuning,
	generateRandomNote,
	type Tuning,
	type Note,
	type TuningNotes,
} from "@/utils/noteUtils";

export const FretboardGame = () => {
	const t = useTranslations("Fretboard");

	// Game state
	const [tuningId, setTuningId] = useLocalStorage<string>("fretboard-tuning-id", "standard");
	const [targetPoints, setTargetPoints] = useLocalStorage<Points>("fretboard-target-points", 10);

	const getTuningArray = (id: string): Tuning => {
		switch (id) {
			case 'halfStepDown': return halfStepDownTuning;
			case 'dropD': return dropDTuning;
			default: return standardTuning;
		}
	};

	const tuning = getTuningArray(tuningId);

	const [isGameStarted, setIsGameStarted] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [showCompletionModal, setShowCompletionModal] = useState(false);

	// Time tracking
	const { bestTime, updateBestTime } = useBestTime();
	const [elapsedTime, setElapsedTime] = useState(0);
	const [startTime, setStartTime] = useState(Date.now());

	const feedbackTranslations = {
		feedback: {
			perfect: t("feedback.perfect"),
			tryAgainAny: t("feedback.tryAgainAny"),
			foundOne: t("feedback.foundOne"),
			tryAgain: t("feedback.tryAgain"),
			excellent: t("feedback.excellent"),
			remainingPositions: (count: number) =>
				t("feedback.remainingPositions", { count }),
			remainingPosition: t("feedback.remainingPosition"),
			tryAgainAll: t("feedback.tryAgainAll"),
			correct: t("feedback.correct"),
		},
	};

	// Custom hooks
	const { gameState, handleGuess, resetGame, updateGameState } = useGameState(
		tuning,
		feedbackTranslations,
		{ initialTargetPoints: targetPoints }
	);
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

	useEffect(() => {
		if (gameState.targetPoints !== targetPoints) {
			updateGameState({ targetPoints });
		}
	}, [targetPoints, gameState.targetPoints, updateGameState]);

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
	const handleTuningChange = (newTuningId: string) => {
		setTuningId(newTuningId);
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

	const formattedTranslations = {
		ready: t("game.ready"),
		startGame: t("game.startGame"),
		findNote: t("game.findNote"),
		pressEnter: t("game.pressEnter"),
		nextNote: t("game.nextNote"),
		resetGame: t("game.resetGame"),
		streak: t("game.streak", { count: gameState.streak }),
		score: t("game.score", {
			current: gameState.points,
			target: gameState.targetPoints,
		}),
		time: t("game.time", { seconds: elapsedTime }),
		best: t("game.best", { time: bestTime || 0 }),
	};

	const completionTranslations = {
		title: t("completion.title"),
		subtitle: t("completion.subtitle"),
		correct: t("completion.correct", { count: gameState.points }),
		time: t("completion.time", { seconds: elapsedTime }),
		streak: t("completion.streak", { count: gameState.streak }),
		bestTime: t("completion.bestTime", { time: bestTime?.toFixed(1) || 0 }),
		accuracy: t("completion.accuracy"),
		close: t("completion.close"),
		playAgain: t("completion.playAgain"),
	};

	const settingsTranslations = {
		tuning: t("settings.tuning"),
		targetScore: t("settings.targetScore"),
		gameMode: t("settings.gameMode"),
		gameModes: {
			placeholder: t("gameModes.placeholder"),
			modes: {
				newbie: {
					label: t("gameModes.newbie.label"),
					description: t("gameModes.newbie.description"),
				},
				easy: {
					label: t("gameModes.easy.label"),
					description: t("gameModes.easy.description"),
				},
				hard: {
					label: t("gameModes.hard.label"),
					description: t("gameModes.hard.description"),
				},
				time: {
					label: t("gameModes.time.label"),
					description: t("gameModes.time.description"),
				},
			},
		},
	};

	const keyboardTranslations = {
		title: t("keyboard.title"),
		shortcuts: {
			navigate: t("keyboard.shortcuts.navigate"),
			selectNote: t("keyboard.shortcuts.selectNote"),
			nextNote: t("keyboard.shortcuts.nextNote"),
		},
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowTutorial(true)}
						>
							<HelpCircle className="w-4 h-4 mr-2" />
							{t("tutorial.title")}
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				<GameSettings
					onTuningChange={handleTuningChange}
					targetPoints={gameState.targetPoints}
					onTargetPointsChange={setTargetPoints}
					gameMode={gameMode}
					onGameModeChange={setGameMode}
					disabled={isGameStarted}
					displayTuning={tuningId}
					translations={settingsTranslations}
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
					translations={formattedTranslations}
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

				<KeyboardControls translations={keyboardTranslations} />

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
					translations={completionTranslations}
				/>

				<TutorialDialog
					isOpen={showTutorial}
					onClose={() => setShowTutorial(false)}
					translations={{
						title: t("tutorial.title"),
						steps: [
							t("tutorial.step1"),
							t("tutorial.step2"),
							t("tutorial.step3"),
						],
					}}
				/>
			</CardContent>
		</Card>
	);
};
