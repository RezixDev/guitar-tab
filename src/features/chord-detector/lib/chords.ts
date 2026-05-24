import { PITCH_CLASS_NAMES, type Chromagram } from "./chromagram";

// A chord type is a set of intervals from the root (in semitones).
type ChordType = {
  /** Suffix appended to the root note, e.g. "" for major, "m" for minor. */
  suffix: string;
  /** Semitone intervals from the root. */
  intervals: readonly number[];
};

// Order matters when scores tie — earlier entries win. Common shapes first.
const CHORD_TYPES: readonly ChordType[] = [
  { suffix: "", intervals: [0, 4, 7] }, // major
  { suffix: "m", intervals: [0, 3, 7] }, // minor
  { suffix: "7", intervals: [0, 4, 7, 10] }, // dominant 7
  { suffix: "m7", intervals: [0, 3, 7, 10] }, // minor 7
  { suffix: "maj7", intervals: [0, 4, 7, 11] }, // major 7
  { suffix: "sus4", intervals: [0, 5, 7] }, // suspended 4
  { suffix: "sus2", intervals: [0, 2, 7] }, // suspended 2
  { suffix: "dim", intervals: [0, 3, 6] }, // diminished
  { suffix: "aug", intervals: [0, 4, 8] }, // augmented
];

type Template = {
  name: string;
  /** Pitch-class mask, L2-normalized so cosine similarity is just the dot product. */
  vector: Float32Array;
};

// Pre-compute every (root, type) template once at module load.
const TEMPLATES: readonly Template[] = CHORD_TYPES.flatMap((type) =>
  PITCH_CLASS_NAMES.map((rootName, root) => {
    const v = new Float32Array(12);
    for (const interval of type.intervals) {
      v[(root + interval) % 12] = 1;
    }
    // L2-normalize
    let norm = 0;
    for (let i = 0; i < 12; i++) norm += v[i] * v[i];
    norm = Math.sqrt(norm);
    if (norm > 0) for (let i = 0; i < 12; i++) v[i] /= norm;
    return { name: rootName + type.suffix, vector: v };
  }),
);

export type ChordMatch = {
  name: string;
  /** Cosine similarity 0–1 (1 = perfect match). */
  confidence: number;
};

/**
 * Find the chord template that best matches the chromagram, by cosine
 * similarity. `chroma` should be a non-negative 12-vector (normalization
 * doesn't matter — cosine is scale-invariant).
 */
export function matchChord(chroma: Chromagram): ChordMatch | null {
  // L2 norm of the input chromagram. If it's zero, the input is silent.
  let chromaNorm = 0;
  for (let i = 0; i < 12; i++) chromaNorm += chroma[i] * chroma[i];
  if (chromaNorm === 0) return null;
  chromaNorm = Math.sqrt(chromaNorm);

  let best: Template | null = null;
  let bestScore = -1;
  for (const t of TEMPLATES) {
    let dot = 0;
    for (let i = 0; i < 12; i++) dot += chroma[i] * t.vector[i];
    // Template is already unit-norm, so cosine = dot / chromaNorm
    const score = dot / chromaNorm;
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  if (!best) return null;
  return { name: best.name, confidence: bestScore };
}

/**
 * Get the top-N pitch classes by energy, useful for showing "Detected notes:
 * C, E, G" alongside the chord guess. Returns indices into PITCH_CLASS_NAMES.
 */
export function topPitchClasses(chroma: Chromagram, n: number): number[] {
  const idx = Array.from({ length: 12 }, (_, i) => i);
  idx.sort((a, b) => chroma[b] - chroma[a]);
  return idx.slice(0, n);
}
