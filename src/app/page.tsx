'use client';

import { useState } from 'react';
import { ChordSearch } from '@/components/chords/ChordSearch';
import { ChordList } from '@/components/chords/ChordList';
import { ChordDetails } from '@/components/chords/ChordDetails';
import { ChordModal } from '@/components/chords/ChordModal';
import { useChordState } from '@/hooks/useChordState';
import { ChordSVG } from '@/components/chords/ChordSVG';

export const Page = () => {
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

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Guitar Chord Tool</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          <div className="md:col-span-2 flex flex-col items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full md:w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Chord Diagram
            </button>
            <div className="w-full md:max-w-lg mt-6">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
                Chord Details
              </h2>
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

      <ChordModal
        chord={currentChord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ChordSVGComponent={ChordSVG}
      />
    </>
  );
}

export default Page;