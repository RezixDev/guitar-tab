// Chord qualities used by the chord finder. Intervals are semitones from the root.
// Wider catalogue than the chord builder library because the finder should
// recognize common voicings users might play (not just what the builder offers).

export type ChordQualityKey =
  | "major"
  | "minor"
  | "5"
  | "sus2"
  | "sus4"
  | "dim"
  | "aug"
  | "6"
  | "m6"
  | "7"
  | "maj7"
  | "m7"
  | "m7b5"
  | "dim7"
  | "7sus4"
  | "add9"
  | "madd9"
  | "9"
  | "maj9"
  | "m9";

export type ChordQuality = {
  key: ChordQualityKey;
  symbol: string;
  intervals: number[];
};

export const QUALITIES: ChordQuality[] = [
  { key: "major", symbol: "", intervals: [0, 4, 7] },
  { key: "minor", symbol: "m", intervals: [0, 3, 7] },
  { key: "5", symbol: "5", intervals: [0, 7] },
  { key: "sus2", symbol: "sus2", intervals: [0, 2, 7] },
  { key: "sus4", symbol: "sus4", intervals: [0, 5, 7] },
  { key: "dim", symbol: "dim", intervals: [0, 3, 6] },
  { key: "aug", symbol: "aug", intervals: [0, 4, 8] },
  { key: "6", symbol: "6", intervals: [0, 4, 7, 9] },
  { key: "m6", symbol: "m6", intervals: [0, 3, 7, 9] },
  { key: "7", symbol: "7", intervals: [0, 4, 7, 10] },
  { key: "maj7", symbol: "maj7", intervals: [0, 4, 7, 11] },
  { key: "m7", symbol: "m7", intervals: [0, 3, 7, 10] },
  { key: "m7b5", symbol: "m7b5", intervals: [0, 3, 6, 10] },
  { key: "dim7", symbol: "dim7", intervals: [0, 3, 6, 9] },
  { key: "7sus4", symbol: "7sus4", intervals: [0, 5, 7, 10] },
  { key: "add9", symbol: "add9", intervals: [0, 2, 4, 7] },
  { key: "madd9", symbol: "m(add9)", intervals: [0, 2, 3, 7] },
  { key: "9", symbol: "9", intervals: [0, 2, 4, 7, 10] },
  { key: "maj9", symbol: "maj9", intervals: [0, 2, 4, 7, 11] },
  { key: "m9", symbol: "m9", intervals: [0, 2, 3, 7, 10] },
];
