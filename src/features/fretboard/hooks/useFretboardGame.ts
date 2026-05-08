import { useCallback, useEffect, useMemo, useState } from "react";
import { generateRandomNote } from "@shared/music/notes";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import type { Points } from "@shared/types/fretboard";
import type { TuningId } from "../components/TuningSelector";
import { tuningById } from "../lib/tunings";
import { useAudioManager } from "./useAudioManager";
import { useBestTime } from "./useBestTime";
import { useElapsedTimer } from "./useElapsedTimer";
import { useGameModes } from "./useGameModes";
import { useGameState } from "./useGameState";
import { useKeyShortcut } from "./useKeyShortcut";

type FeedbackTranslations = {
  feedback: {
    perfect: string;
    tryAgainAny: string;
    foundOne: string;
    tryAgain: string;
    excellent: string;
    remainingPositions: (count: number) => string;
    remainingPosition: string;
    tryAgainAll: string;
    correct: string;
  };
};

/**
 * Orchestrates the full fretboard-game session: tuning, target points, mode,
 * audio playback, timer, completion modal, and the Enter-to-advance shortcut.
 * The component just renders the returned state and calls the returned actions.
 */
export function useFretboardGame(feedbackTranslations: FeedbackTranslations) {
  const [tuningId, setTuningId] = useLocalStorage<TuningId>(
    "fretboard-tuning-id",
    "standard",
  );
  const [targetPoints, setTargetPoints] = useLocalStorage<Points>(
    "fretboard-target-points",
    10,
  );

  const tuning = useMemo(() => tuningById(tuningId), [tuningId]);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [startTimeMs, setStartTimeMs] = useState(() => Date.now());

  const { bestTime, updateBestTime } = useBestTime();
  const { gameState, handleGuess, resetGame, updateGameState } = useGameState(
    tuning,
    feedbackTranslations,
    { initialTargetPoints: targetPoints },
  );
  const { audioManager, isAudioLoaded } = useAudioManager();
  const modes = useGameModes();

  // Keep the points target in sync when the user changes the goal mid-session
  useEffect(() => {
    if (gameState.targetPoints !== targetPoints) {
      updateGameState({ targetPoints });
    }
  }, [targetPoints, gameState.targetPoints, updateGameState]);

  // Time-challenge timer — pauses while the round is "found" (showNext=true)
  const elapsedTime = useElapsedTimer({
    enabled: modes.isTimeChallenge && !gameState.showNext && isGameStarted,
    startTimeMs,
  });

  // Game completion: target reached → show modal (and record best time)
  useEffect(() => {
    if (!isGameStarted) return;
    if (gameState.points < gameState.targetPoints) return;
    if (modes.isTimeChallenge) updateBestTime(elapsedTime);
    setShowCompletionModal(true);
  }, [
    isGameStarted,
    gameState.points,
    gameState.targetPoints,
    elapsedTime,
    modes.isTimeChallenge,
    updateBestTime,
  ]);

  const handleNextNote = useCallback(() => {
    updateGameState({
      currentNote: generateRandomNote(tuning),
      feedback: "",
      showNext: false,
      guessedPositions: [],
      correctPositionsCount: 0,
      foundPositions: new Set(),
    });
  }, [tuning, updateGameState]);

  // Press Enter to advance to the next note when one is locked in
  useKeyShortcut("Enter", handleNextNote, gameState.showNext);

  const handleTuningChange = useCallback(
    (id: TuningId) => {
      setTuningId(id);
      resetGame();
    },
    [setTuningId, resetGame],
  );

  const handleFretClick = useCallback(
    (visualString: number, fret: number) => {
      if (gameState.showNext || !isGameStarted) return;
      handleGuess(
        visualString,
        fret,
        modes.isNewbieMode,
        modes.isHardMode,
        modes.isFindAllMode,
      );
      if (audioManager && isAudioLoaded) {
        audioManager.playNote(visualString.toString(), fret);
      }
    },
    [
      gameState.showNext,
      isGameStarted,
      handleGuess,
      modes.isNewbieMode,
      modes.isHardMode,
      modes.isFindAllMode,
      audioManager,
      isAudioLoaded,
    ],
  );

  const handleStartGame = useCallback(() => {
    setIsGameStarted(true);
    setStartTimeMs(Date.now());
    updateGameState({
      currentNote: generateRandomNote(tuning),
      points: 0,
      feedback: "",
      showNext: false,
      guessedPositions: [],
    });
  }, [tuning, updateGameState]);

  const handleReset = useCallback(() => {
    setIsGameStarted(false);
    resetGame();
    setStartTimeMs(Date.now());
    modes.setGameMode("newbie");
  }, [resetGame, modes]);

  const handleCompletionClose = useCallback(() => {
    setShowCompletionModal(false);
    handleReset();
  }, [handleReset]);

  return {
    // Persistent settings
    tuningId,
    targetPoints,
    setTargetPoints,
    // Active session
    tuning,
    gameState,
    bestTime,
    elapsedTime,
    isGameStarted,
    showTutorial,
    showCompletionModal,
    setShowTutorial,
    // Modes
    modes,
    // Actions
    handleNextNote,
    handleTuningChange,
    handleFretClick,
    handleStartGame,
    handleReset,
    handleCompletionClose,
  };
}
