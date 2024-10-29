import { useState, useCallback } from 'react';
import type { Tuning } from '@/utils/noteUtils';

interface Position {
  string: number;
  fret: number;
}

interface GameState {
  currentNote: string;
  points: number;
  targetPoints: number;
  streak: number;
  totalAttempts: number;
  feedback: string;
  showNext: boolean;
  guessedPositions: Position[];
}

const generateRandomNote = (tuning: Tuning): string => {
  const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  return notes[Math.floor(Math.random() * notes.length)];
};

export const useGameState = (tuning: Tuning) => {
  const [gameState, setGameState] = useState<GameState>({
    currentNote: generateRandomNote(tuning),
    points: 0,
    targetPoints: 10,
    streak: 0,
    totalAttempts: 0,
    feedback: '',
    showNext: false,
    guessedPositions: []
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  const checkNoteAtPosition = useCallback((string: number, fret: number): boolean => {
    // Get the base note of the string from tuning
    const stringNote = tuning[string - 1];
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    
    // Calculate the note at the given fret
    const baseNoteIndex = notes.indexOf(stringNote);
    const noteIndex = (baseNoteIndex + fret) % 12;
    const noteAtPosition = notes[noteIndex];
    
    return noteAtPosition === gameState.currentNote;
  }, [gameState.currentNote, tuning]);

  const handleGuess = useCallback((string: number, fret: number) => {
    const isCorrect = checkNoteAtPosition(string, fret);
    const position = { string, fret };

    if (isCorrect && !gameState.showNext) {
      const newPoints = gameState.points + 1;
      const newStreak = gameState.streak + 1;
      
      updateGameState({
        points: newPoints,
        streak: newStreak,
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
  }, [gameState, checkNoteAtPosition, updateGameState]);

  const resetGame = useCallback(() => {
    setGameState({
      currentNote: generateRandomNote(tuning),
      points: 0,
      targetPoints: gameState.targetPoints,
      streak: 0,
      totalAttempts: 0,
      feedback: '',
      showNext: false,
      guessedPositions: []
    });
  }, [tuning, gameState.targetPoints]);

  return {
    gameState,
    updateGameState,
    handleGuess,
    resetGame
  };
};