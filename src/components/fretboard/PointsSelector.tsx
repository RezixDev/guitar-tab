import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PointsSelectorProps {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
}

const pointsOptions = [5, 10, 20, 30, 40, 50] as const;

export const PointsSelector: React.FC<PointsSelectorProps> = ({
	value,
	onChange,
	disabled = false,
}) => {
	return (
		<Select
			onValueChange={(val) => onChange(Number(val))}
			value={value.toString()}
			disabled={disabled}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select Target Points" />
			</SelectTrigger>
			<SelectContent>
				{pointsOptions.map((points) => (
					<SelectItem key={points} value={points.toString()}>
						{points} points
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
