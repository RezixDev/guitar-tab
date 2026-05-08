import { useEffect, useState } from "react";

type Options = {
  /** When false the timer is paused and elapsed time stops advancing. */
  enabled: boolean;
  /** Reset value (ms-since-epoch). Changing this restarts the timer. */
  startTimeMs: number;
};

/**
 * Returns the seconds elapsed since `startTimeMs` while `enabled` is true.
 * Pauses cleanly when disabled and resumes on the next enable.
 */
export function useElapsedTimer({ enabled, startTimeMs }: Options): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeMs) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, startTimeMs]);

  // Reset to 0 every time `startTimeMs` changes (start of a new session)
  useEffect(() => {
    setElapsedSeconds(0);
  }, [startTimeMs]);

  return elapsedSeconds;
}
