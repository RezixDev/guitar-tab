import { useState, useCallback } from 'react';
import type { Tuning, Note, NotePosition} from '@/utils/noteUtils';
import { generateRandomNote, getNote, getAllNotePositions } from '@/utils/noteUtils';

interface GameState {
  currentNote: Note;
  points: number;
  targetPoints: number;
  streak: number;
  totalAttempts: number;
  feedback: string;
  showNext: boolean;
  foundPositions: Set<string>;
  guessedPositions: NotePosition[];
  correctPositionsCount: number;
  isPositionLocked: boolean;
  totalPositions: number;
}

export const useGameState = (tuning: Tuning) => {
  const initialNote = generateRandomNote(tuning);
  const initialTotalPositions = getAllNotePositions(initialNote.note, tuning).length;

  const [gameState, setGameState] = useState<GameState>({
    currentNote: initialNote,
    points: 0,
    targetPoints: 10,
    streak: 0,
    totalAttempts: 0,
    feedback: '',
    showNext: false,
    guessedPositions: [],
    foundPositions: new Set<string>(),
    correctPositionsCount: 0,
    isPositionLocked: false,
    totalPositions: initialTotalPositions
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkNoteAtPosition = useCallback((string: number, fret: number): boolean => {
    const noteAtPosition = getNote(string, fret, tuning);
    return noteAtPosition === gameState.currentNote.note;
  }, [gameState.currentNote.note, tuning]);

  const handleGuess = useCallback((
    string: number, 
    fret: number, 
    isNewbieMode: boolean = false,
    isHardMode: boolean = false
  ) => {
    if (gameState.isPositionLocked && isNewbieMode) return;
    
    const isCorrect = checkNoteAtPosition(string, fret);
    
    const isAlreadyGuessed = gameState.guessedPositions.some(
      pos => pos.string === string && pos.fret === fret
    );
    if (isAlreadyGuessed) return;

    const position: NotePosition = {
      string,
      fret,
      note: getNote(string, fret, tuning)
    };

    if (!isNewbieMode && !isHardMode) {
      if (isCorrect) {
        updateGameState({
          points: gameState.points + 1,
          streak: gameState.streak + 1,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'Perfect! You found the exact position!',
          showNext: true,
          guessedPositions: [...gameState.guessedPositions, position]
        });
      } else {
        updateGameState({
          streak: 0,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'Try again! Find any position of this note.',
          guessedPositions: [...gameState.guessedPositions, position]
        });
      }
      return;
    }

    if (isNewbieMode) {
      if (isCorrect && !gameState.showNext) {
        updateGameState({
          points: gameState.points + 1,
          streak: gameState.streak + 1,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'You found one correct position!',
          showNext: true,
          guessedPositions: [...gameState.guessedPositions, position]
        });
      } else if (!isCorrect && !gameState.showNext) {
        updateGameState({
          streak: 0,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'Try again!',
          guessedPositions: [...gameState.guessedPositions, position]
        });
      }
      return;
    }

    if (isHardMode) {
      if (isCorrect && !isAlreadyGuessed) {
        const allPositions = getAllNotePositions(gameState.currentNote.note, tuning);
        const positionKey = `${string}-${fret}`;
        const newFoundPositions = new Set(gameState.foundPositions);
        newFoundPositions.add(positionKey);

        const foundCount = newFoundPositions.size;
        const remainingPositions = gameState.totalPositions - foundCount;
        const allPositionsFound = foundCount >= gameState.totalPositions;

        updateGameState({
          foundPositions: newFoundPositions,
          correctPositionsCount: foundCount,
          guessedPositions: [...gameState.guessedPositions, position],
          showNext: allPositionsFound,
          feedback: allPositionsFound 
            ? 'Excellent! You found all positions!' 
            : `Correct! ${remainingPositions} position${remainingPositions === 1 ? '' : 's'} remaining.`,
          points: allPositionsFound ? gameState.points + 1 : gameState.points,
          streak: allPositionsFound ? gameState.streak + 1 : gameState.streak
        });

        if (allPositionsFound && !gameState.showNext) {
          updateGameState({
            showNext: true,
            feedback: 'Excellent! You found all positions!'
          });
        }
      } else {
        const allPositionsFound = gameState.foundPositions.size >= gameState.totalPositions;

        updateGameState({
          streak: 0,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'Try again! Find all positions of this note.',
          guessedPositions: [...gameState.guessedPositions, position],
          showNext: allPositionsFound
        });
      }
      return;
    }

    if (isCorrect && !gameState.showNext) {
      updateGameState({
        points: gameState.points + 1,
        streak: gameState.streak + 1,
        totalAttempts: gameState.totalAttempts + 1,
        feedback: 'Correct!',
        showNext: true,
        guessedPositions: [...gameState.guessedPositions, position]
      });
    } else if (!isCorrect && !gameState.showNext) {
      updateGameState({
        streak: 0,
        totalAttempts: gameState.totalAttempts + 1,
        feedback: 'Try again!',
        guessedPositions: [...gameState.guessedPositions, position]
      });
    }
  }, [gameState, checkNoteAtPosition, updateGameState, tuning]);

  const resetGame = useCallback(() => {
    const newNote = generateRandomNote(tuning);
    const newTotalPositions = getAllNotePositions(newNote.note, tuning).length;

    setGameState({
      currentNote: newNote,
      points: 0,
      targetPoints: gameState.targetPoints,
      streak: 0,
      totalAttempts: 0,
      feedback: '',
      showNext: false,
      guessedPositions: [],
      foundPositions: new Set<string>(),
      correctPositionsCount: 0,
      isPositionLocked: false,
      totalPositions: newTotalPositions
    });
  }, [tuning, gameState.targetPoints]);

  return {
    gameState,
    updateGameState,
    handleGuess,
    resetGame
  };
};