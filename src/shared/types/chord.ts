import type { ComponentType } from "react";

export type ChordNote = {
  string?: number;
  fret: number | null;
  finger: number | null;
};

export type Chord = {
  name: string;
  startingFret: number;
  notes: ChordNote[];
};

export type ChordTheme = {
  name: string;
  backgroundColor: string;
  textColor: string;
  stringColor: string;
  fretColor: string;
  nutColor: string;
  markerColor: string;
  markerTextColor: string;
  mutedColor: string;
  openStringColor: string;
  showFingerNumbers: boolean;
  showStringNames: boolean;
  showFretNumbers: boolean;
  markerStyle: "circle" | "square" | "diamond";
  fontFamily: string;
  borderRadius?: number;
  shadow?: boolean;
};

export type ChordSVGProps = {
  chord: ChordNote[];
  chordName: string;
  startingFret: number;
  theme?: ChordTheme;
};

export type ChordTabsProps = {
  filteredStandardChords: Chord[];
  filteredExtendedChords: Chord[];
  handleChordChange: (chord: Chord) => void;
};

export type ChordModalProps = {
  chord: Chord;
  isOpen: boolean;
  onClose: () => void;
  ChordSVGComponent: ComponentType<ChordSVGProps>;
  selectedTheme?: string;
  onThemeChange?: (theme: string) => void;
};

export type FloatingChordViewerProps = {
  chord: Chord;
  ChordSVGComponent: ComponentType<ChordSVGProps>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};
