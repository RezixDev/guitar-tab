import type { NotePosition } from "@shared/types/music";
import type { Points } from "@shared/types/fretboard";

export type GameState = {
  currentNote: { note: string; string: number; fret: number };
  points: number;
  targetPoints: Points;
  streak: number;
  totalAttempts: number;
  feedback: string;
  showNext: boolean;
  foundPositions: Set<string>;
  guessedPositions: NotePosition[];
  correctPositionsCount: number;
  isPositionLocked: boolean;
  totalPositions: number;
};

export type FeedbackTexts = {
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

type Ctx = {
  state: GameState;
  position: NotePosition;
  isCorrect: boolean;
  feedback: FeedbackTexts;
};

/**
 * Each handler returns a partial GameState patch to merge in. Pure functions —
 * easy to unit-test and reason about, no React, no side effects.
 */
export type ModeHandler = (ctx: Ctx) => Partial<GameState> | null;

/** Easy mode: one guess per round, instant feedback. */
export const easyMode: ModeHandler = ({ state, position, isCorrect, feedback }) => {
  const guessedPositions = [...state.guessedPositions, position];
  if (isCorrect) {
    return {
      points: state.points + 1,
      streak: state.streak + 1,
      totalAttempts: state.totalAttempts + 1,
      feedback: feedback.perfect,
      showNext: true,
      guessedPositions,
    };
  }
  return {
    streak: 0,
    totalAttempts: state.totalAttempts + 1,
    feedback: feedback.tryAgainAny,
    guessedPositions,
  };
};

/**
 * Newbie mode: same as easy but ignores guesses once the round is "found"
 * (so the player can't keep poking the fretboard before pressing Next).
 */
export const newbieMode: ModeHandler = ({ state, position, isCorrect, feedback }) => {
  if (state.showNext) return null;
  const guessedPositions = [...state.guessedPositions, position];
  if (isCorrect) {
    return {
      points: state.points + 1,
      streak: state.streak + 1,
      totalAttempts: state.totalAttempts + 1,
      feedback: feedback.foundOne,
      showNext: true,
      guessedPositions,
    };
  }
  return {
    streak: 0,
    totalAttempts: state.totalAttempts + 1,
    feedback: feedback.tryAgain,
    guessedPositions,
  };
};

/** Hard / Find-All: locate every position of the target note. */
export const findAllMode: ModeHandler = ({ state, position, isCorrect, feedback }) => {
  const guessedPositions = [...state.guessedPositions, position];

  if (isCorrect) {
    const foundPositions = new Set(state.foundPositions);
    foundPositions.add(`${position.string}-${position.fret}`);
    const foundCount = foundPositions.size;
    const remaining = state.totalPositions - foundCount;
    const allFound = foundCount >= state.totalPositions;

    return {
      foundPositions,
      correctPositionsCount: foundCount,
      guessedPositions,
      showNext: allFound,
      feedback: allFound
        ? feedback.excellent
        : feedback.remainingPositions(remaining),
      points: allFound ? state.points + 1 : state.points,
      streak: allFound ? state.streak + 1 : state.streak,
    };
  }

  const allFound = state.foundPositions.size >= state.totalPositions;
  return {
    streak: 0,
    totalAttempts: state.totalAttempts + 1,
    feedback: feedback.tryAgainAll,
    guessedPositions,
    showNext: allFound,
  };
};

export type ModeName = "easy" | "newbie" | "findAll";

export const MODE_HANDLERS: Record<ModeName, ModeHandler> = {
  easy: easyMode,
  newbie: newbieMode,
  findAll: findAllMode,
};
