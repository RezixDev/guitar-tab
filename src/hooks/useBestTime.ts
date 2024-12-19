// hooks/useBestTime.ts
import { useState } from 'react';

export const useBestTime = () => {
    const [bestTime, setBestTime] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null;
        const stored = localStorage.getItem('fretboard-best-time');
        return stored ? Number(stored) : null;
    });

    const updateBestTime = (newTime: number) => {
        if (bestTime === null || newTime < bestTime) {
            setBestTime(newTime);
            localStorage.setItem('fretboard-best-time', newTime.toString());
        }
    };

    return { bestTime, updateBestTime };
};