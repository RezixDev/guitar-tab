import type { Chord, ChordNote } from "@shared/types/chord";
import { Input } from "@shared/ui/Input";
import { Label } from "@shared/ui/Label";
import { Separator } from "@shared/ui/Separator";
import { StringConfiguration } from "./StringConfiguration";
import { ThemeSelector } from "./ThemeSelector";

type ChordDetailsProps = {
  chord: Chord;
  onNameChange: (value: string) => void;
  onStartingFretChange: (value: number) => void;
  onNoteChange: (index: number, field: keyof ChordNote, value: string) => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
};

export function ChordDetails({
  chord,
  onNameChange,
  onStartingFretChange,
  onNoteChange,
  selectedTheme,
  onThemeChange,
}: ChordDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="chord-name">Chord Name</Label>
          <Input
            id="chord-name"
            value={chord.name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="starting-fret">Starting Fret</Label>
          <Input
            type="number"
            id="starting-fret"
            min={1}
            max={27}
            value={chord.startingFret}
            onChange={(e) => {
              const val = Number(e.target.value);
              const clamped = Math.min(27, Math.max(1, val));
              onStartingFretChange(clamped);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chord-theme">Diagram Style</Label>
          <ThemeSelector
            currentTheme={selectedTheme}
            onThemeChange={onThemeChange}
            variant="select"
          />
        </div>
      </div>
      <Separator />
      <StringConfiguration chord={chord} onNoteChange={onNoteChange} />
    </div>
  );
}
