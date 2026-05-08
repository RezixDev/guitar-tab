import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { calculateNote } from "@shared/music/notes";
import { Fretboard, FretboardMarker } from "@shared/music/Fretboard";
import {
  FRET_COUNT,
  HIGH_CONTRAST_COLORS,
  NORMAL_COLORS,
  STRING_COUNT,
  clamp,
} from "@shared/music/fretboardConstants";
import type { Note, NotePosition, Tuning } from "@shared/types/music";

type FretboardSVGProps = {
  tuning: Tuning;
  width: number;
  height: number;
  onFretClick: (stringIndex: number, fretIndex: number) => void;
  showNext: boolean;
  currentNote: Note;
  guessedPositions: NotePosition[];
  highContrast?: boolean;
  isFlipped: boolean;
  isNewbieMode: boolean;
  isEasyMode: boolean;
};

type Cell = {
  string: number;
  fret: number;
  note: string;
  fill: string;
  label?: string;
};

export function FretboardSVG({
  tuning,
  width,
  height,
  onFretClick,
  showNext,
  currentNote,
  guessedPositions,
  highContrast = false,
  isFlipped,
  isNewbieMode,
  isEasyMode,
}: FretboardSVGProps) {
  const [focused, setFocused] = useState({ string: 0, fret: 0 });

  const noteColors = useMemo(
    () => (highContrast ? HIGH_CONTRAST_COLORS : NORMAL_COLORS),
    [highContrast],
  );

  // 12 × 6 grid of clickable cells. Re-derived only when inputs change.
  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    for (let s = 0; s < STRING_COUNT; s++) {
      for (let f = 1; f <= FRET_COUNT; f++) {
        const note = calculateNote(s, f, tuning);
        out.push({
          string: s,
          fret: f,
          note,
          fill: isNewbieMode ? (noteColors[note] ?? "transparent") : "transparent",
          label: isEasyMode ? note : undefined,
        });
      }
    }
    return out;
  }, [tuning, isNewbieMode, isEasyMode, noteColors]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<SVGSVGElement>) => {
      if (e.key === "ArrowUp") {
        setFocused((p) => ({ ...p, string: clamp(p.string - 1, 0, STRING_COUNT - 1) }));
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        setFocused((p) => ({ ...p, string: clamp(p.string + 1, 0, STRING_COUNT - 1) }));
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        setFocused((p) => ({ ...p, fret: clamp(p.fret - 1, 0, FRET_COUNT - 1) }));
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        setFocused((p) => ({ ...p, fret: clamp(p.fret + 1, 0, FRET_COUNT - 1) }));
        e.preventDefault();
      } else if (e.key === "Enter" || e.key === " ") {
        onFretClick(focused.string, focused.fret + 1);
        e.preventDefault();
      }
    },
    [focused.fret, focused.string, onFretClick],
  );

  const overlayFill = highContrast ? "#ffffff" : "var(--color-accent-soft)";

  return (
    <Fretboard
      tuning={tuning}
      width={width}
      height={height}
      flipped={isFlipped}
      highContrast={highContrast}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      ariaLabel="Guitar Fretboard"
    >
      {cells.map((c) => {
        const isFocused = focused.string === c.string && focused.fret === c.fret - 1;
        return (
          <FretboardMarker
            key={`cell-${c.string}-${c.fret}`}
            string={c.string}
            fret={c.fret}
            fill={c.fill}
            stroke={isFocused ? "var(--color-accent)" : undefined}
            strokeWidth={isFocused ? 2 : undefined}
            label={c.label}
            onClick={() => onFretClick(c.string, c.fret)}
            ariaLabel={`String ${c.string + 1}, Fret ${c.fret}, Note ${c.note}`}
          />
        );
      })}

      {showNext && (
        <FretboardMarker
          string={currentNote.string}
          fret={currentNote.fret}
          size="highlight"
          fill={overlayFill}
          stroke="currentColor"
          strokeWidth={1}
          label={currentNote.note}
          labelFill="currentColor"
        />
      )}

      {guessedPositions.map(({ string, fret }) => (
        <FretboardMarker
          key={`guessed-${string}-${fret}`}
          string={string}
          fret={fret}
          size="highlight"
          fill={overlayFill}
          stroke="currentColor"
          strokeWidth={1}
          label={calculateNote(string, fret, tuning)}
          labelFill="currentColor"
        />
      ))}
    </Fretboard>
  );
}
