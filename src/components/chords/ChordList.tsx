import type { Chord } from './types';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChordListProps {
  title: string;
  chords: Chord[];
  onChordSelect: (chord: Chord) => void;
}

export function ChordList({ chords, onChordSelect }: ChordListProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {chords.map((chord, index) => (
        <Button
          key={`${chord.name}-${index}`}
          variant="outline"
          onClick={() => onChordSelect(chord)}
          className="w-full justify-start"
        >
          {chord.name}
        </Button>
      ))}
    </div>
  );
}
