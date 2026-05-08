import { useState, type ChangeEvent } from "react";
import type { Chord, ChordNote } from "@shared/types/chord";
import { standardChords, extendedChords } from "../data/chords";

const DEFAULT_CHORD: Chord = {
  name: "",
  startingFret: 1,
  notes: Array(6)
    .fill(null)
    .map(() => ({ fret: null, finger: null })),
};

export function useChordState(initialChord?: Chord) {
  const [currentChord, setCurrentChord] = useState<Chord>(initialChord ?? DEFAULT_CHORD);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNoteUpdate = (index: number, updates: Partial<ChordNote>) => {
    setCurrentChord((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) => (i === index ? { ...note, ...updates } : note)),
    }));
  };

  const handleStartingFretChange = (value: number) => {
    if (!Number.isNaN(value)) {
      setCurrentChord((prev) => ({ ...prev, startingFret: value }));
    }
  };

  const handleChordChange = (chord: Chord) => setCurrentChord(chord);
  const handleNameChange = (name: string) => setCurrentChord((prev) => ({ ...prev, name }));

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const term = searchTerm.toLowerCase();
  const filteredStandardChords = standardChords.filter((c) => c.name.toLowerCase().includes(term));
  const filteredExtendedChords = extendedChords.filter((c) => c.name.toLowerCase().includes(term));

  return {
    currentChord,
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handleChordChange,
    handleNoteUpdate,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  };
}
