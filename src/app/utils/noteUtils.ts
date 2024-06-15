// noteUtils.ts

export type Tuning = string[];

export const standardTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'E'];
export const halfStepDownTuning: Tuning = ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'];
export const dropDTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'D'];

export const fretNotes: string[][] = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
];

export interface NotePosition {
  string: number;
  fret: number;
  note: string;
}

export interface Note extends NotePosition {}

export const getNoteIndex = (note: string): NotePosition => {
  for (let i = 0; i < fretNotes.length; i++) {
    for (let j = 0; j < fretNotes[i].length; j++) {
      if (fretNotes[i][j] === note) {
        return { string: i, fret: j, note };
      }
    }
  }
  return { string: 0, fret: 0, note };
};

export const getNote = (
  string: number,
  fret: number,
  tuning: Tuning
): string => {
  const noteIndex = getNoteIndex(tuning[string]);
  return fretNotes[noteIndex.string][(noteIndex.fret + fret + 1) % 12];
};

export const generateRandomNote = (tuning: Tuning): Note => {
  const string = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * 12);
  return { string, fret, note: getNote(string, fret, tuning) };
};

export const getAllNotePositions = (
  note: string,
  tuning: Tuning
): NotePosition[] => {
  const positions: NotePosition[] = [];
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    for (let fretIndex = 0; fretIndex < fretNotes[0].length; fretIndex++) {
      if (getNote(stringIndex, fretIndex, tuning) === note) {
        positions.push({ string: stringIndex, fret: fretIndex, note });
      }
    }
  }
  return positions;
};

export const getChordPositions = (
  chord: string,
  tuning: Tuning
): NotePosition[] => {
  const positions: NotePosition[] = [];
  chords[chord].forEach((note) => {
    positions.push(...getAllNotePositions(note, tuning));
  });
  return positions;
};

export const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const minorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const majorPentatonicScale = ['C', 'D', 'E', 'G', 'A'];
export const minorPentatonicScale = ['A', 'C', 'D', 'E', 'G'];
export const bluesScale = ['A', 'C', 'D', 'D#', 'E', 'G'];
