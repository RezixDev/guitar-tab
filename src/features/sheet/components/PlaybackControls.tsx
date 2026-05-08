import { Pause, Play, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@shared/ui/Button";
import { Label } from "@shared/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/Select";
import { durations } from "../data/music";

type PlaybackControlsProps = {
  isPlaying: boolean;
  notesLength: number;
  selectedDuration: string;
  onPlay: () => void;
  onClear: () => void;
  onDeleteLast: () => void;
  onDurationChange: (duration: string) => void;
};

export function PlaybackControls({
  isPlaying,
  notesLength,
  selectedDuration,
  onPlay,
  onClear,
  onDeleteLast,
  onDurationChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex gap-2">
        <Button
          onClick={onPlay}
          variant={isPlaying ? "danger" : "primary"}
          className="gap-2"
          disabled={notesLength === 0}
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          {isPlaying ? "Stop" : "Play"}
        </Button>
        <Button onClick={onClear} variant="secondary" className="gap-2">
          <Trash2 className="size-4" />
          Clear
        </Button>
        <Button
          onClick={onDeleteLast}
          variant="outline"
          className="gap-2"
          disabled={notesLength === 0}
        >
          <RotateCcw className="size-4" />
          Undo
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="duration">Duration:</Label>
        <Select value={selectedDuration} onValueChange={onDurationChange}>
          <SelectTrigger id="duration" className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(durations).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{value.symbol}</span>
                  <span>{value.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
