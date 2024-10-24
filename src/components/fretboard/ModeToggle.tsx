// components/fretboard/ModeToggle.tsx
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ModeToggleProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
	label,
	checked,
	onChange,
}) => {
	return (
		<div className="flex items-center space-x-2">
			<Switch id={label} checked={checked} onCheckedChange={onChange} />
			<Label htmlFor={label}>{label}</Label>
		</div>
	);
};

export default ModeToggle;
