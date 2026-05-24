// Pitch-class folding for chord detection. We sum FFT magnitudes into 12 bins
// (C, C#, …, B) regardless of octave — that's the "chromagram" that chord
// templates are matched against.

const A4_FREQUENCY = 440;
// Restrict to a guitar-friendly range. Below ~70 Hz is sub-bass / hum; above
// ~2 kHz adds harmonic noise without helping chord identification.
const MIN_FREQUENCY = 70;
const MAX_FREQUENCY = 2000;

export const PITCH_CLASS_NAMES = [
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
] as const;

export type Chromagram = Float32Array; // length 12, indexed 0=C … 11=B

/**
 * Build a lookup table mapping FFT bin index → pitch class (0–11) or -1 if the
 * bin is outside the guitar range. Computed once per (sampleRate, fftSize)
 * combination since both are fixed for the life of the AudioContext.
 */
export function buildBinToPitchClass(
  sampleRate: number,
  fftSize: number,
): Int8Array {
  const binCount = fftSize / 2;
  const table = new Int8Array(binCount);
  for (let k = 0; k < binCount; k++) {
    const freq = (k * sampleRate) / fftSize;
    if (freq < MIN_FREQUENCY || freq > MAX_FREQUENCY) {
      table[k] = -1;
      continue;
    }
    // Semitones above A4, rounded to the nearest equal-tempered note. Adding 9
    // shifts the index so C maps to 0 (A is at index 9 in the C-based scale).
    const semitonesFromA4 = Math.round(12 * Math.log2(freq / A4_FREQUENCY));
    table[k] = (((semitonesFromA4 + 9) % 12) + 12) % 12;
  }
  return table;
}

/**
 * Fold an FFT magnitude spectrum (linear, not dB) into a 12-bin chromagram.
 * `binToPc` must come from `buildBinToPitchClass(sampleRate, fftSize)`.
 * Output is L1-normalized so it sums to 1 (or all zeros if input is silent).
 */
export function computeChromagram(
  magnitudes: Float32Array,
  binToPc: Int8Array,
  out: Chromagram,
): Chromagram {
  out.fill(0);
  const N = Math.min(magnitudes.length, binToPc.length);
  for (let k = 0; k < N; k++) {
    const pc = binToPc[k];
    if (pc < 0) continue;
    out[pc] += magnitudes[k];
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += out[i];
  if (sum > 0) {
    for (let i = 0; i < 12; i++) out[i] /= sum;
  }
  return out;
}

/** Convert a dB magnitude (as returned by `getFloatFrequencyData`) to linear. */
export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * Fill `out` with linear magnitudes from a dB spectrum. AnalyserNode floors
 * "silence" at `minDecibels` (default -100 dB); we clamp anything at or below
 * that to 0 so background noise doesn't pollute the chromagram.
 */
export function dbSpectrumToLinear(
  dbSpectrum: Float32Array,
  out: Float32Array,
  minDecibels: number,
): Float32Array {
  for (let i = 0; i < dbSpectrum.length; i++) {
    const db = dbSpectrum[i];
    out[i] = db <= minDecibels ? 0 : dbToLinear(db);
  }
  return out;
}
