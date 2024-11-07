import type { Chord, Note } from './types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface ChordDetailsProps {
  chord: Chord;
  onNameChange: (value: string) => void;
  onStartingFretChange: (value: string) => void;
  onNoteChange: (index: number, field: keyof Note, value: string) => void;
}

export function ChordDetails({
  chord,
  onNameChange,
  onStartingFretChange,
  onNoteChange,
}: ChordDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={chord.startingFret}
            onChange={(e) => onStartingFretChange(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">String Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chord.notes.map((note, index) => (
            <Card key={`string-${index}`}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`string-${6-index}-fret`}>
                      String {6-index} Fret
                    </Label>
                    <Input
                      type="number"
                      id={`string-${6-index}-fret`}
                      value={note.fret}
                      onChange={(e) => onNoteChange(index, 'fret', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`string-${6-index}-finger`}>
                      String {6-index} Finger
                    </Label>
                    <Input
                      type="number"
                      id={`string-${6-index}-finger`}
                      value={note.finger}
                      onChange={(e) => onNoteChange(index, 'finger', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}