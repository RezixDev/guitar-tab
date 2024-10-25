"use client"
// FretboardGame.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameState } from '@/hooks/useGameState';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useGameModes } from '@/hooks/useGameModes';
import { GameControls } from './GameControls';
import { GameSettings } from './GameSettings';
import { FretboardSVG } from './FretboardSVG';
import { CompletionModal } from './CompletionModal';
import { TutorialDialog } from './TutorialDialog';
import { KeyboardControls } from './KeyboardControls';

import { standardTuning } from '@/utils/noteUtils';
import type { Tuning } from '@/utils/noteUtils';

const FretboardGame: React.FC = () => {
	const [tuning, setTuning] = useState<Tuning>(standardTuning);
	const [showTutorial, setShowTutorial] = useState(false);
	const [bestTime, setBestTime] = useState<number | null>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [startTime, setStartTime] = useState(Date.now());
	const [showCompletionModal, setShowCompletionModal] = useState(false);

	const { gameState, resetGame, updateGameState } = useGameState(tuning);
	const { audioManager, isAudioLoaded } = useAudioManager();
	const { modes, setMode, setTimeChallenge } = useGameModes();

	const handleTuningChange = (value: string) => {
		// Tuning change logic
	};

	const handleFretClick = (string: number, fret: number) => {
		// Fret click handling logic
	};

	const handleNextNote = () => {
		updateGameState({
			currentNote: generateRandomNote(tuning),
			feedback: "",
			showNext: false,
			guessedPositions: []
		});
	};

	useEffect(() => {
		// Key press handler for Enter key
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && gameState.showNext) {
				event.preventDefault();
				handleNextNote();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [gameState.showNext]);

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<CardTitle className="text-2xl font-bold">Fretboard Master</CardTitle>
						<Button variant="ghost" size="sm" onClick={() => setShowTutorial(true)}>
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
					onTargetPointsChange={(value) => updateGameState({ targetPoints: value })}
					modes={modes}
					onModeChange={setMode}
					onTimeChallengeChange={setTimeChallenge}
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
					onNextNote={handleNextNote}
				/>

				<div className="relative overflow-x-auto">
					<FretboardSVG
						tuning={tuning}
						width={900}
						height={300}
						onFretClick={handleFretClick}
						showNext={gameState.showNext}
						currentNote={gameState.currentNote}
						guessedPositions={gameState.guessedPositions}
						easyMode={modes.newbieMode}
					/>
				</div>

				<KeyboardControls />

				<CompletionModal
					isOpen={showCompletionModal}
					onClose={() => {
						setShowCompletionModal(false);
						resetGame();
					}}
					stats={{
						correctGuesses: gameState.points,
						totalGuesses: gameState.totalAttempts,
						time: elapsedTime,
						streak: gameState.streak,
						bestTime
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

export default FretboardGame;