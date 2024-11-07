export type Note = {
  note: string;
  string: number;
  fret: number;
};

export const majorScale = [0, 2, 4, 5, 7, 9, 11];
export const minorScale = [0, 2, 3, 5, 7, 8, 10];
export const majorPentatonicScale = [0, 2, 4, 7, 9];
export const minorPentatonicScale = [0, 3, 5, 7, 10];
export const bluesScale = [0, 3, 5, 6, 7, 10];

export type Tuning = string[];

export type NotePosition = {
  string: number;
  fret: number;
  note: string;
};

// The chromatic scale starting from C
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Reversed tuning order to match visual representation (high E to low E)
export const standardTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'E'];
export const halfStepDownTuning: Tuning = ['Eb', 'Bb', 'Gb', 'Db', 'Ab', 'Eb'];
export const dropDTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'D'];

export const convertStringPosition = (stringIndex: number, total: number = 6): number => {
  // Convert from logical (0 = low E) to visual (0 = high E) position or vice versa
  return total - 1 - stringIndex;
};


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
  return notes.indexOf(normalizedNote);
};

// Get note at a specific fret position
export const getNote = (string: number, fret: number, tuning: Tuning): string => {
  // Convert visual string position back to logical for tuning array access
  const logicalString = convertStringPosition(string);
  const openNote = tuning[logicalString];
  const startIndex = getNoteIndex(openNote);
  
  if (startIndex === -1) return notes[0];
  
  const noteIndex = (startIndex + 1  + fret) % 12;
  return notes[noteIndex];
};


// Get all positions of a specific note on the fretboard
export const getAllNotePositions = (noteToFind: string, tuning: Tuning): NotePosition[] => {
  const positions: NotePosition[] = [];
  
  // Iterate through strings in visual order (top to bottom)
  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 0; fret <= 12; fret++) {
      const currentNote = getNote(string, fret, tuning);
      if (currentNote === noteToFind) {
        // Convert string position to visual representation
        const visualString = convertStringPosition(string);
        positions.push({ string: visualString, fret, note: currentNote });
      }
    }
  }
  
  return positions;
};

// Get notes in a scale starting from a root note
export const getScaleNotes = (rootNote: string, scaleIntervals: number[]): string[] => {
  const rootIndex = getNoteIndex(rootNote);
  if (rootIndex === -1) return [];
  
  return scaleIntervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return notes[noteIndex];
  });
};

// Get all positions for a complete scale
export const getScalePositions = (rootNote: string, scaleIntervals: number[], tuning: Tuning): NotePosition[] => {
  const scaleNotes = getScaleNotes(rootNote, scaleIntervals);
  return scaleNotes.flatMap(note => getAllNotePositions(note, tuning));
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