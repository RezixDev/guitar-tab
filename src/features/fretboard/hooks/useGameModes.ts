import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import type { GameMode } from "@shared/types/fretboard";

export function useGameModes() {
  const [gameMode, setGameMode] = useLocalStorage<GameMode>("fretboard-game-mode", "newbie");

  return {
    gameMode,
    setGameMode,
    isNewbieMode: gameMode === "newbie",
    isEasyMode: gameMode === "easy",
    isHardMode: gameMode === "hard",
    isFindAllMode: gameMode === "findAll",
    isTimeChallenge: gameMode === "time",
  };
}
