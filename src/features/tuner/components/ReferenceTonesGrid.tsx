import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui/Button";
import type { TunerNote } from "../types";

type ReferenceTonesGridProps = {
  notes: TunerNote[];
  selectedNote: TunerNote | null;
  detectedNote: TunerNote | null;
  onToggle: (note: TunerNote) => void;
};

export function ReferenceTonesGrid({
  notes,
  selectedNote,
  detectedNote,
  onToggle,
}: ReferenceTonesGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {notes.map((note) => {
        const isSelected = selectedNote?.note === note.note;
        const isDetected = detectedNote?.note === note.note && !selectedNote;
        return (
          <div key={note.string} className="flex flex-col items-center">
            <Button
              variant={isSelected ? "primary" : "outline"}
              size="lg"
              className={cn(
                "aspect-square w-full text-lg font-bold transition-all",
                isDetected &&
                  "ring-4 ring-[color-mix(in_oklab,var(--color-success),transparent_70%)]",
              )}
              onClick={() => onToggle(note)}
              aria-label={`Play reference note ${note.note}`}
              aria-pressed={isSelected}
            >
              {note.note}
            </Button>
            <span className="mt-1 text-xs text-[var(--color-fg-muted)] sm:text-sm">
              String {note.string}
            </span>
          </div>
        );
      })}
    </div>
  );
}
