'use client';

import React, { useState } from 'react';
import ChordSVG from '../components/ChordSVG';
import {
  standardChords,
  extendedChords,
  Chord,
  Note,
} from '../components/chords';

const Home: React.FC = () => {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStandardChords = standardChords.filter((chord) =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredExtendedChords = extendedChords.filter((chord) =>
    chord.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Guitar Chord Tool</h1>

      <div className='mb-4'>
        <label className='mr-2'>Search Chords</label>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          className='border p-1'
        />
      </div>

      {/* Buttons to load standard chords */}
      <div className='mb-4'>
        <h2 className='text-xl font-bold'>Standard Chords</h2>
        {filteredStandardChords.map((chord, index) => (
          <button
            key={index}
            onClick={() => handleChordChange(chord)}
            className='border p-2 m-1'
          >
            {chord.name}
          </button>
        ))}
      </div>

      {/* Buttons to load extended chords */}
      <div className='mb-4'>
        <h2 className='text-xl font-bold'>Extended Chords</h2>
        {filteredExtendedChords.map((chord, index) => (
          <button
            key={index}
            onClick={() => handleChordChange(chord)}
            className='border p-2 m-1'
          >
            {chord.name}
          </button>
        ))}
      </div>

      <div className='mb-4'>
        <label className='mr-2'>Chord Name</label>
        <input
          type='text'
          value={currentChord.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className='border p-1'
        />
      </div>
      <div className='mb-4'>
        <label className='mr-2'>Starting Fret</label>
        <input
          type='number'
          value={currentChord.startingFret}
          onChange={(e) => handleStartingFretChange(e.target.value)}
          className='border p-1'
        />
      </div>
      {currentChord.notes.map((note, index) => (
        <div key={index} className='mb-2'>
          <label className='mr-2'>String {note.string + 1}</label>
          <input
            type='number'
            value={note.fret}
            onChange={(e) => handleInputChange(index, 'fret', e.target.value)}
            className='border p-1'
          />
          <label className='mr-2'>Finger</label>
          <input
            type='number'
            value={note.finger}
            onChange={(e) => handleInputChange(index, 'finger', e.target.value)}
            className='border p-1'
          />
        </div>
      ))}
      <ChordSVG
        chord={currentChord.notes}
        chordName={currentChord.name}
        startingFret={currentChord.startingFret}
      />
    </div>
  );
};

export default Home;
