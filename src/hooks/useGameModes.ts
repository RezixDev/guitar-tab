// hooks/useGameModes.ts
import { useState, useEffect } from 'react';

// Define default modes as a constant
const DEFAULT_MODES = {
    showAllNotes: false,
    newbieMode: false,
    easyMode: false,
    hardMode: false,
    timeChallenge: true,
};

export const useGameModes = () => {
    const [modes, setModes] = useState({
        ...DEFAULT_MODES,
        easyMode: false,
        hardMode: false,
    });

    const setMode = (mode: keyof typeof modes) => {
        // Prevent easyMode and hardMode from being changed
        if (mode === 'easyMode' || mode === 'hardMode') return;
        
        setModes((prev) => ({
            ...prev,
            [mode]: !prev[mode],
        }));
    };

    const setTimeChallenge = (value: boolean) => {
        setModes((prev) => ({
            ...prev,
            timeChallenge: value,
        }));
    };

    // Always ensure easyMode and hardMode are false
    useEffect(() => {
        setModes(prev => ({
            ...prev,
            easyMode: false,
            hardMode: false
        }));
    }, []);

    return { 
        modes: { ...modes, easyMode: false, hardMode: false }, // Force them to be false in the returned object
        setMode, 
        setTimeChallenge 
    };
};