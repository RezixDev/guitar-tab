// types/chord.ts

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
  markerStyle: 'circle' | 'square' | 'diamond';
  fontFamily: string;
  borderRadius?: number;
  shadow?: boolean;
}

export const chordThemes: Record<string, ChordTheme> = {
  classic: {
    name: "Classic",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    stringColor: "#000000",
    fretColor: "#808080",
    nutColor: "#000000",
    markerColor: "#3b82f6", // blue-500
    markerTextColor: "#ffffff",
    mutedColor: "#000000",
    openStringColor: "#000000",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Arial",
    shadow: true,
  },
  modern: {
    name: "Modern Dark",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    stringColor: "#ffffff",
    fretColor: "#ffffff",
    nutColor: "#ffffff",
    markerColor: "#ffffff",
    markerTextColor: "#000000",
    mutedColor: "#ffffff",
    openStringColor: "#ffffff",
    showFingerNumbers: false,
    showStringNames: false,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Arial",
    shadow: false,
  },
  vintage: {
    name: "Vintage",
    backgroundColor: "#f5e6d3",
    textColor: "#3e2723",
    stringColor: "#5d4037",
    fretColor: "#8d6e63",
    nutColor: "#3e2723",
    markerColor: "#6d4c41",
    markerTextColor: "#f5e6d3",
    mutedColor: "#3e2723",
    openStringColor: "#3e2723",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Georgia, serif",
    shadow: true,
  },
  neon: {
    name: "Neon",
    backgroundColor: "#0a0a0a",
    textColor: "#00ffff",
    stringColor: "#ff00ff",
    fretColor: "#ffff00",
    nutColor: "#00ff00",
    markerColor: "#ff00ff",
    markerTextColor: "#000000",
    mutedColor: "#ff0000",
    openStringColor: "#00ff00",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'diamond',
    fontFamily: "Courier New, monospace",
    shadow: true,
  },
  minimalist: {
    name: "Minimalist",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    stringColor: "#cccccc",
    fretColor: "#e0e0e0",
    nutColor: "#333333",
    markerColor: "#333333",
    markerTextColor: "#ffffff",
    mutedColor: "#999999",
    openStringColor: "#333333",
    showFingerNumbers: false,
    showStringNames: false,
    showFretNumbers: false,
    markerStyle: 'square',
    fontFamily: "Helvetica, Arial, sans-serif",
    shadow: false,
  },
  blueprint: {
    name: "Blueprint",
    backgroundColor: "#003d82",
    textColor: "#ffffff",
    stringColor: "#ffffff",
    fretColor: "#5c9edd",
    nutColor: "#ffffff",
    markerColor: "#ffffff",
    markerTextColor: "#003d82",
    mutedColor: "#ffcc00",
    openStringColor: "#00ff00",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Courier New, monospace",
    shadow: false,
  },
  highContrast: {
    name: "High Contrast",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    stringColor: "#000000",
    fretColor: "#000000",
    nutColor: "#000000",
    markerColor: "#000000",
    markerTextColor: "#ffffff",
    mutedColor: "#000000",
    openStringColor: "#000000",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Arial Black, sans-serif",
    shadow: false,
  },
  pastel: {
    name: "Pastel",
    backgroundColor: "#fef3f8",
    textColor: "#6b5b95",
    stringColor: "#88b0d3",
    fretColor: "#fadcb3",
    nutColor: "#6b5b95",
    markerColor: "#ffb7c5",
    markerTextColor: "#ffffff",
    mutedColor: "#b8a9c9",
    openStringColor: "#88d8b0",
    showFingerNumbers: true,
    showStringNames: true,
    showFretNumbers: true,
    markerStyle: 'circle',
    fontFamily: "Comic Sans MS, cursive",
    shadow: true,
  }
};

export type ChordSVGProps = {
  chord: Note[];
  chordName: string;
  startingFret: number;
  theme?: ChordTheme; // Add theme prop
}

export type Note = {
  fret: number | null;
  finger: number | null;
}

export type Chord = {
  name: string;
  startingFret: number;
  notes: Note[];
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
  selectedTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export type FloatingChordViewerProps = {
  chord: Chord;
  ChordSVGComponent: React.ComponentType<ChordSVGProps>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
