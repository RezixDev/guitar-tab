import { ArrowDown, ArrowUp, Check } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Progress } from "@shared/ui/Progress";
import type { TunerNote, TuningStatus } from "../types";

type ListeningPanelProps = {
  detectedNote: TunerNote | null;
  detectedFrequency: number | null;
  signalLevel: number;
  tuningStatus: TuningStatus;
  tuningAccuracy: number;
};

const STATUS_STYLES: Record<NonNullable<TuningStatus>, string> = {
  "in-tune":
    "bg-[color-mix(in_oklab,var(--color-success),transparent_85%)] text-[var(--color-success)]",
  flat: "bg-[color-mix(in_oklab,#3b82f6,transparent_85%)] text-[#3b82f6]",
  sharp:
    "bg-[color-mix(in_oklab,var(--color-danger),transparent_85%)] text-[var(--color-danger)]",
};

const STATUS_ICONS: Record<NonNullable<TuningStatus>, React.ReactNode> = {
  "in-tune": <Check className="size-5" />,
  flat: <ArrowDown className="size-5" />,
  sharp: <ArrowUp className="size-5" />,
};

export function ListeningPanel({
  detectedNote,
  detectedFrequency,
  signalLevel,
  tuningStatus,
  tuningAccuracy,
}: ListeningPanelProps) {
  const subtitle = detectedFrequency
    ? `${detectedFrequency.toFixed(1)} Hz`
    : signalLevel < 5
      ? "Listening… (no signal)"
      : "Listening…";

  return (
    <div className="rounded-lg bg-[var(--color-bg-elevated)] p-4 sm:p-6">
      <div className="space-y-4 text-center">
        <div className="mb-2 text-3xl font-bold sm:text-4xl">
          {detectedNote?.note || "--"}
        </div>
        <div className="text-base text-[var(--color-fg-muted)] sm:text-lg">
          {subtitle}
        </div>

        <div className="mx-auto max-w-xs space-y-1">
          <div
            className="flex items-center justify-between text-xs text-[var(--color-fg-muted)]"
            aria-hidden="true"
          >
            <span>Input level</span>
            <span>{signalLevel}%</span>
          </div>
          <Progress
            value={signalLevel}
            className="h-1.5"
            aria-label="Microphone input level"
          />
        </div>

        {tuningStatus && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium",
              STATUS_STYLES[tuningStatus],
            )}
          >
            {STATUS_ICONS[tuningStatus]}
            <span className="capitalize">{tuningStatus}</span>
          </div>
        )}

        {detectedNote && (
          <div className="mt-4 space-y-2">
            <Progress
              value={tuningAccuracy}
              className="h-2"
              aria-label="Tuning accuracy"
            />
            <div
              className="flex justify-between text-xs text-[var(--color-fg-muted)]"
              aria-hidden="true"
            >
              <span>♭ Flat</span>
              <span>In Tune</span>
              <span>Sharp ♯</span>
            </div>
            <div className="text-xs text-[var(--color-fg-muted)] sm:text-sm">
              String {detectedNote.string} • Target:{" "}
              {detectedNote.frequency.toFixed(1)} Hz
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
