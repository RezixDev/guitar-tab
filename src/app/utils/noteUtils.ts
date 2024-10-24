export type Note = {
  note: string;
  string: number;
  fret: number;
};

export type Tuning = string[];

export type NotePosition = {
  string: number;
  fret: number;
  note: string;
};

// The chromatic scale starting from C
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


export const standardTuning: Tuning = ['E', 'A', 'D', 'G', 'B', 'E'];
export const halfStepDownTuning: Tuning = ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'];
export const dropDTuning: Tuning = ['D', 'A', 'D', 'G', 'B', 'E'];

// Helper function to get the index of a note in the chromatic scale
// Helper function to get the index of a note in the chromatic scale
export const getNoteIndex = (note: string): number => {
  // Map flats to their enharmonic sharps
  const flatToSharpMap: { [key: string]: string } = {
    'Cb': 'B',
    'Db': 'C#',
    'Eb': 'D#',
    'Fb': 'E',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
  };

  const normalizedNote = flatToSharpMap[note] || note;

  // Now find the index in the notes array
  const index = notes.indexOf(normalizedNote);

  return index;
};


export const getNote = (string: number, fret: number, tuning: Tuning): string => {
  // Adjust the string index to match tuning
  const adjustedStringIndex = tuning.length - 1 - string;

  // Get the open note for this string
  const openNote = tuning[adjustedStringIndex];
  const startIndex = getNoteIndex(openNote);

  if (startIndex === -1) return notes[0];

  let noteIndex = (startIndex + fret + 1) % notes.length;

  return notes[noteIndex];
};

export const getAllNotePositions = (noteToFind: string, tuning: Tuning): NotePosition[] => {
  const positions: NotePosition[] = [];

  // Check each string and fret combination
  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 0; fret <= 12; fret++) {
      const currentNote = getNote(string, fret, tuning);
      if (currentNote === noteToFind) {
        positions.push({ string, fret, note: currentNote });
      }
    }
  }

  return positions;
};

export const generateRandomNote = (tuning: Tuning): Note => {
  const note = notes[Math.floor(Math.random() * notes.length)];
  const positions = getAllNotePositions(note, tuning);

  if (positions.length === 0) {
    return {
      note: notes[0],
      string: 0,
      fret: 0
    };
  }

  const randomPosition = positions[Math.floor(Math.random() * positions.length)];

  return {
    note,
    string: randomPosition.string,
    fret: randomPosition.fret
  };
};