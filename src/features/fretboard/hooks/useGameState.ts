import { useCallback, useState } from "react";
import {
  calculateNote,
  generateRandomNote,
  getAllNotePositions,
} from "@shared/music/notes";
import type { NotePosition, Tuning } from "@shared/types/music";
import type { Points } from "@shared/types/fretboard";
import {
  MODE_HANDLERS,
  type FeedbackTexts,
  type GameState,
  type ModeName,
} from "../lib/guessHandlers";

type GameTranslations = {
  feedback: FeedbackTexts;
};

export type GameStateOptions = {
  initialTargetPoints?: Points;
};

function createInitialState(
  tuning: Tuning,
  targetPoints: Points,
  carryOver?: Partial<GameState>,
): GameState {
  const currentNote = generateRandomNote(tuning);
  const totalPositions = getAllNotePositions(currentNote.note, tuning).length;
  return {
    currentNote,
    points: 0,
    targetPoints,
    streak: 0,
    totalAttempts: 0,
    feedback: "",
    showNext: false,
    guessedPositions: [],
    foundPositions: new Set<string>(),
    correctPositionsCount: 0,
    isPositionLocked: false,
    totalPositions,
    ...carryOver,
  };
}

function pickMode(
  isNewbieMode: boolean,
  isHardMode: boolean,
  isFindAllMode: boolean,
): ModeName {
  if (isNewbieMode) return "newbie";
  if (isHardMode || isFindAllMode) return "findAll";
  return "easy";
}

export function useGameState(
  tuning: Tuning,
  translations: GameTranslations,
  options: GameStateOptions = {},
) {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(tuning, options.initialTargetPoints ?? 10),
  );

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleGuess = useCallback(
    (
      string: number,
      fret: number,
      isNewbieMode = false,
      isHardMode = false,
      isFindAllMode = false,
    ) => {
      setGameState((state) => {
        // Guard: ignore guesses to positions already played this round
        if (state.guessedPositions.some((p) => p.string === string && p.fret === fret)) {
          return state;
        }
        // Guard: newbie mode locks once the round is "found"
        if (state.isPositionLocked && isNewbieMode) return state;

        const note = calculateNote(string, fret, tuning);
        const position: NotePosition = { string, fret, note };
        const isCorrect = note === state.currentNote.note;

        const handler = MODE_HANDLERS[pickMode(isNewbieMode, isHardMode, isFindAllMode)];
        const patch = handler({
          state,
          position,
          isCorrect,
          feedback: translations.feedback,
        });
        if (!patch) return state;
        return { ...state, ...patch };
      });
    },
    [tuning, translations],
  );

  const resetGame = useCallback(() => {
    setGameState((prev) => createInitialState(tuning, prev.targetPoints));
  }, [tuning]);

  return { gameState, updateGameState, handleGuess, resetGame };
}
