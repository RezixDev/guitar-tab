import type { ChordQualityKey, ChordRootNote } from "@shared/types/chord";

export type ChordShape = {
  key: string;
  label: string;
  qualityKey: ChordQualityKey;
  // The chord root produced when the shape is at anchor fret 0 (open position).
  // E.g. "E" for E-shape, "A" for A-shape.
  rootNote: ChordRootNote;
  // Fret offsets from the anchor fret, indexed low E (0) -> high e (5).
  // 0 = open string at anchor 0 (or barred string when anchor > 0);
  // null = muted string.
  pattern: (number | null)[];
  // Fingering for the OPEN form (anchor = 0). Indexed low E -> high e.
  // null for muted strings and for open strings (pattern[i] === 0 at anchor 0).
  openFingers: (number | null)[];
};

// CAGED-style shape templates. Each shape can be slid up the neck:
// anchorFret = (semitone(targetRoot) - semitone(shape.rootNote) + 12) mod 12.
// Actual fret per string = pattern[i] + anchorFret (skipping null entries).
// When anchor > 0, pattern[i] === 0 means the string is barred at the anchor fret.

export const shapes: ChordShape[] = [
  // ---------- Major ----------
  {
    key: "major-E",
    label: "E Shape",
    qualityKey: "major",
    rootNote: "E",
    pattern: [0, 2, 2, 1, 0, 0],
    openFingers: [null, 2, 3, 1, null, null],
  },
  {
    key: "major-A",
    label: "A Shape",
    qualityKey: "major",
    rootNote: "A",
    pattern: [null, 0, 2, 2, 2, 0],
    openFingers: [null, null, 1, 2, 3, null],
  },
  {
    key: "major-D",
    label: "D Shape",
    qualityKey: "major",
    rootNote: "D",
    pattern: [null, null, 0, 2, 3, 2],
    openFingers: [null, null, null, 1, 3, 2],
  },
  {
    key: "major-C",
    label: "C Shape",
    qualityKey: "major",
    rootNote: "C",
    pattern: [null, 3, 2, 0, 1, 0],
    openFingers: [null, 3, 2, null, 1, null],
  },
  {
    key: "major-G",
    label: "G Shape",
    qualityKey: "major",
    rootNote: "G",
    pattern: [3, 2, 0, 0, 0, 3],
    openFingers: [3, 2, null, null, null, 4],
  },

  // ---------- Minor ----------
  {
    key: "minor-E",
    label: "Em Shape",
    qualityKey: "minor",
    rootNote: "E",
    pattern: [0, 2, 2, 0, 0, 0],
    openFingers: [null, 2, 3, null, null, null],
  },
  {
    key: "minor-A",
    label: "Am Shape",
    qualityKey: "minor",
    rootNote: "A",
    pattern: [null, 0, 2, 2, 1, 0],
    openFingers: [null, null, 2, 3, 1, null],
  },
  {
    key: "minor-D",
    label: "Dm Shape",
    qualityKey: "minor",
    rootNote: "D",
    pattern: [null, null, 0, 2, 3, 1],
    openFingers: [null, null, null, 2, 3, 1],
  },

  // ---------- Dominant 7 ----------
  {
    key: "7-E",
    label: "E7 Shape",
    qualityKey: "7",
    rootNote: "E",
    pattern: [0, 2, 0, 1, 0, 0],
    openFingers: [null, 2, null, 1, null, null],
  },
  {
    key: "7-A",
    label: "A7 Shape",
    qualityKey: "7",
    rootNote: "A",
    pattern: [null, 0, 2, 0, 2, 0],
    openFingers: [null, null, 2, null, 3, null],
  },
  {
    key: "7-D",
    label: "D7 Shape",
    qualityKey: "7",
    rootNote: "D",
    pattern: [null, null, 0, 2, 1, 2],
    openFingers: [null, null, null, 2, 1, 3],
  },
  {
    key: "7-C",
    label: "C7 Shape",
    qualityKey: "7",
    rootNote: "C",
    pattern: [null, 3, 2, 3, 1, 0],
    openFingers: [null, 3, 2, 4, 1, null],
  },
  {
    key: "7-G",
    label: "G7 Shape",
    qualityKey: "7",
    rootNote: "G",
    pattern: [3, 2, 0, 0, 0, 1],
    openFingers: [3, 2, null, null, null, 1],
  },

  // ---------- Major 7 ----------
  {
    key: "maj7-E",
    label: "Emaj7 Shape",
    qualityKey: "maj7",
    rootNote: "E",
    pattern: [0, 2, 1, 1, 0, 0],
    openFingers: [null, 3, 1, 2, null, null],
  },
  {
    key: "maj7-A",
    label: "Amaj7 Shape",
    qualityKey: "maj7",
    rootNote: "A",
    pattern: [null, 0, 2, 1, 2, 0],
    openFingers: [null, null, 2, 1, 3, null],
  },
  {
    key: "maj7-D",
    label: "Dmaj7 Shape",
    qualityKey: "maj7",
    rootNote: "D",
    pattern: [null, null, 0, 2, 2, 2],
    openFingers: [null, null, null, 1, 1, 1],
  },
  {
    key: "maj7-C",
    label: "Cmaj7 Shape",
    qualityKey: "maj7",
    rootNote: "C",
    pattern: [null, 3, 2, 0, 0, 0],
    openFingers: [null, 3, 2, null, null, null],
  },
  {
    key: "maj7-G",
    label: "Gmaj7 Shape",
    qualityKey: "maj7",
    rootNote: "G",
    pattern: [3, 2, 0, 0, 0, 2],
    openFingers: [3, 2, null, null, null, 1],
  },

  // ---------- Minor 7 ----------
  {
    key: "m7-E",
    label: "Em7 Shape",
    qualityKey: "m7",
    rootNote: "E",
    pattern: [0, 2, 0, 0, 0, 0],
    openFingers: [null, 2, null, null, null, null],
  },
  {
    key: "m7-A",
    label: "Am7 Shape",
    qualityKey: "m7",
    rootNote: "A",
    pattern: [null, 0, 2, 0, 1, 0],
    openFingers: [null, null, 2, null, 1, null],
  },
  {
    key: "m7-D",
    label: "Dm7 Shape",
    qualityKey: "m7",
    rootNote: "D",
    pattern: [null, null, 0, 2, 1, 1],
    openFingers: [null, null, null, 2, 1, 1],
  },
];
