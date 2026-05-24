// Standard 12-tone equal temperament with A4 = 440 Hz.
const A4_FREQUENCY = 440;
// MIDI note number of A4. Used as the anchor for the freq↔note conversion.
const A4_MIDI = 69;

const NOTE_NAMES = [
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

export type ChromaticNote = {
  /** Note name without octave, e.g. "A", "F#". */
  note: (typeof NOTE_NAMES)[number];
  /** Scientific pitch octave, e.g. 4 for A4. */
  octave: number;
  /** Exact frequency of the nearest equal-tempered pitch. */
  targetFrequency: number;
  /** Cents from the nearest pitch (-50..+50). Positive = sharp. */
  cents: number;
};

/** Convert a frequency in Hz to the nearest chromatic note + cents offset. */
export function frequencyToNote(frequency: number): ChromaticNote | null {
  if (!frequency || frequency <= 0) return null;

  const midiFloat = 12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI;
  const midi = Math.round(midiFloat);
  const cents = (midiFloat - midi) * 100;

  const note = NOTE_NAMES[((midi % 12) + 12) % 12];
  // MIDI 60 = C4, so octave shifts at C, not A.
  const octave = Math.floor(midi / 12) - 1;
  const targetFrequency = A4_FREQUENCY * Math.pow(2, (midi - A4_MIDI) / 12);

  return { note, octave, targetFrequency, cents };
}

/** Map cents (-50..+50) to a 0–100 bar where 50 = perfectly in tune. */
export function centsToAccuracy(cents: number): number {
  return Math.max(0, Math.min(100, 50 + cents));
}

export type TuningStatus = "flat" | "sharp" | "in-tune";

export const IN_TUNE_THRESHOLD_CENTS = 5;

export function statusFromCents(cents: number): TuningStatus {
  if (Math.abs(cents) < IN_TUNE_THRESHOLD_CENTS) return "in-tune";
  return cents < 0 ? "flat" : "sharp";
}
