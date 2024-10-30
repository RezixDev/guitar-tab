// components/TuningSelector.tsx
import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TuningSelectorProps {
    onChange: (value: string) => void;
    value?: string;
}

export const TuningSelector: React.FC<TuningSelectorProps> = ({ onChange, value = 'standard' }) => {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Tuning" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="standard">
                    Standard (EADGBE)
                </SelectItem>
                <SelectItem value="halfStepDown">
                    Half Step Down (Eb Ab Db Gb Bb Eb)
                </SelectItem>
                <SelectItem value="dropD">
                    Drop D (DADGBE)
                </SelectItem>
            </SelectContent>
        </Select>
    );
};