// hooks/useAudioManager.ts
import { useState, useEffect } from 'react';
import { AudioManager } from '../utils/audioUtils';

export const useAudioManager = () => {
    const [audioManager] = useState(() => new AudioManager());
    const [isAudioLoaded, setIsAudioLoaded] = useState(false);

    useEffect(() => {
        const loadAudio = async () => {
            try {
                await audioManager.preloadAllNotes();
                setIsAudioLoaded(true);
            } catch (error) {
                console.warn('Failed to load audio:', error);
                setIsAudioLoaded(false);
            }
        };

        loadAudio();
    }, []);

    return { audioManager, isAudioLoaded };
};
