import {
  bluesScale,
  majorPentatonicScale,
  majorScale,
  minorPentatonicScale,
  minorScale,
} from "@shared/music/notes";

export const SCALES = {
  Major: majorScale,
  Minor: minorScale,
  "Major Pentatonic": majorPentatonicScale,
  "Minor Pentatonic": minorPentatonicScale,
  Blues: bluesScale,
} as const;

export type ScaleName = keyof typeof SCALES;

export const SCALE_NAMES = Object.keys(SCALES) as ScaleName[];
