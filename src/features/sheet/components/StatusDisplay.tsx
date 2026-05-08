import type { SheetNote } from "@shared/types/sheet";
import { Badge } from "@shared/ui/Badge";
import { calculateTotalDuration } from "../utils/noteUtils";

type StatusDisplayProps = {
  notes: SheetNote[];
  playbackStartIndex: number;
};

export function StatusDisplay({ notes, playbackStartIndex }: StatusDisplayProps) {
  const totalDuration = calculateTotalDuration(notes);

  return (
    <div className="mt-4 flex items-center justify-between">
      <Badge variant="outline" className="text-sm">
        {notes.length} note{notes.length !== 1 ? "s" : ""} in composition
      </Badge>
      {notes.length > 0 && (
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            Total duration: {totalDuration} beats
          </Badge>
          {playbackStartIndex > 0 && (
            <Badge variant="outline" className="text-sm text-[var(--color-success)]">
              Playing from note {playbackStartIndex + 1}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
