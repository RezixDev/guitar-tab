import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/ui/Select";
import { POINTS_OPTIONS, type Points } from "@shared/types/fretboard";

type PointsSelectorProps = {
  value: Points;
  onChange: (value: Points) => void;
  disabled?: boolean;
};

export function PointsSelector({ value, onChange, disabled = false }: PointsSelectorProps) {
  return (
    <Select
      value={`${value}`}
      onValueChange={(v) => onChange(Number(v) as Points)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full md:w-[180px]">
        <SelectValue placeholder="Target Points" />
      </SelectTrigger>
      <SelectContent>
        {POINTS_OPTIONS.map((points) => (
          <SelectItem key={points} value={`${points}`}>
            {points} points
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
