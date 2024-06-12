'use client';
import { useState, ChangeEvent } from 'react';
import { standardChords, extendedChords, Chord, Note } from './chords';

const useChordState = () => {
  const [currentChord, setCurrentChord] = useState<Chord>(standardChords[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChordChange = (chord: Chord) => {
    setCurrentChord(chord);
  };

  const handleInputChange = (
    index: number,
    field: keyof Note,
    value: string
  ) => {
    const newChord = { ...currentChord };
    newChord.notes[index][field] = parseInt(value, 10);
    setCurrentChord(newChord);
  };

  const handleNameChange = (value: string) => {
    const newChord = { ...currentChord, name: value };
    setCurrentChord(newChord);
  };

  const handleStartingFretChange = (value: string) => {
    const newChord = { ...currentChord, startingFret: parseInt(value, 10) };
    setCurrentChord(newChord);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStandardChords = standardChords.filter((chord) =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredExtendedChords = extendedChords.filter((chord) =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    currentChord,
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handleChordChange,
    handleInputChange,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  };
};

export default useChordState;
