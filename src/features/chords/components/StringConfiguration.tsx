import { useState, type MouseEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Chord, ChordNote } from "@shared/types/chord";
import { Input } from "@shared/ui/Input";
import { Card, CardContent } from "@shared/ui/Card";
import { Button } from "@shared/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/Tooltip";

const STRINGS = ["e", "B", "G", "D", "A", "E"] as const;
const FRETS_IN_WINDOW = 8;
const MAX_FRET = 24;
const FINGER_OPTIONS = [1, 2, 3, 4] as const;

type StringConfigurationProps = {
  chord: Chord;
  onNoteChange: (index: number, field: keyof ChordNote, value: string) => void;
};

export function StringConfiguration({ chord, onNoteChange }: StringConfigurationProps) {
  const [activeFinger, setActiveFinger] = useState(1);
  const [lastActiveString, setLastActiveString] = useState<number | null>(null);
  const [windowStart, setWindowStart] = useState(0);

  const handleFingerChange = (finger: number) => {
    setActiveFinger(finger);
    if (lastActiveString !== null) {
      const note = chord.notes[lastActiveString];
      if (note.fret !== null && note.fret > 0) {
        onNoteChange(lastActiveString, "finger", finger.toString());
      }
    }
  };

  const handleFretClick = (stringIndex: number, event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativePosition = Math.round(
      ((event.clientX - rect.left) / rect.width) * (FRETS_IN_WINDOW - 1),
    );
    const absoluteFret = windowStart + relativePosition;
    onNoteChange(stringIndex, "fret", absoluteFret.toString());
    onNoteChange(stringIndex, "finger", activeFinger.toString());
    setLastActiveString(stringIndex);
  };

  const handleTouchMove = (stringIndex: number, event: TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const relativePosition = Math.round(
      ((touch.clientX - rect.left) / rect.width) * (FRETS_IN_WINDOW - 1),
    );
    const absoluteFret = windowStart + relativePosition;
    if (absoluteFret >= 0 && absoluteFret <= MAX_FRET) {
      onNoteChange(stringIndex, "fret", absoluteFret.toString());
      onNoteChange(stringIndex, "finger", activeFinger.toString());
      setLastActiveString(stringIndex);
    }
  };

  const shiftWindow = (direction: "left" | "right") => {
    const shift = direction === "left" ? -FRETS_IN_WINDOW : FRETS_IN_WINDOW;
    const newStart = Math.max(0, Math.min(MAX_FRET - FRETS_IN_WINDOW, windowStart + shift));
    setWindowStart(newStart);
  };

  const getPositionInWindow = (fret: number | null): number => {
    if (fret === null || fret < windowStart || fret > windowStart + FRETS_IN_WINDOW) return -1;
    return ((fret - windowStart) / (FRETS_IN_WINDOW - 1)) * 100;
  };

  const handleMute = (index: number) => {
    onNoteChange(index, "fret", "");
    onNoteChange(index, "finger", "");
    setLastActiveString(index);
  };

  const handleOpen = (index: number) => {
    onNoteChange(index, "fret", "0");
    onNoteChange(index, "finger", "");
    setLastActiveString(index);
  };

  const handleFretInputChange = (index: number, value: string) => {
    onNoteChange(index, "fret", value);
    if (value !== "" && parseInt(value, 10) > 0) {
      onNoteChange(index, "finger", activeFinger.toString());
    }
    if (value === "" || value === "0") {
      onNoteChange(index, "finger", "");
    }
    setLastActiveString(index);
  };

  const isStringActive = (index: number) => lastActiveString === index;
  const isFretInWindow = (fret: number | null) =>
    fret !== null && fret >= windowStart && fret < windowStart + FRETS_IN_WINDOW;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">String Configuration</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-fg-muted)]">Finger:</span>
            <div className="flex gap-1">
              {FINGER_OPTIONS.map((finger) => (
                <button
                  key={finger}
                  type="button"
                  onClick={() => handleFingerChange(finger)}
                  className={
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium transition " +
                    (activeFinger === finger
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-accent-soft)]")
                  }
                >
                  {finger}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-6">
          <CardContent className="p-0">
            <div className="mb-4 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => shiftWindow("left")}
                disabled={windowStart === 0}
                aria-label="Previous frets"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-medium">
                Frets {windowStart} - {windowStart + FRETS_IN_WINDOW - 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => shiftWindow("right")}
                disabled={windowStart >= MAX_FRET - FRETS_IN_WINDOW}
                aria-label="Next frets"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-8">
              {chord.notes.map((note, index) => (
                <div
                  key={index}
                  className={
                    "flex items-center gap-4 rounded-lg p-2 transition " +
                    (isStringActive(index) ? "bg-[var(--color-accent-soft)]" : "")
                  }
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={
                          "flex size-8 items-center justify-center rounded-full font-semibold transition " +
                          (isStringActive(index)
                            ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                            : "bg-[var(--color-bg-elevated)] text-[var(--color-fg)]")
                        }
                      >
                        {STRINGS[index]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      String {6 - index} ({STRINGS[index]})
                    </TooltipContent>
                  </Tooltip>

                  <div className="relative h-12 flex-1">
                    <div
                      className="absolute top-1/2 h-8 w-full -translate-y-1/2 cursor-pointer"
                      onClick={(e) => handleFretClick(index, e)}
                      onTouchMove={(e) => handleTouchMove(index, e)}
                      onTouchStart={(e) => e.preventDefault()}
                    >
                      <div className="h-1 w-full bg-[var(--color-border)]">
                        {Array.from({ length: FRETS_IN_WINDOW }, (_, i) => (
                          <div
                            key={i}
                            className="absolute h-3 w-0.5 bg-[var(--color-border-strong)]"
                            style={{ left: `${(i / (FRETS_IN_WINDOW - 1)) * 100}%` }}
                          >
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[var(--color-fg-muted)]">
                              {windowStart + i}
                            </span>
                          </div>
                        ))}
                      </div>

                      {isFretInWindow(note.fret) && (
                        <div
                          className="absolute top-1/2 size-6 rounded-full bg-[var(--color-accent)] shadow-lg"
                          style={{
                            left: `${getPositionInWindow(note.fret)}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <span className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-accent-fg)]">
                            {note.finger?.toString() || activeFinger}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative">
                          <Input
                            type="number"
                            value={note.fret ?? ""}
                            onChange={(e) => handleFretInputChange(index, e.target.value)}
                            onFocus={() => setLastActiveString(index)}
                            className={
                              "w-16 text-center " + (note.fret === null ? "opacity-60" : "")
                            }
                            min={0}
                            max={MAX_FRET}
                            placeholder="-"
                            aria-label={`Fret for string ${STRINGS[index]}`}
                          />
                          {note.fret === null && (
                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold">
                              X
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Fret number</TooltipContent>
                    </Tooltip>

                    <button
                      type="button"
                      aria-label={`Mute string ${STRINGS[index]}`}
                      onClick={() => handleMute(index)}
                      className={
                        "flex size-8 items-center justify-center rounded-md border text-sm font-semibold transition " +
                        (note.fret === null
                          ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-accent-soft)]")
                      }
                    >
                      X
                    </button>

                    <button
                      type="button"
                      aria-label={`Open string ${STRINGS[index]}`}
                      onClick={() => handleOpen(index)}
                      className={
                        "flex size-8 items-center justify-center rounded-md border text-sm font-semibold transition " +
                        (note.fret === 0
                          ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                          : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:bg-[var(--color-accent-soft)]")
                      }
                    >
                      O
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
