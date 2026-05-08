import { Clock } from "lucide-react";
import { Badge } from "@shared/ui/Badge";
import { Label } from "@shared/ui/Label";
import { Slider } from "@shared/ui/Slider";

type TempoControlProps = {
  tempo: number;
  onTempoChange: (value: number) => void;
};

export function TempoControl({ tempo, onTempoChange }: TempoControlProps) {
  return (
    <div className="flex items-center gap-3">
      <Label className="flex items-center gap-1">
        <Clock className="size-4" />
        Tempo:
      </Label>
      <div className="flex items-center gap-2">
        <Slider
          value={[tempo]}
          onValueChange={(v) => onTempoChange(v[0])}
          min={60}
          max={180}
          step={5}
          className="w-24"
        />
        <Badge variant="secondary" className="min-w-[4rem] justify-center">
          {tempo} BPM
        </Badge>
      </div>
    </div>
  );
}
