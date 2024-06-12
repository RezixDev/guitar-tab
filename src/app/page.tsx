'use client';
import React from 'react';
import ChordSVG from './components/ChordSVG';
import ChordSearch from './components/ChordSearch';
import ChordList from './components/ChordList';
import ChordDetails from './components/ChordDetails';
import useChordState from './components/useChordState';

export default function Page() {
  const {
    currentChord,
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handleChordChange,
    handleInputChange,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  } = useChordState();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Guitar Chord Tool</h1>
      <ChordSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      <ChordList
        title='Standard Chords'
        chords={filteredStandardChords}
        onChordSelect={handleChordChange}
      />
      <ChordList
        title='Extended Chords'
        chords={filteredExtendedChords}
        onChordSelect={handleChordChange}
      />
      <ChordDetails
        chord={currentChord}
        onNameChange={handleNameChange}
        onStartingFretChange={handleStartingFretChange}
        onNoteChange={handleInputChange}
      />
      <ChordSVG
        chord={currentChord.notes}
        chordName={currentChord.name}
        startingFret={currentChord.startingFret}
      />
    </div>
  );
}
