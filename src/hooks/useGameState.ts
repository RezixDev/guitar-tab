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
  const [gameState, setGameState] = useState<GameState>({
    currentNote: generateRandomNote(tuning),
    points: 0,
    targetPoints: 10,
    streak: 0,
    totalAttempts: 0,
    feedback: '',
    showNext: false,
    guessedPositions: [],
    foundPositions: new Set<string>(),
    correctPositionsCount: 0,
    isPositionLocked: false
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkNoteAtPosition = useCallback((string: number, fret: number): boolean => {
    // Check if the note at this position matches the current note
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

  
    // Newbie mode logic
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

        const totalPositions = allPositions.length;
        const foundCount = newFoundPositions.size;
        const remainingPositions = totalPositions - foundCount;

        // Check if we've found all positions, regardless of wrong guesses
        const allPositionsFound = foundCount >= totalPositions;

        updateGameState({
          foundPositions: newFoundPositions,
          correctPositionsCount: foundCount,
          guessedPositions: [...gameState.guessedPositions, position],
          // Always set showNext to true if all positions are found
          showNext: allPositionsFound,
          feedback: allPositionsFound 
            ? 'Excellent! You found all positions!' 
            : `Correct! ${remainingPositions} position${remainingPositions === 1 ? '' : 's'} remaining.`,
          points: allPositionsFound ? gameState.points + 1 : gameState.points,
          streak: allPositionsFound ? gameState.streak + 1 : gameState.streak
        });

        // If we just found the last position, ensure the next button shows up
        if (allPositionsFound && !gameState.showNext) {
          updateGameState({
            showNext: true,
            feedback: 'Excellent! You found all positions!'
          });
        }
      } else {
        // For incorrect guesses, don't change showNext state if all positions are found
        const allPositions = getAllNotePositions(gameState.currentNote.note, tuning);
        const allPositionsFound = gameState.foundPositions.size >= allPositions.length;

        updateGameState({
          streak: 0,
          totalAttempts: gameState.totalAttempts + 1,
          feedback: 'Try again! Find all positions of this note.',
          guessedPositions: [...gameState.guessedPositions, position],
          // Keep showNext true if we already found all positions
          showNext: allPositionsFound ? true : false
        });
      }
      return;
    }

    // Normal mode logic
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
    setGameState({
      currentNote: generateRandomNote(tuning),
      points: 0,
      targetPoints: gameState.targetPoints,
      streak: 0,
      totalAttempts: 0,
      feedback: '',
      showNext: false,
      guessedPositions: [],
      foundPositions: new Set<string>(),
      correctPositionsCount: 0,
      isPositionLocked: false
    });
  }, [tuning, gameState.targetPoints]);

  return {
    gameState,
    updateGameState,
    handleGuess,
    resetGame
  };
};