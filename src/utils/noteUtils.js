export const standardTuning = ['E', 'B', 'G', 'D', 'A', 'E'];
export const halfStepDownTuning = ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'];
export const dropDTuning = ['E', 'B', 'G', 'D', 'A', 'D'];

export const fretNotes = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
];

export const chords = {
  'C Major': ['C', 'E', 'G'],
  'G Major': ['G', 'B', 'D'],
  'D Major': ['D', 'F#', 'A'],
  'A Major': ['A', 'C#', 'E'],
  'E Major': ['E', 'G#', 'B'],
  'F Major': ['F', 'A', 'C'],
  'B Major': ['B', 'D#', 'F#'],
};

export const getNoteIndex = (note) => {
  for (let i = 0; i < fretNotes.length; i++) {
    for (let j = 0; j < fretNotes[i].length; j++) {
      if (fretNotes[i][j] === note) {
        return { string: i, fret: j };
      }
    }
  }
  return { string: 0, fret: 0 };
};

export const getNote = (string, fret, tuning) => {
  const noteIndex = getNoteIndex(tuning[string]);
  return fretNotes[noteIndex.string][(noteIndex.fret + fret + 1) % 12];
};

export const generateRandomNote = (tuning) => {
  const string = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * 12);
  return { string, fret, note: getNote(string, fret, tuning) };
};

export const getAllNotePositions = (note, tuning) => {
  const positions = [];
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    for (let fretIndex = 0; fretIndex < fretNotes[0].length; fretIndex++) {
      if (getNote(stringIndex, fretIndex, tuning) === note) {
        positions.push({ string: stringIndex, fret: fretIndex });
      }
    }
  }
  return positions;
};

export const getChordPositions = (chord, tuning) => {
  const positions = [];
  chords[chord].forEach((note) => {
    positions.push(...getAllNotePositions(note, tuning));
  });
  return positions;
};
