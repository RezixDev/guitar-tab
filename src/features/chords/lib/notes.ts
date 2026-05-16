import type { ChordRootNote } from "@shared/types/chord";

export const NOTE_NAMES: ChordRootNote[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const SEMITONE_OF: Record<ChordRootNote, number> = NOTE_NAMES.reduce(
  (acc, note, i) => {
    acc[note] = i;
    return acc;
  },
  {} as Record<ChordRootNote, number>,
);

export function semitone(note: ChordRootNote): number {
  return SEMITONE_OF[note];
}

export function normalize(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function transpose(note: ChordRootNote, by: number): ChordRootNote {
  return NOTE_NAMES[normalize(semitone(note) + by)];
}

// Standard tuning, low E (index 0) to high e (index 5).
export const STANDARD_TUNING: ChordRootNote[] = ["E", "A", "D", "G", "B", "E"];

export function fretToNote(stringIndex: number, fret: number): ChordRootNote {
  return transpose(STANDARD_TUNING[stringIndex], fret);
}
