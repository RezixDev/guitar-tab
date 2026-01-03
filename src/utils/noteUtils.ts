export type Note = {
  note: string;
  string: number;
  fret: number;
};


export type TuningNotes = Note[];


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
export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Reversed tuning order to match visual representation (high E to low E)
export const standardTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'E'];
export const halfStepDownTuning: Tuning = ['Eb', 'Bb', 'Gb', 'Db', 'Ab', 'Eb'];
export const dropDTuning: Tuning = ['E', 'B', 'G', 'D', 'A', 'D'];




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
export const calculateNote = (string: number, fret: number, tuning: Tuning): string => {
  // Use direct string index as tuning is already ordered visually
  const openNote = tuning[string];
  const startIndex = getNoteIndex(openNote);

  if (startIndex === -1) return notes[0];

  const noteIndex = (startIndex + fret) % 12;
  return notes[noteIndex];
};


// Get all positions of a specific note on the fretboard
export const getAllNotePositions = (noteToFind: string, tuning: Tuning): NotePosition[] => {
  const positions: NotePosition[] = [];

  const maxFret = 12;
  const usedPositions = new Set<string>();


  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const currentNote = calculateNote(string, fret, tuning);
      if (currentNote === noteToFind) {
        const positionKey = `${string}-${fret}`;

        if (!usedPositions.has(positionKey)) {
          usedPositions.add(positionKey);
          positions.push({
            string,
            fret,
            note: currentNote
          });
        }
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