import type { Chord, ChordNote } from "@shared/types/chord";
import { Input } from "@shared/ui/Input";
import { Label } from "@shared/ui/Label";
import { Separator } from "@shared/ui/Separator";
import { StringConfiguration } from "./StringConfiguration";
import { ThemeSelector } from "./ThemeSelector";

type ChordDetailsProps = {
  chord: Chord;
  startingFret: number;
  onNameChange: (value: string) => void;
  onStartingFretChange: (value: number) => void;
  onNoteChange: (index: number, field: keyof ChordNote, value: string) => void;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
};

export function ChordDetails({
  chord,
  startingFret,
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
            min={0}
            max={22}
            value={startingFret}
            onChange={(e) => {
              const val = Number(e.target.value);
              const clamped = Math.min(22, Math.max(0, val));
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
