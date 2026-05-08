import type { TunerNote, TuningStatus } from "../types";

export const IN_TUNE_THRESHOLD_CENTS = 5;
// 70 Hz covers the lowest string in any of the supported tunings (Drop D = 73.42 Hz)
export const MIN_GUITAR_FREQUENCY = 70;
export const MAX_GUITAR_FREQUENCY = 400;
// RMS below this is considered silence (skip pitch detection)
export const SILENCE_RMS = 0.003;

/** Cents offset between two frequencies (positive = sharp, negative = flat). */
export function calculateCentsOffPitch(
  detectedFreq: number,
  targetFreq: number,
): number {
  return 1200 * Math.log2(detectedFreq / targetFreq);
}

/** Pick the reference note with the smallest cent distance to `frequency`. */
export function findClosestNote(
  frequency: number,
  candidates: TunerNote[],
): TunerNote | null {
  if (candidates.length === 0) return null;
  return candidates.reduce((closest, note) => {
    const c = Math.abs(calculateCentsOffPitch(frequency, note.frequency));
    const cc = Math.abs(calculateCentsOffPitch(frequency, closest.frequency));
    return c < cc ? note : closest;
  });
}

export function statusFromCents(cents: number): TuningStatus {
  if (Math.abs(cents) < IN_TUNE_THRESHOLD_CENTS) return "in-tune";
  return cents < 0 ? "flat" : "sharp";
}

/** Map cents (-50..+50) to an accuracy bar 0–100. 50 = perfectly in tune. */
export function accuracyFromCents(cents: number): number {
  return Math.max(0, Math.min(100, 50 + cents));
}

/** Map sensitivity (1–10) to an input gain multiplier (1× – 20×). */
export function sensitivityToGain(sensitivity: number): number {
  return 1 + ((sensitivity - 1) / 9) * 19;
}
