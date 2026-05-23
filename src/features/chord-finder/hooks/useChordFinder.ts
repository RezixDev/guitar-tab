import { useCallback, useMemo, useState } from "react";
import { standardTuning } from "@shared/music/notes";
import { findChords, type PlacedNote } from "../lib/chordMatcher";

/**
 * Owns the user's selection (one fret per string) and derives the chord
 * matches from it. Selection is a plain object keyed by stringIndex so it
 * serializes trivially and renders cheaply.
 */
export function useChordFinder() {
  const tuning = standardTuning;
  const [selection, setSelection] = useState<Record<number, number>>({});

  const toggleFret = useCallback((stringIndex: number, fret: number) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[stringIndex] === fret) delete next[stringIndex];
      else next[stringIndex] = fret;
      return next;
    });
  }, []);

  const setOpen = useCallback((stringIndex: number) => {
    setSelection((prev) => {
      if (prev[stringIndex] === 0) {
        const next = { ...prev };
        delete next[stringIndex];
        return next;
      }
      return { ...prev, [stringIndex]: 0 };
    });
  }, []);

  const muteString = useCallback((stringIndex: number) => {
    setSelection((prev) => {
      if (!(stringIndex in prev)) return prev;
      const next = { ...prev };
      delete next[stringIndex];
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelection({}), []);

  const placedNotes = useMemo<PlacedNote[]>(
    () =>
      Object.entries(selection).map(([s, f]) => ({
        string: Number(s),
        fret: f,
      })),
    [selection],
  );

  const matches = useMemo(
    () => findChords(placedNotes, tuning),
    [placedNotes, tuning],
  );

  return {
    tuning,
    selection,
    placedNotes,
    matches,
    toggleFret,
    setOpen,
    muteString,
    clear,
  };
}
