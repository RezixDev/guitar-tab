import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Guitar, Mic, MicOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/Alert";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { InputControls } from "./components/InputControls";
import { ListeningPanel } from "./components/ListeningPanel";
import { ReferenceTonesGrid } from "./components/ReferenceTonesGrid";
import { TuningGuide } from "./components/TuningGuide";
import { TuningSelector } from "./components/TuningSelector";
import { TUNINGS } from "./data/tunings";
import { useAudioContext } from "./hooks/useAudioContext";
import { usePitchDetector } from "./hooks/usePitchDetector";
import { useReferenceTone } from "./hooks/useReferenceTone";
import {
  accuracyFromCents,
  calculateCentsOffPitch,
  findClosestNote,
  statusFromCents,
} from "./lib/pitch";
import type { TunerNote, TuningId, TuningStatus } from "./types";

const DEFAULT_SENSITIVITY = 7;

export default function TunerApp() {
  const [tuningId, setTuningId] = useState<TuningId>("standard");
  const [sensitivity, setSensitivity] = useState(DEFAULT_SENSITIVITY);

  const activeTuning = useMemo(() => TUNINGS[tuningId].notes, [tuningId]);

  const { ensureAudioContext } = useAudioContext();
  const detector = usePitchDetector({ ensureAudioContext, sensitivity });
  const tone = useReferenceTone({ ensureAudioContext });

  // Map raw frequency from the detector to a note in the active tuning
  const { detectedNote, tuningStatus, tuningAccuracy } = useMemo<{
    detectedNote: TunerNote | null;
    tuningStatus: TuningStatus;
    tuningAccuracy: number;
  }>(() => {
    if (detector.frequency == null) {
      return { detectedNote: null, tuningStatus: null, tuningAccuracy: 50 };
    }
    const closest = findClosestNote(detector.frequency, activeTuning);
    if (!closest) {
      return { detectedNote: null, tuningStatus: null, tuningAccuracy: 50 };
    }
    const cents = calculateCentsOffPitch(detector.frequency, closest.frequency);
    return {
      detectedNote: closest,
      tuningStatus: statusFromCents(cents),
      tuningAccuracy: accuracyFromCents(cents),
    };
  }, [detector.frequency, activeTuning]);

  // When the user switches tuning, drop any note selection so we don't show a
  // stale label from the previous preset.
  useEffect(() => {
    tone.stop();
    // Only reset on tuning change — `tone.stop` is stable thanks to useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuningId]);

  const toggleMicrophone = () =>
    detector.isActive ? detector.stop() : detector.start();

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="mb-2 flex items-center gap-2">
        <Guitar className="size-8" />
        <h1 className="text-4xl font-bold tracking-tight">Guitar Tuner</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2">
                  <Guitar className="size-5" />
                  Guitar Tuner
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
                  {detector.isActive ? "Stop" : "Start"} Tuning
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

              <div className="mb-6">
                <TuningSelector value={tuningId} onChange={setTuningId} />
              </div>

              {detector.isActive && (
                <div className="mb-6">
                  <ListeningPanel
                    detectedNote={detectedNote}
                    detectedFrequency={detector.frequency}
                    signalLevel={detector.signalLevel}
                    tuningStatus={tuningStatus}
                    tuningAccuracy={tuningAccuracy}
                  />
                </div>
              )}

              <InputControls
                volume={tone.volume}
                onVolumeChange={tone.setVolume}
                sensitivity={sensitivity}
                onSensitivityChange={setSensitivity}
              />

              <ReferenceTonesGrid
                notes={activeTuning}
                selectedNote={tone.currentNote}
                detectedNote={detectedNote}
                onToggle={tone.play}
              />

              <div className="mt-6 text-center text-xs text-[var(--color-fg-muted)] sm:text-sm">
                {detector.isActive
                  ? "Play a single string to detect its pitch"
                  : "Click on a note to play/stop the reference tone"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <TuningGuide tuningLabel={TUNINGS[tuningId].label} notes={activeTuning} />
        </div>
      </div>
    </div>
  );
}
