import type { ChordPreset } from "@shared/types/chord";

// The chord library is a list of musical definitions (root + quality).
// Voicings are generated on demand by the voicing engine based on the
// user's chosen starting fret — no fret positions are stored here.

export const standardPresets: ChordPreset[] = [
  { id: "A-major", category: "standard", definition: { root: "A", quality: "major" } },
  { id: "A-minor", category: "standard", definition: { root: "A", quality: "minor" } },
  { id: "B-major", category: "standard", definition: { root: "B", quality: "major" } },
  { id: "B-minor", category: "standard", definition: { root: "B", quality: "minor" } },
  { id: "C-major", category: "standard", definition: { root: "C", quality: "major" } },
  { id: "D-major", category: "standard", definition: { root: "D", quality: "major" } },
  { id: "D-minor", category: "standard", definition: { root: "D", quality: "minor" } },
  { id: "E-major", category: "standard", definition: { root: "E", quality: "major" } },
  { id: "E-minor", category: "standard", definition: { root: "E", quality: "minor" } },
  { id: "F-major", category: "standard", definition: { root: "F", quality: "major" } },
  { id: "F-minor", category: "standard", definition: { root: "F", quality: "minor" } },
  { id: "G-major", category: "standard", definition: { root: "G", quality: "major" } },
];

export const extendedPresets: ChordPreset[] = [
  { id: "A-7", category: "extended", definition: { root: "A", quality: "7" } },
  { id: "B-7", category: "extended", definition: { root: "B", quality: "7" } },
  { id: "C-7", category: "extended", definition: { root: "C", quality: "7" } },
  { id: "D-7", category: "extended", definition: { root: "D", quality: "7" } },
  { id: "E-7", category: "extended", definition: { root: "E", quality: "7" } },
  { id: "F-7", category: "extended", definition: { root: "F", quality: "7" } },
  { id: "G-7", category: "extended", definition: { root: "G", quality: "7" } },
  { id: "A-maj7", category: "extended", definition: { root: "A", quality: "maj7" } },
  { id: "C-maj7", category: "extended", definition: { root: "C", quality: "maj7" } },
  { id: "D-maj7", category: "extended", definition: { root: "D", quality: "maj7" } },
  { id: "G-maj7", category: "extended", definition: { root: "G", quality: "maj7" } },
];
