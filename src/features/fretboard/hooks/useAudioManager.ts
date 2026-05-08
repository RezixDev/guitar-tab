import { useEffect, useState } from "react";
import { AudioManager } from "@shared/audio/AudioManager";

export function useAudioManager() {
  const [audioManager] = useState(() => new AudioManager());
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    audioManager
      .preloadAllNotes()
      .then(() => {
        if (!cancelled) setIsAudioLoaded(true);
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn("Failed to load audio:", error);
          setIsAudioLoaded(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [audioManager]);

  return { audioManager, isAudioLoaded };
}
