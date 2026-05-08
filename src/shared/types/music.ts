export const NOTES = [
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

export type NoteName = (typeof NOTES)[number] | "Cb" | "Db" | "Eb" | "Fb" | "Gb" | "Ab" | "Bb";

export type Tuning = string[];

export type Note = {
  note: string;
  string: number;
  fret: number;
};

export type NotePosition = {
  string: number;
  fret: number;
  note: string;
};
