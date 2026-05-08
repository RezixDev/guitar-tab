import { Label } from "@shared/ui/Label";
import type { GameMode, Points } from "@shared/types/fretboard";
import { TuningSelector, type TuningId } from "./TuningSelector";
import { PointsSelector } from "./PointsSelector";
import { GameModesDropdown } from "./GameModesDropdown";

type GameSettingsProps = {
  onTuningChange: (value: TuningId) => void;
  targetPoints: Points;
  onTargetPointsChange: (value: Points) => void;
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
  disabled?: boolean;
  displayTuning: TuningId;
  translations: {
    tuning: string;
    targetScore: string;
    gameMode: string;
    gameModes: {
      placeholder: string;
      modes: { [k in GameMode]: { label: string; description: string } };
    };
  };
};

export function GameSettings({
  onTuningChange,
  targetPoints,
  onTargetPointsChange,
  gameMode,
  onGameModeChange,
  disabled = false,
  displayTuning,
  translations,
}: GameSettingsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>{translations.tuning}</Label>
          <TuningSelector onChange={onTuningChange} value={displayTuning} disabled={disabled} />
        </div>
        <div className="space-y-2">
          <Label>{translations.targetScore}</Label>
          <PointsSelector value={targetPoints} onChange={onTargetPointsChange} disabled={disabled} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{translations.gameMode}</Label>
        <GameModesDropdown
          value={gameMode}
          onChange={onGameModeChange}
          disabled={disabled}
          translations={translations.gameModes}
        />
      </div>
    </div>
  );
}
