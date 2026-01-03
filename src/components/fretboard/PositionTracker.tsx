import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getAllNotePositions } from "@/utils/noteUtils"
import type { Note, Tuning } from "@/utils/noteUtils"
import { useMemo } from "react"

type PositionTrackerProps = {
  currentNote: Note
  tuning: Tuning
  foundPositions: ReadonlySet<string>
  showNext: boolean
}

export function PositionTracker({
  currentNote,
  tuning,
  foundPositions,
  showNext,
}: PositionTrackerProps) {
  const stats = useMemo(() => {
    if (!currentNote) {
      return { total: 0, found: 0, remaining: 0, progress: 0 }
    }

    const all = getAllNotePositions(currentNote.note, tuning)
    const unique = new Set(all.map((p) => `${p.string}-${p.fret}`))

    const total = unique.size
    const found = foundPositions.size
    const remaining = Math.max(0, total - found)
    const progress = total > 0 ? (found / total) * 100 : 0

    return { total, found, remaining, progress }
  }, [currentNote, tuning, foundPositions])

  return (
    <Card className="mb-4 p-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Positions Found: {stats.found} / {stats.total}
          </span>
          {stats.remaining > 0 && (
            <span className="text-muted-foreground">
              {stats.remaining} position{stats.remaining !== 1 ? "s" : ""} remaining
            </span>
          )}
        </div>
        <Progress value={stats.progress} className="h-2" />

        {showNext && stats.remaining === 0 && (
          <div className="mt-2 text-center text-sm font-medium text-green-600">
            All positions found! Press Enter or click Next Note to continue
          </div>
        )}
      </div>
    </Card>
  )
}
