import React from 'react';
import { Chord } from './chords';

interface ChordListProps {
  title: string;
  chords: Chord[];
  onChordSelect: (chord: Chord) => void;
}

const ChordList: React.FC<ChordListProps> = ({ title, chords, onChordSelect }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold mb-3">{title}</h2>
    <div className="flex flex-wrap gap-2">
      {chords.map((chord, index) => (
        <button
          key={index}
          onClick={() => onChordSelect(chord)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          {chord.name}
        </button>
      ))}
    </div>
  </div>
);

export default ChordList;