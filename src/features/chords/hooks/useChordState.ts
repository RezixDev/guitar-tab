import { useMemo, useState, type ChangeEvent } from "react";
import type {
  Chord,
  ChordDefinition,
  ChordNote,
  ChordPreset,
} from "@shared/types/chord";
import { standardPresets, extendedPresets } from "../data/library";
import { buildVoicing, getDisplayName } from "../lib/voicingEngine";

const EMPTY_NOTES: ChordNote[] = Array.from({ length: 6 }, (_, i) => ({
  string: 5 - i,
  fret: null,
  finger: null,
}));

const DEFAULT_CHORD: Chord = {
  name: "",
  startingFret: 1,
  notes: EMPTY_NOTES,
};

type ChordState =
  // Generated from a definition: starting fret drives voicing selection.
  | { mode: "generated"; definition: ChordDefinition; startingFret: number }
  // Manually edited: notes are user-controlled, startingFret only adjusts the diagram window.
  | { mode: "custom"; chord: Chord };

function generated(definition: ChordDefinition, startingFret: number): Chord {
  const built = buildVoicing(definition, startingFret);
  if (built) return built;
  // Fallback: empty voicing labelled with the chord name.
  return {
    name: getDisplayName(definition),
    startingFret: Math.max(1, startingFret),
    notes: EMPTY_NOTES,
  };
}

export function useChordState(initialChord?: Chord) {
  const [state, setState] = useState<ChordState>(
    initialChord
      ? { mode: "custom", chord: initialChord }
      : { mode: "custom", chord: DEFAULT_CHORD },
  );
  const [searchTerm, setSearchTerm] = useState("");

  const currentChord: Chord = useMemo(() => {
    return state.mode === "generated"
      ? generated(state.definition, state.startingFret)
      : state.chord;
  }, [state]);

  const handlePresetChange = (preset: ChordPreset) => {
    const startingFret = preset.definition.defaultStartingFret ?? 0;
    setState({ mode: "generated", definition: preset.definition, startingFret });
  };

  const handleNoteUpdate = (index: number, updates: Partial<ChordNote>) => {
    setState((prev) => {
      const base = prev.mode === "generated"
        ? generated(prev.definition, prev.startingFret)
        : prev.chord;
      const nextChord: Chord = {
        ...base,
        notes: base.notes.map((note, i) => (i === index ? { ...note, ...updates } : note)),
      };
      return { mode: "custom", chord: nextChord };
    });
  };

  const handleStartingFretChange = (value: number) => {
    if (Number.isNaN(value)) return;
    setState((prev) => {
      if (prev.mode === "generated") {
        return { ...prev, startingFret: value };
      }
      return { mode: "custom", chord: { ...prev.chord, startingFret: Math.max(1, value) } };
    });
  };

  const handleNameChange = (name: string) => {
    setState((prev) => {
      const base = prev.mode === "generated"
        ? generated(prev.definition, prev.startingFret)
        : prev.chord;
      return { mode: "custom", chord: { ...base, name } };
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const term = searchTerm.toLowerCase();
  const filteredStandardChords = standardPresets.filter((p) =>
    getDisplayName(p.definition).toLowerCase().includes(term),
  );
  const filteredExtendedChords = extendedPresets.filter((p) =>
    getDisplayName(p.definition).toLowerCase().includes(term),
  );

  // Surface the user-facing startingFret. For generated chords this is the
  // requested minimum fret (what the user picked), not the resolved anchor.
  const startingFret =
    state.mode === "generated" ? state.startingFret : state.chord.startingFret;

  return {
    currentChord,
    startingFret,
    isGenerated: state.mode === "generated",
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handlePresetChange,
    handleNoteUpdate,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  };
}
