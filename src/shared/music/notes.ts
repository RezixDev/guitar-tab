import { NOTES } from "@shared/types/music";
import type { Note, NotePosition, Tuning } from "@shared/types/music";

export const majorScale = [0, 2, 4, 5, 7, 9, 11];
export const minorScale = [0, 2, 3, 5, 7, 8, 10];
export const majorPentatonicScale = [0, 2, 4, 7, 9];
export const minorPentatonicScale = [0, 3, 5, 7, 10];
export const bluesScale = [0, 3, 5, 6, 7, 10];

export const standardTuning: Tuning = ["E", "B", "G", "D", "A", "E"];
export const halfStepDownTuning: Tuning = ["Eb", "Bb", "Gb", "Db", "Ab", "Eb"];
export const dropDTuning: Tuning = ["E", "B", "G", "D", "A", "D"];

const FLAT_TO_SHARP: Record<string, string> = {
  Cb: "B",
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

export const getNoteIndex = (note: string): number => {
  const normalized = FLAT_TO_SHARP[note] ?? note;
  return NOTES.indexOf(normalized as (typeof NOTES)[number]);
};

export const calculateNote = (
  string: number,
  fret: number,
  tuning: Tuning,
): string => {
  const openNote = tuning[string];
  const startIndex = getNoteIndex(openNote);
  if (startIndex === -1) return NOTES[0];
  return NOTES[(startIndex + fret) % 12];
};

export const getAllNotePositions = (
  noteToFind: string,
  tuning: Tuning,
  maxFret = 12,
): NotePosition[] => {
  const positions: NotePosition[] = [];
  const seen = new Set<string>();

  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 1; fret <= maxFret; fret++) {
      const current = calculateNote(string, fret, tuning);
      if (current !== noteToFind) continue;
      const key = `${string}-${fret}`;
      if (seen.has(key)) continue;
      seen.add(key);
      positions.push({ string, fret, note: current });
    }
  }
  return positions;
};

export const getScaleNotes = (
  rootNote: string,
  scaleIntervals: number[],
): string[] => {
  const rootIndex = getNoteIndex(rootNote);
  if (rootIndex === -1) return [];
  return scaleIntervals.map((interval) => NOTES[(rootIndex + interval) % 12]);
};

export const getScalePositions = (
  rootNote: string,
  scaleIntervals: number[],
  tuning: Tuning,
): NotePosition[] => {
  const scaleNotes = getScaleNotes(rootNote, scaleIntervals);
  return scaleNotes.flatMap((note) => getAllNotePositions(note, tuning));
};

export const generateRandomNote = (tuning: Tuning): Note => {
  const note = NOTES[Math.floor(Math.random() * NOTES.length)];
  const positions = getAllNotePositions(note, tuning);
  if (positions.length === 0) {
    return { note: NOTES[0], string: 0, fret: 0 };
  }
  const random = positions[Math.floor(Math.random() * positions.length)];
  return { note, string: random.string, fret: random.fret };
};
