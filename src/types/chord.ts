// types/chord.ts
export interface Chord {
    id: string;
    name: string;
    category: 'standard' | 'extended';
    notes: (number | null)[];
    startingFret?: number;
  }
  
  export type ChordInputHandler = (index: number, value: number | null) => void;
  export type ChordChangeHandler = (chord: Chord) => void;
  export type NameChangeHandler = (name: string) => void;
  export type StartingFretChangeHandler = (fret: number) => void;
  export type SearchChangeHandler = (term: string) => void;