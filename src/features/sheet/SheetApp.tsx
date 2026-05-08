import { Music } from "lucide-react";
import { Card, CardContent, CardHeader } from "@shared/ui/Card";
import { Controls } from "./components/Controls";
import { Instructions } from "./components/Instructions";
import { StaffCanvas } from "./components/StaffCanvas";
import { StatusDisplay } from "./components/StatusDisplay";
import { useMusicComposer } from "./hooks/useMusicComposer";

export default function SheetApp() {
  const {
    notes,
    isPlaying,
    currentNoteIndex,
    selectedDuration,
    tempo,
    volume,
    playbackStartIndex,
    playheadPosition,
    handleCanvasClick,
    playNotes,
    clearNotes,
    deleteLastNote,
    moveStartPoint,
    resetStartPoint,
    setSelectedDuration,
    setTempo,
    setVolume,
  } = useMusicComposer();

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tight">
          <Music className="size-8 text-[var(--color-accent)]" />
          Sheet Music Composer
        </h1>
        <p className="text-[var(--color-fg-muted)]">
          Click to add notes • Shift+Click to set start point
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <Controls
            isPlaying={isPlaying}
            notesLength={notes.length}
            selectedDuration={selectedDuration}
            tempo={tempo}
            volume={volume}
            playbackStartIndex={playbackStartIndex}
            onPlay={playNotes}
            onClear={clearNotes}
            onDeleteLast={deleteLastNote}
            onDurationChange={setSelectedDuration}
            onTempoChange={setTempo}
            onVolumeChange={setVolume}
            onMoveStartPoint={moveStartPoint}
            onResetStartPoint={resetStartPoint}
          />
        </CardHeader>

        <CardContent className="p-6">
          <StaffCanvas
            notes={notes}
            currentNoteIndex={currentNoteIndex}
            playheadPosition={playheadPosition}
            playbackStartIndex={playbackStartIndex}
            tempo={tempo}
            onCanvasClick={handleCanvasClick}
          />
          <StatusDisplay notes={notes} playbackStartIndex={playbackStartIndex} />
        </CardContent>
      </Card>

      <Instructions />
    </div>
  );
}
