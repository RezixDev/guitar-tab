import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/Select";

const TUNINGS = [
  { value: "standard", label: "Standard (EADGBE)" },
  { value: "halfStepDown", label: "Half Step Down (Eb Ab Db Gb Bb Eb)" },
  { value: "dropD", label: "Drop D (DADGBE)" },
] as const;

export type TuningId = (typeof TUNINGS)[number]["value"];

type TuningSelectorProps = {
  value?: TuningId;
  onChange: (value: TuningId) => void;
  disabled?: boolean;
};

export function TuningSelector({ value = "standard", onChange, disabled = false }: TuningSelectorProps) {
  return (
    <Select onValueChange={(v) => onChange(v as TuningId)} value={value} disabled={disabled}>
      <SelectTrigger className="w-full md:w-[220px]">
        <SelectValue placeholder="Select Tuning" />
      </SelectTrigger>
      <SelectContent>
        {TUNINGS.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
