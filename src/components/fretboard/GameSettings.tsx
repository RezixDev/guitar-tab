import { Label } from "@/components/ui/label";
import { TuningSelector } from "./TuningSelector";
import { PointsSelector } from "./PointsSelector";
import { GameModesDropdown, type GameMode } from "./GameModesDropdown";
import { ModeToggle } from "./ModeToggle";
import { type Tuning } from "@/utils/noteUtils";

import { useTranslations } from "next-intl";

interface GameSettingsProps {
	onTuningChange: (value: string) => void;
	targetPoints: number;
	onTargetPointsChange: (value: number) => void;
	gameMode: GameMode;
	onGameModeChange: (mode: GameMode) => void;
	disabled?: boolean;
	displayTuning: Tuning;
	translations: {
		tuning: string;
		targetScore: string;
		gameMode: string;
		gameModes: {
			placeholder: string;
			modes: {
				newbie: { label: string; description: string };
				easy: { label: string; description: string };
				hard: { label: string; description: string };
				time: { label: string; description: string };
			};
		};
	};
}

export const GameSettings: React.FC<GameSettingsProps> = ({
	onTuningChange,
	targetPoints,
	onTargetPointsChange,
	gameMode,
	onGameModeChange,
	disabled = false,
	displayTuning,
	translations,
}) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label>{translations.tuning}</Label>
					<TuningSelector onChange={onTuningChange} disabled={disabled} />
				</div>
				<div className="space-y-2">
					<Label>{translations.targetScore}</Label>
					<PointsSelector
						value={targetPoints}
						onChange={onTargetPointsChange}
						disabled={disabled}
					/>
				</div>
			</div>
			<div className="space-y-4">
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
};
