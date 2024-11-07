// 'use client'; directive remains the same.
'use client';
import React, { useState } from 'react';
import ChordSearch from '@/components/chords/ChordSearch';
import ChordList from '@/components/chords/ChordList';
import ChordDetails from '@/components/chords/ChordDetails';
import ChordModal from '@/components/chords/ChordModal';
import useChordState from '@/components/chords/useChordState';
import ChordSVG from '@/components/chords/ChordSVG';

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
   
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Guitar Chord Tool</h1>

        {/* Responsive layout improvements start here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column containing Chord Search and Lists */}
          <div className="md:col-span-1 flex flex-col space-y-4">
            <div className="max-w-md mx-auto">
              <ChordSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </div>
            <div className="max-w-md mx-auto">
              <ChordList
                title="Standard Chords"
                chords={filteredStandardChords}
                onChordSelect={handleChordChange}
              />
            </div>
            <div className="max-w-md mx-auto">
              <ChordList
                title="Extended Chords"
                chords={filteredExtendedChords}
                onChordSelect={handleChordChange}
              />
            </div>
          </div>

          {/* Right column containing Chord Details */}
          <div className="md:col-span-2 flex flex-col items-center">
            <button
              onClick={openModal}
              className="mt-4 w-full md:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Chord Diagram
            </button>
            <div className="w-full md:max-w-lg mt-6">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Chord Details</h2>
              <ChordDetails
                chord={currentChord}
                onNameChange={handleNameChange}
                onStartingFretChange={handleStartingFretChange}
                onNoteChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal component for displaying Chord SVG */}
      <ChordModal
        chord={currentChord}
        isOpen={isModalOpen}
        onClose={closeModal}
        ChordSVGComponent={ChordSVG}
      />
    </>
  );
}
