// hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { generateRandomNote, Tuning, standardTuning, Note, NotePosition } from '@/utils/noteUtils';

interface GameState {
    points: number;
    targetPoints: number;
    streak: number;
    feedback: string;
    showNext: boolean;
    guessedPositions: NotePosition[];
    currentNote: Note | null;
    totalAttempts: number;
}

export const useGameState = (tuning: Tuning) => {
    const [state, setState] = useState<GameState>({
        points: 0,
        targetPoints: 30,
        streak: 0,
        feedback: "",
        showNext: false,
        guessedPositions: [],
        currentNote: null,
        totalAttempts: 0
    });

    const resetGame = () => {
        setState({
            ...state,
            points: 0,
            streak: 0,
            guessedPositions: [],
            feedback: "",
            showNext: false,
            currentNote: generateRandomNote(tuning),
            totalAttempts: 0
        });
    };

    const updateGameState = (updates: Partial<GameState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    useEffect(() => {
        if (!state.currentNote) {
            updateGameState({ currentNote: generateRandomNote(tuning) });
        }
    }, [state.currentNote, tuning]);

    return {
        gameState: state,
        resetGame,
        updateGameState
    };
};