"use client";

import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { PracticeType, Difficulty } from "./practicePatterns";

interface PracticeSettingsProps {
    practiceType: PracticeType;
    difficulty: Difficulty;
    startFret: number;
    onPracticeTypeChange: (type: PracticeType) => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
    onStartFretChange: (fret: number) => void;
}

const PRACTICE_TYPES: { value: PracticeType; label: string }[] = [
    { value: "chromatic", label: "Chromatic Exercise" },
    { value: "scaleRun", label: "Scale Run" },
    { value: "stringSkipping", label: "String Skipping" },
    { value: "legato", label: "Legato Pattern" },
    { value: "picking", label: "Picking Exercise" },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
];

export function PracticeSettings({
    practiceType,
    difficulty,
    startFret,
    onPracticeTypeChange,
    onDifficultyChange,
    onStartFretChange,
}: PracticeSettingsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Practice Type */}
            <div className="space-y-2">
                <Label htmlFor="practice-type">Practice Type</Label>
                <Select
                    value={practiceType}
                    onValueChange={(value) => onPracticeTypeChange(value as PracticeType)}
                >
                    <SelectTrigger id="practice-type">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        {PRACTICE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                    value={difficulty}
                    onValueChange={(value) => onDifficultyChange(value as Difficulty)}
                >
                    <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        {DIFFICULTIES.map((diff) => (
                            <SelectItem key={diff.value} value={diff.value}>
                                {diff.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Starting Fret */}
            <div className="space-y-2">
                <Label>Starting Fret: {startFret}</Label>
                <Slider
                    value={[startFret]}
                    onValueChange={(value) => onStartFretChange(value[0])}
                    min={1}
                    max={12}
                    step={1}
                    className="py-2"
                />
            </div>
        </div>
    );
}
