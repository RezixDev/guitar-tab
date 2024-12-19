// components/GameSettings.tsx
import { Label } from "@/components/ui/label";
import { TuningSelector } from "./TuningSelector";
import { PointsSelector } from "./PointsSelector";
import { GameModesDropdown, type GameMode } from "./GameModesDropdown";
import { ModeToggle } from "./ModeToggle";

import { type Tuning } from "@/utils/noteUtils";

interface GameSettingsProps {
	onTuningChange: (value: string) => void;
	targetPoints: number;
	onTargetPointsChange: (value: number) => void;
	gameMode: GameMode;
	onGameModeChange: (mode: GameMode) => void;
	disabled?: boolean;
	displayTuning: Tuning;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
	onTuningChange,
	targetPoints,
	onTargetPointsChange,
	gameMode,
	onGameModeChange,
	disabled = false,
	displayTuning,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>Tuning</Label>
					<TuningSelector onChange={onTuningChange} disabled={disabled} />
				</div>
				<div className="space-y-2">
					<Label>Target Score</Label>
					<PointsSelector
						value={targetPoints}
						onChange={onTargetPointsChange}
						disabled={disabled}
					/>
				</div>
			</div>
			<div className="space-y-4">
				<Label>Game Mode</Label>
				<GameModesDropdown
					value={gameMode}
					onChange={onGameModeChange}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};
