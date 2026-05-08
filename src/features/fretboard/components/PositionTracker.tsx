import { useMemo } from "react";
import type { Note, Tuning } from "@shared/types/music";
import { getAllNotePositions } from "@shared/music/notes";
import { Card } from "@shared/ui/Card";
import { Progress } from "@shared/ui/Progress";

type PositionTrackerProps = {
  currentNote: Note;
  tuning: Tuning;
  foundPositions: ReadonlySet<string>;
  showNext: boolean;
  translations: {
    found: string;
    remaining: (count: number) => string;
    allFound: string;
  };
};

export function PositionTracker({
  currentNote,
  tuning,
  foundPositions,
  showNext,
  translations,
}: PositionTrackerProps) {
  const stats = useMemo(() => {
    if (!currentNote) {
      return { total: 0, found: 0, remaining: 0, progress: 0 };
    }
    const all = getAllNotePositions(currentNote.note, tuning);
    const unique = new Set(all.map((p) => `${p.string}-${p.fret}`));
    const total = unique.size;
    const found = foundPositions.size;
    const remaining = Math.max(0, total - found);
    const progress = total > 0 ? (found / total) * 100 : 0;
    return { total, found, remaining, progress };
  }, [currentNote, tuning, foundPositions]);

  return (
    <Card className="mb-4 p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            {translations.found}: {stats.found} / {stats.total}
          </span>
          {stats.remaining > 0 && (
            <span className="text-[var(--color-fg-muted)]">
              {translations.remaining(stats.remaining)}
            </span>
          )}
        </div>
        <Progress value={stats.progress} className="h-2" />

        {showNext && stats.remaining === 0 && (
          <div className="mt-2 text-center text-sm font-medium text-[var(--color-success,#16a34a)]">
            {translations.allFound}
          </div>
        )}
      </div>
    </Card>
  );
}
