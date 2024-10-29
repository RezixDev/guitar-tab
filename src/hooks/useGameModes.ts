// hooks/useGameModes.ts
import { useState } from 'react';

// Define default modes as a constant
const DEFAULT_MODES = {
    newbieMode: false,
    easyMode: false,
    hardMode: false,
    timeChallenge: false,
};

export const useGameModes = () => {
    const [modes, setModes] = useState(DEFAULT_MODES);

    const setMode = (mode: keyof typeof DEFAULT_MODES, value: boolean) => {
        setModes(prev => ({
            ...prev,
            // Set the specified mode to the new value
            [mode]: value,
            // If enabling one mode, disable others (except timeChallenge)
            ...(value && mode !== 'timeChallenge' ? {
                newbieMode: mode === 'newbieMode' ? value : false,
                easyMode: mode === 'easyMode' ? value : false,
                hardMode: mode === 'hardMode' ? value : false,
            } : {})
        }));
    };

    const setTimeChallenge = (value: boolean) => {
        setModes(prev => ({
            ...prev,
            timeChallenge: value
        }));
    };

    return { modes, setMode, setTimeChallenge };
};