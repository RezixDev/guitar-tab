import { Separator } from "@shared/ui/Separator";
import { PlaybackControls } from "./PlaybackControls";
import { StartPointControls } from "./StartPointControls";
import { TempoControl } from "./TempoControl";
import { VolumeControl } from "./VolumeControl";

type ControlsProps = {
  isPlaying: boolean;
  notesLength: number;
  selectedDuration: string;
  tempo: number;
  volume: number[];
  playbackStartIndex: number;
  onPlay: () => void;
  onClear: () => void;
  onDeleteLast: () => void;
  onDurationChange: (duration: string) => void;
  onTempoChange: (tempo: number) => void;
  onVolumeChange: (volume: number[]) => void;
  onMoveStartPoint: (direction: "prev" | "next") => void;
  onResetStartPoint: () => void;
};

export function Controls(props: ControlsProps) {
  return (
    <div className="space-y-4">
      <PlaybackControls
        isPlaying={props.isPlaying}
        notesLength={props.notesLength}
        selectedDuration={props.selectedDuration}
        onPlay={props.onPlay}
        onClear={props.onClear}
        onDeleteLast={props.onDeleteLast}
        onDurationChange={props.onDurationChange}
      />

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-6">
        <StartPointControls
          notesLength={props.notesLength}
          playbackStartIndex={props.playbackStartIndex}
          onMoveStartPoint={props.onMoveStartPoint}
          onResetStartPoint={props.onResetStartPoint}
        />
        <TempoControl tempo={props.tempo} onTempoChange={props.onTempoChange} />
        <VolumeControl volume={props.volume} onVolumeChange={props.onVolumeChange} />
      </div>
    </div>
  );
}
