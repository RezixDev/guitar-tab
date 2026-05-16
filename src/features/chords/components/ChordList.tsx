import type { ChordPreset } from "@shared/types/chord";
import { Button } from "@shared/ui/Button";
import { getDisplayName } from "../lib/voicingEngine";

type ChordListProps = {
  presets: ChordPreset[];
  onPresetSelect: (preset: ChordPreset) => void;
};

export function ChordList({ presets, onPresetSelect }: ChordListProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {presets.map((preset) => (
        <Button
          key={preset.id}
          variant="outline"
          onClick={() => onPresetSelect(preset)}
          className="w-full justify-start"
        >
          {getDisplayName(preset.definition)}
        </Button>
      ))}
    </div>
  );
}
