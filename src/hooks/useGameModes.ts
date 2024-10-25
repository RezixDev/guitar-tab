// hooks/useGameModes.ts
import { useState } from 'react';

export const useGameModes = () => {
    const [newbieMode, setNewbieMode] = useState(true);
    const [easyMode, setEasyMode] = useState(false);
    const [hardMode, setHardMode] = useState(false);
    const [timeChallenge, setTimeChallenge] = useState(false);

    const setMode = (mode: 'newbie' | 'easy' | 'hard', value: boolean) => {
        setNewbieMode(mode === 'newbie' ? value : false);
        setEasyMode(mode === 'easy' ? value : false);
        setHardMode(mode === 'hard' ? value : false);
    };

    return {
        modes: { newbieMode, easyMode, hardMode, timeChallenge },
        setMode,
        setTimeChallenge
    };
};