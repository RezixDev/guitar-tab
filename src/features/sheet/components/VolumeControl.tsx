import { Volume2 } from "lucide-react";
import { Label } from "@shared/ui/Label";
import { Slider } from "@shared/ui/Slider";

type VolumeControlProps = {
  volume: number[];
  onVolumeChange: (value: number[]) => void;
};

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="flex items-center gap-3">
      <Label className="flex items-center gap-1">
        <Volume2 className="size-4" />
        Volume:
      </Label>
      <Slider
        value={volume}
        onValueChange={onVolumeChange}
        min={-30}
        max={0}
        step={1}
        className="w-24"
      />
    </div>
  );
}
