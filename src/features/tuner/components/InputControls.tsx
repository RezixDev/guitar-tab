import { Mic, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@shared/ui/Slider";

type InputControlsProps = {
  volume: number;
  onVolumeChange: (value: number) => void;
  sensitivity: number;
  onSensitivityChange: (value: number) => void;
};

export function InputControls({
  volume,
  onVolumeChange,
  sensitivity,
  onSensitivityChange,
}: InputControlsProps) {
  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <VolumeX className="size-4 text-[var(--color-fg-muted)]" aria-hidden="true" />
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(v) => onVolumeChange(v[0])}
          className="w-full"
          aria-label="Volume"
        />
        <Volume2 className="size-4 text-[var(--color-fg-muted)]" aria-hidden="true" />
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Mic className="size-4 text-[var(--color-fg-muted)]" aria-hidden="true" />
        <Slider
          value={[sensitivity]}
          min={1}
          max={10}
          step={1}
          onValueChange={(v) => onSensitivityChange(v[0])}
          className="w-full"
          aria-label="Microphone sensitivity"
        />
        <span className="w-16 shrink-0 text-right text-xs text-[var(--color-fg-muted)]">
          Sens. {sensitivity}/10
        </span>
      </div>
    </>
  );
}
