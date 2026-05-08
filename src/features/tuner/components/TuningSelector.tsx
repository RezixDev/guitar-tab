import { Label } from "@shared/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/Select";
import { TUNINGS, TUNING_IDS } from "../data/tunings";
import type { TuningId } from "../types";

type TuningSelectorProps = {
  value: TuningId;
  onChange: (id: TuningId) => void;
};

export function TuningSelector({ value, onChange }: TuningSelectorProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <Label htmlFor="tuning-preset" className="shrink-0">
        Tuning
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as TuningId)}>
        <SelectTrigger id="tuning-preset" className="w-full sm:w-[260px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TUNING_IDS.map((id) => (
            <SelectItem key={id} value={id}>
              {TUNINGS[id].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
