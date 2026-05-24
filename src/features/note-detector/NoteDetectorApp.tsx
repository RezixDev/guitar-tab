import { useMemo, useState } from "react";
import { AlertCircle, Ear, Mic, MicOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Progress } from "@shared/ui/Progress";
import { Slider } from "@shared/ui/Slider";
import { cn } from "@shared/lib/cn";
import { useAudioContext } from "@features/tuner/hooks/useAudioContext";
import { usePitchDetector } from "@features/tuner/hooks/usePitchDetector";
import {
  centsToAccuracy,
  frequencyToNote,
  statusFromCents,
  type TuningStatus,
} from "./lib/chromatic";

const DEFAULT_SENSITIVITY = 7;
// Open low-E on a guitar in standard tuning is ~82 Hz; drop tunings reach ~73 Hz.
// The high E at the 22nd fret is ~1318 Hz. Add headroom either side.
const MIN_FREQUENCY = 65;
const MAX_FREQUENCY = 1400;

const STATUS_STYLES: Record<TuningStatus, string> = {
  "in-tune":
    "bg-[color-mix(in_oklab,var(--color-success),transparent_85%)] text-[var(--color-success)]",
  flat: "bg-[color-mix(in_oklab,#3b82f6,transparent_85%)] text-[#3b82f6]",
  sharp:
    "bg-[color-mix(in_oklab,var(--color-danger),transparent_85%)] text-[var(--color-danger)]",
};

export default function NoteDetectorApp() {
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);
  const { ensureAudioContext } = useAudioContext();
  const detector = usePitchDetector({
    ensureAudioContext,
    sensitivity,
    minFrequency: MIN_FREQUENCY,
    maxFrequency: MAX_FREQUENCY,
  });

  const note = useMemo(
    () => (detector.frequency != null ? frequencyToNote(detector.frequency) : null),
    [detector.frequency],
  );

  const status = note ? statusFromCents(note.cents) : null;
  const accuracy = note ? centsToAccuracy(note.cents) : 50;

  const toggleMicrophone = () =>
    detector.isActive ? detector.stop() : detector.start();

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="mb-2 flex items-center gap-2">
        <Ear className="size-8" />
        <h1 className="text-4xl font-bold tracking-tight">Live Note Detector</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Ear className="size-5" />
              Listening
            </div>
            <Button
              variant={detector.isActive ? "primary" : "outline"}
              size="sm"
              onClick={toggleMicrophone}
              className="w-full gap-2 sm:w-auto"
            >
              {detector.isActive ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
              {detector.isActive ? "Stop" : "Start"} Listening
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {detector.error && (
            <Alert variant="danger" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{detector.error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg bg-[var(--color-bg-elevated)] p-6">
            <div className="space-y-4 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-7xl font-bold tracking-tight sm:text-8xl">
                  {note?.note ?? "--"}
                </span>
                {note && (
                  <span className="text-3xl font-semibold text-[var(--color-fg-muted)] sm:text-4xl">
                    {note.octave}
                  </span>
                )}
              </div>

              <div className="text-base text-[var(--color-fg-muted)] sm:text-lg">
                {detector.frequency != null
                  ? `${detector.frequency.toFixed(1)} Hz`
                  : detector.isActive
                    ? detector.signalLevel < 5
                      ? "Listening… (no signal)"
                      : "Listening…"
                    : "Press start and play a note"}
              </div>

              {status && note && (
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "mx-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
                    STATUS_STYLES[status],
                  )}
                >
                  <span className="capitalize">{status}</span>
                  <span>
                    {note.cents >= 0 ? "+" : ""}
                    {note.cents.toFixed(1)}¢
                  </span>
                </div>
              )}

              {note && (
                <div className="mt-4 space-y-2">
                  <Progress
                    value={accuracy}
                    className="h-2"
                    aria-label="Pitch accuracy"
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
                    Target: {note.targetFrequency.toFixed(1)} Hz
                  </div>
                </div>
              )}

              {detector.isActive && (
                <div className="mx-auto max-w-xs space-y-1 pt-2">
                  <div
                    className="flex items-center justify-between text-xs text-[var(--color-fg-muted)]"
                    aria-hidden="true"
                  >
                    <span>Input level</span>
                    <span>{detector.signalLevel}%</span>
                  </div>
                  <Progress
                    value={detector.signalLevel}
                    className="h-1.5"
                    aria-label="Microphone input level"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Mic
              className="size-4 text-[var(--color-fg-muted)]"
              aria-hidden="true"
            />
            <Slider
              value={[sensitivity]}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => setSensitivity(v[0])}
              className="w-full"
              aria-label="Microphone sensitivity"
            />
            <span className="w-16 shrink-0 text-right text-xs text-[var(--color-fg-muted)]">
              Sens. {sensitivity}/10
            </span>
          </div>

          <p className="mt-6 text-center text-xs text-[var(--color-fg-muted)] sm:text-sm">
            Play a single note on your guitar to see its pitch live. Polyphonic
            (full-chord) detection is coming next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
