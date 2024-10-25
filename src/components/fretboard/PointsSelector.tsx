
// components/PointsSelector.tsx
import React from 'react';
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
}

const pointsOptions = [5, 10, 20, 30, 40, 50] as const;

export const PointsSelector: React.FC<PointsSelectorProps> = ({ value, onChange }) => {
    return (
        <Select
            onValueChange={(val) => onChange(Number(val))}
            value={value.toString()}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Target Points" />
            </SelectTrigger>
            <SelectContent>
                {pointsOptions.map((points) => (
                    <SelectItem
                        key={points}
                        value={points.toString()}
                    >
                        {points} points
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

// Optional: Types for reuse
export type TuningOption = 'standard' | 'halfStepDown' | 'dropD';
export type PointsOption = typeof pointsOptions[number];

// Optional: Constants for reuse
export const TUNING_LABELS: Record<TuningOption, string> = {
    standard: 'Standard (EADGBE)',
    halfStepDown: 'Half Step Down (Eb Ab Db Gb Bb Eb)',
    dropD: 'Drop D (DADGBE)',
};

export const DEFAULT_TARGET_POINTS = 30;