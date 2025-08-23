// types/chord.ts

export type Note = {
  fret: number | null;
  finger: number | null;
}

export type Chord = {
  name: string;
  startingFret: number;
  notes: Note[];
}

// Component Props
export type ChordSVGProps = {
  chord: (number | null)[];
  chordName: string;
  startingFret: number;
}

export type ChordTabsProps = {
  filteredStandardChords: Chord[];
  filteredExtendedChords: Chord[];
  handleChordChange: (chord: Chord) => void;
}

export type ChordModalProps = {
  chord: Chord;
  isOpen: boolean;
  onClose: () => void;
  ChordSVGComponent: React.ComponentType<ChordSVGProps>;
}

export type FloatingChordViewerProps = {
  chord: Chord;
  ChordSVGComponent: React.ComponentType<ChordSVGProps>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Type Guards
export function isStandardChord(chord: Chord): boolean {
  return !chord.name.includes('7') && !chord.name.toLowerCase().includes('major 7');
}

export function isExtendedChord(chord: Chord): boolean {
  return chord.name.includes('7') || chord.name.toLowerCase().includes('major 7');
}

// Event Handler Types
export type ChordInputHandler = (index: number, value: number | null) => void;
export type ChordChangeHandler = (chord: Chord) => void;
export type NameChangeHandler = (name: string) => void;
export type StartingFretChangeHandler = (fret: number) => void;
export type SearchChangeHandler = (term: string) => void;