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

interface GameModesDropdownProps {
	value: GameMode;
	onChange: (mode: GameMode) => void;
	disabled?: boolean;
}

const GAME_MODES = {
	newbie: {
		label: "Newbie Mode",
		description: "Multiple correct positions with visual aids",
	},
	easy: {
		label: "Easy Mode",
		description: "Single position guessing with basic feedback",
	},
	hard: {
		label: "Hard Mode",
		description: "Find all positions without visual aids",
	},
	time: {
		label: "Time Challenge",
		description: "Race against the clock with speed-based scoring",
	},
} as const;

export const GameModesDropdown: React.FC<GameModesDropdownProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	return (
		<div className="flex items-center gap-2">
			<Select
				value={value}
				onValueChange={(val) => onChange(val as GameMode)}
				disabled={disabled}
			>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder="Select game mode" />
				</SelectTrigger>
				<SelectContent>
					{Object.entries(GAME_MODES).map(([key, { label, description }]) => (
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
