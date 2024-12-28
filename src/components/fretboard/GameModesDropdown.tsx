// components/fretboard/GameModesDropdown.tsx
import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export type GameMode = "newbie" | "easy" | "hard" | "time";

interface GameModeTranslations {
	label: string;
	description: string;
}

interface GameModesDropdownProps {
	value: GameMode;
	onChange: (mode: GameMode) => void;
	disabled?: boolean;
	translations: {
		placeholder: string;
		modes: {
			[key in GameMode]: GameModeTranslations;
		};
	};
}

export const GameModesDropdown: React.FC<GameModesDropdownProps> = ({
	value,
	onChange,
	disabled = false,
	translations,
}) => {
	const gameModes: Record<GameMode, GameModeTranslations> = {
		newbie: translations.modes.newbie,
		easy: translations.modes.easy,
		hard: translations.modes.hard,
		time: translations.modes.time,
	};

	return (
		<div className="flex items-center gap-2">
			<Select
				value={value}
				onValueChange={(val) => onChange(val as GameMode)}
				disabled={disabled}
			>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder={translations.placeholder} />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(gameModes).map(([key, { label, description }]) => (
						<SelectItem
							key={key}
							value={key}
							className="flex items-center justify-between"
						>
							<span>{label}</span>
							<TooltipProvider delayDuration={0}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Info className="h-4 w-4 text-muted-foreground" />
									</TooltipTrigger>
									<TooltipContent>
										<p>{description}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
