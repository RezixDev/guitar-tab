import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { GameMode } from '@/components/fretboard/GameModesDropdown';

export const useGameModes = () => {
    const [gameMode, setGameMode] = useLocalStorage<GameMode>('fretboard-game-mode', 'newbie');

    return {
        gameMode,
        setGameMode,
        isNewbieMode: gameMode === 'newbie',
        isEasyMode: gameMode === 'easy',
        isHardMode: gameMode === 'hard',
        isFindAllMode: gameMode === 'findAll',
        isTimeChallenge: gameMode === 'time'
    };
};