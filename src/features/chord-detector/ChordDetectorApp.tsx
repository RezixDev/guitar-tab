import { useMemo, useState } from "react";
import { AlertCircle, Mic, MicOff, Music } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Progress } from "@shared/ui/Progress";
import { Slider } from "@shared/ui/Slider";
import { useAudioContext } from "@features/tuner/hooks/useAudioContext";
import { useChordDetector } from "./hooks/useChordDetector";
import { ChromagramBars } from "./components/ChromagramBars";
import { PITCH_CLASS_NAMES } from "./lib/chromagram";
import { topPitchClasses } from "./lib/chords";

const DEFAULT_SENSITIVITY = 7;

export default function ChordDetectorApp() {
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);
  const { ensureAudioContext } = useAudioContext();
  const detector = useChordDetector({ ensureAudioContext, sensitivity });

  // Top three pitch classes for the "Detected notes" readout. Recomputed each
  // render — the chroma array reference is stable but contents change every
  // frame, and the parent re-renders on every setState from the hook.
  const top3 = useMemo(
    () => (detector.isActive ? topPitchClasses(detector.chroma, 3) : []),
    [detector.chroma, detector.isActive, detector.chord],
  );

  const toggle = () => (detector.isActive ? detector.stop() : detector.start());
  const confidencePct = detector.chord
    ? Math.round(detector.chord.confidence * 100)
    : 0;

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <header className="mb-2 flex items-center gap-2">
        <Music className="size-8" />
        <h1 className="text-4xl font-bold tracking-tight">
          Live Chord Detector
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Music className="size-5" />
              Listening
            </div>
            <Button
              variant={detector.isActive ? "primary" : "outline"}
              size="sm"
              onClick={toggle}
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
              <div className="text-6xl font-bold tracking-tight sm:text-8xl">
                {detector.chord?.name ?? "--"}
              </div>

              <div className="text-base text-[var(--color-fg-muted)] sm:text-lg">
                {detector.isActive
                  ? detector.signalLevel < 5
                    ? "Listening… (no signal)"
                    : detector.chord
                      ? "Detected"
                      : "Strum a chord…"
                  : "Press start and strum a chord"}
              </div>

              {detector.chord && (
                <div className="mx-auto max-w-xs space-y-1">
                  <div
                    className="flex items-center justify-between text-xs text-[var(--color-fg-muted)]"
                    aria-hidden="true"
                  >
                    <span>Confidence</span>
                    <span>{confidencePct}%</span>
                  </div>
                  <Progress
                    value={confidencePct}
                    className="h-1.5"
                    aria-label="Chord match confidence"
                  />
                </div>
              )}

              {detector.isActive && top3.length > 0 && (
                <div className="text-xs text-[var(--color-fg-muted)] sm:text-sm">
                  Strongest notes:{" "}
                  <span className="font-mono">
                    {top3.map((i) => PITCH_CLASS_NAMES[i]).join(" • ")}
                  </span>
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

          {detector.isActive && (
            <div className="mt-6">
              <ChromagramBars chroma={detector.chroma} highlight={top3} />
            </div>
          )}

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
            Strum a chord cleanly and let it ring. Detection covers major,
            minor, 7th, m7, maj7, sus, dim, and aug shapes. Polyphonic detection
            is imperfect — slash chords and extended voicings may be misread.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
