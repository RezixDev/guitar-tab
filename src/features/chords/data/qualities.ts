import type { ChordQualityKey } from "@shared/types/chord";

export type ChordQuality = {
  key: ChordQualityKey;
  label: string;
  symbol: string;
  intervals: number[];
};

export const qualities: Record<ChordQualityKey, ChordQuality> = {
  major: { key: "major", label: "Major", symbol: " Major", intervals: [0, 4, 7] },
  minor: { key: "minor", label: "Minor", symbol: " Minor", intervals: [0, 3, 7] },
  "7": { key: "7", label: "Dominant 7", symbol: "7", intervals: [0, 4, 7, 10] },
  maj7: { key: "maj7", label: "Major 7", symbol: " Major 7", intervals: [0, 4, 7, 11] },
  m7: { key: "m7", label: "Minor 7", symbol: " Minor 7", intervals: [0, 3, 7, 10] },
};
