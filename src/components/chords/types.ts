export type Note = {
    string: number;
    fret: number;
    finger: number;
  };
  
  export type Chord = {
    name: string;
    startingFret: number;
    notes: Note[];
  };
  
  