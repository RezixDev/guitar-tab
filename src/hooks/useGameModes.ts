// hooks/useGameModes.ts
import { useState } from 'react';
import type { GameMode } from '@/components/fretboard/GameModesDropdown';

export const useGameModes = () => {
    const [gameMode, setGameMode] = useState<GameMode>('newbie');

    return {
        gameMode,
        setGameMode,
        isNewbieMode: gameMode === 'newbie',
        isEasyMode: gameMode === 'easy',
        isHardMode: gameMode === 'hard',
        isTimeChallenge: gameMode === 'time'
    };
};