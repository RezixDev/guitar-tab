import { useState, useCallback } from 'react';
import type { Tuning, Note, NotePosition } from '@/utils/noteUtils';

interface GameState {
  currentNote: Note;
  points: number;
  targetPoints: number;
  streak: number;
  totalAttempts: number;
  feedback: string;
  showNext: boolean;
  guessedPositions: NotePosition[];
}

const generateRandomNote = (tuning: Tuning): Note => {
  const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  const randomNote = notes[Math.floor(Math.random() * notes.length)];
  
  const validPositions: Array<{ string: number; fret: number }> = [];
  
  // Find all valid positions for the note
  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 0; fret <= 12; fret++) { // Changed to <= 12 to include the 12th fret
      const stringNote = tuning[string];
      const baseNoteIndex = notes.indexOf(stringNote);
      if (baseNoteIndex === -1) continue; // Skip if the note isn't found
      
      const noteIndex = (baseNoteIndex + fret + 1) % 12;
      const noteAtPosition = notes[noteIndex];
      
      if (noteAtPosition === randomNote) {
        validPositions.push({ string, fret });
      }
    }
  }
  
  // If no valid positions found, try another random note
  if (validPositions.length === 0) {
    // Fallback to first string, first fret with the open string note
    const firstStringNote = tuning[0];
    return {
      note: firstStringNote,
      string: 0,
      fret: 0
    };
  }
  
  const randomPosition = validPositions[Math.floor(Math.random() * validPositions.length)];
  
  return {
    note: randomNote,
    string: randomPosition.string,
    fret: randomPosition.fret
  };
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
    const stringNote = tuning[string];
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const baseNoteIndex = notes.indexOf(stringNote);
    if (baseNoteIndex === -1) return false;
    
    const noteIndex = (baseNoteIndex + fret + 1) % 12;
    const noteAtPosition = notes[noteIndex];
    
    return noteAtPosition === gameState.currentNote.note;
  }, [gameState.currentNote.note, tuning]);

  const handleGuess = useCallback((string: number, fret: number) => {
    const isCorrectPosition = string === gameState.currentNote.string && 
                            fret === gameState.currentNote.fret;
    const isCorrect = checkNoteAtPosition(string, fret);
    
    const stringNote = tuning[string];
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const baseNoteIndex = notes.indexOf(stringNote);
    if (baseNoteIndex === -1) return;
    
    const noteIndex = (baseNoteIndex + fret + 1) % 12;
    const noteAtPosition = notes[noteIndex];

    const position: NotePosition = {
      string,
      fret,
      note: noteAtPosition
    };

    if ((isCorrect || isCorrectPosition) && !gameState.showNext) {
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