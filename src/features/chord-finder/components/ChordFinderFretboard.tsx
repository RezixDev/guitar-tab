import { useCallback, useMemo } from "react";
import { Fretboard, FretboardMarker } from "@shared/music/Fretboard";
import { calculateNote } from "@shared/music/notes";
import {
  FRET_COUNT,
  NORMAL_COLORS,
  STRING_COUNT,
} from "@shared/music/fretboardConstants";
import type { Tuning } from "@shared/types/music";

type StringFrets = Record<number, number | null>; // null = explicit open (fret 0 handled here too)

type Props = {
  tuning: Tuning;
  /** Map of stringIndex -> selected fret (0 = open). Missing key = muted. */
  selection: Record<number, number>;
  onToggle: (stringIndex: number, fret: number) => void;
  showNoteLabels: boolean;
};

type Cell = {
  string: number;
  fret: number;
  note: string;
};

/**
 * Interactive fretboard for note placement. Clicking any cell selects that
 * fret on that string; clicking the same cell again deselects it. Each
 * string holds at most one note. Frets 1–12 are clickable inside the SVG.
 * Open strings are handled in the surrounding control panel.
 */
export function ChordFinderFretboard({
  tuning,
  selection,
  onToggle,
  showNoteLabels,
}: Props) {
  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    for (let s = 0; s < STRING_COUNT; s++) {
      for (let f = 1; f <= FRET_COUNT; f++) {
        out.push({ string: s, fret: f, note: calculateNote(s, f, tuning) });
      }
    }
    return out;
  }, [tuning]);

  const handleClick = useCallback(
    (s: number, f: number) => onToggle(s, f),
    [onToggle],
  );

  return (
    <Fretboard
      tuning={tuning}
      width={900}
      height={300}
      flipped
      role="application"
      ariaLabel="Chord finder fretboard"
    >
      {cells.map((c) => {
        const isSelected = selection[c.string] === c.fret;
        return (
          <FretboardMarker
            key={`cell-${c.string}-${c.fret}`}
            string={c.string}
            fret={c.fret}
            fill={isSelected ? "var(--color-accent)" : "transparent"}
            stroke={
              isSelected ? "var(--color-accent)" : "var(--color-border)"
            }
            strokeWidth={isSelected ? 2 : 1}
            label={showNoteLabels || isSelected ? c.note : undefined}
            labelFill={
              isSelected
                ? "var(--color-accent-fg)"
                : NORMAL_COLORS[c.note] ?? "currentColor"
            }
            onClick={() => handleClick(c.string, c.fret)}
            ariaLabel={`String ${c.string + 1}, Fret ${c.fret}, Note ${c.note}${isSelected ? " (selected)" : ""}`}
          />
        );
      })}
    </Fretboard>
  );
}

export type { StringFrets };
