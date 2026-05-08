import { useState } from "react";
import { Music2 } from "lucide-react";
import { NOTES } from "@shared/types/music";
import {
  calculateNote,
  getAllNotePositions,
  getScaleNotes,
  standardTuning,
} from "@shared/music/notes";
import type { NotePosition, Tuning } from "@shared/types/music";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import { FretboardScales } from "./components/FretboardScales";
import { SCALES, SCALE_NAMES, type ScaleName } from "./data/scales";

type ScalesAppProps = {
  tuning?: Tuning;
  width?: number;
  height?: number;
};

export default function ScalesApp({
  tuning = standardTuning,
  width = 900,
  height = 300,
}: ScalesAppProps) {
  const [_guessedPositions, setGuessedPositions] = useState<NotePosition[]>([]);
  const [selectedScale, setSelectedScale] = useState<ScaleName>("Major");
  const [groundNote, setGroundNote] = useState<string>("C");

  const handleFretClick = (visualString: number, fret: number) => {
    const clicked: NotePosition = {
      string: visualString,
      fret,
      note: calculateNote(visualString, fret, tuning),
    };
    setGuessedPositions((prev) => [...prev, clicked]);
  };

  const handleScaleChange = (scale: ScaleName) => {
    setSelectedScale(scale);
    setGuessedPositions([]);
  };

  const handleGroundNoteChange = (note: string) => {
    setGroundNote(note);
    setGuessedPositions([]);
  };

  const scaleIntervals = SCALES[selectedScale];
  const scaleNotes = getScaleNotes(groundNote, [...scaleIntervals]);
  const scalePositions = scaleNotes.flatMap((note) => getAllNotePositions(note, tuning));

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <header className="text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Scale Viewer</h1>
        <p className="text-lg text-[var(--color-fg-muted)]">
          Explore guitar scales and improve your playing
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Music2 className="size-6" />
            Scale Selector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Select Scale</h2>
              <div className="flex flex-wrap gap-2">
                {SCALE_NAMES.map((scale) => (
                  <Button
                    key={scale}
                    size="sm"
                    variant={selectedScale === scale ? "primary" : "outline"}
                    onClick={() => handleScaleChange(scale)}
                  >
                    {scale}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Select Root Note</h2>
              <div className="flex flex-wrap gap-2">
                {NOTES.map((note) => (
                  <Button
                    key={note}
                    size="sm"
                    variant={groundNote === note ? "primary" : "outline"}
                    className="size-10 p-0"
                    onClick={() => handleGroundNoteChange(note)}
                  >
                    {note}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] p-4">
            <FretboardScales
              tuning={tuning}
              width={width}
              height={height}
              onFretClick={handleFretClick}
              chordPositions={scalePositions}
              easyMode
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
