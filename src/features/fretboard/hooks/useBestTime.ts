import { useLocalStorage } from "@shared/hooks/useLocalStorage";

export function useBestTime() {
  const [bestTime, setBestTime] = useLocalStorage<number | null>("fretboard-best-time", null);

  const updateBestTime = (newTime: number) => {
    if (bestTime === null || newTime < bestTime) {
      setBestTime(newTime);
    }
  };

  return { bestTime, updateBestTime };
}
