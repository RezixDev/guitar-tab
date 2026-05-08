import type { Difficulty, PracticeType } from "@shared/types/practice";
import { Label } from "@shared/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/Select";
import { Slider } from "@shared/ui/Slider";
import { PRACTICE_TYPES, PRACTICE_TYPE_LABELS } from "../data/exercises";

type PracticeSettingsProps = {
  practiceType: PracticeType;
  difficulty: Difficulty;
  startFret: number;
  onPracticeTypeChange: (type: PracticeType) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartFretChange: (fret: number) => void;
  /** True when the active exercise has no `baseFret` and shouldn't transpose. */
  startFretDisabled?: boolean;
};

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
  startFretDisabled = false,
}: PracticeSettingsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="practice-type">Practice Type</Label>
        <Select
          value={practiceType}
          onValueChange={(v) => onPracticeTypeChange(v as PracticeType)}
        >
          <SelectTrigger id="practice-type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {PRACTICE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {PRACTICE_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={difficulty}
          onValueChange={(v) => onDifficultyChange(v as Difficulty)}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className={startFretDisabled ? "text-[var(--color-fg-muted)]" : undefined}>
          Starting Fret: {startFret}
          {startFretDisabled && (
            <span className="ml-2 text-xs italic">(fixed for this exercise)</span>
          )}
        </Label>
        <Slider
          value={[startFret]}
          onValueChange={(v) => onStartFretChange(v[0])}
          min={1}
          max={12}
          step={1}
          disabled={startFretDisabled}
          className="py-2"
        />
      </div>
    </div>
  );
}
