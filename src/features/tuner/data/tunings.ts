import type { TunerNote, TuningId } from "../types";

// Multiplier to drop a note by one semitone (12-TET)
const HALF_STEP = 2 ** (-1 / 12);

export type TuningPreset = {
  label: string;
  notes: TunerNote[];
};

export const TUNINGS: Record<TuningId, TuningPreset> = {
  standard: {
    label: "Standard (EADGBe)",
    notes: [
      { note: "E4", frequency: 329.63, string: 1 },
      { note: "B3", frequency: 246.94, string: 2 },
      { note: "G3", frequency: 196.0, string: 3 },
      { note: "D3", frequency: 146.83, string: 4 },
      { note: "A2", frequency: 110.0, string: 5 },
      { note: "E2", frequency: 82.41, string: 6 },
    ],
  },
  halfStepDown: {
    label: "Half Step Down (Eb Ab Db Gb Bb Eb)",
    notes: [
      { note: "Eb4", frequency: 329.63 * HALF_STEP, string: 1 },
      { note: "Bb3", frequency: 246.94 * HALF_STEP, string: 2 },
      { note: "Gb3", frequency: 196.0 * HALF_STEP, string: 3 },
      { note: "Db3", frequency: 146.83 * HALF_STEP, string: 4 },
      { note: "Ab2", frequency: 110.0 * HALF_STEP, string: 5 },
      { note: "Eb2", frequency: 82.41 * HALF_STEP, string: 6 },
    ],
  },
  dropD: {
    label: "Drop D (DADGBe)",
    notes: [
      { note: "E4", frequency: 329.63, string: 1 },
      { note: "B3", frequency: 246.94, string: 2 },
      { note: "G3", frequency: 196.0, string: 3 },
      { note: "D3", frequency: 146.83, string: 4 },
      { note: "A2", frequency: 110.0, string: 5 },
      { note: "D2", frequency: 73.42, string: 6 },
    ],
  },
};

export const TUNING_IDS = Object.keys(TUNINGS) as TuningId[];
