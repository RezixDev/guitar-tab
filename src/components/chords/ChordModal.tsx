import React from 'react';
import { Chord } from './chords';

interface ChordModalProps {
  chord: Chord;
  isOpen: boolean;
  onClose: () => void;
  ChordSVGComponent: React.ComponentType<{
    chord: Chord['notes'];
    chordName: string;
    startingFret: number;
  }>;
}

const ChordModal: React.FC<ChordModalProps> = ({ chord, isOpen, onClose, ChordSVGComponent }) => {
  if (!isOpen) return null;

  const chordNotes = chord.notes
    .map((note, index) => `String ${6 - index}: Fret ${note.fret}`)
    .reverse();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{chord.name} Chord</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <ChordSVGComponent
            chord={chord.notes}
            chordName={chord.name}
            startingFret={chord.startingFret}
          />
        </div>
        <div className="text-center">
          <strong className="block mb-2">Notes:</strong>
          <p className="text-lg">{chordNotes.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default ChordModal;