import React from 'react';
import { Chord } from './chords';

interface ChordListProps {
  title: string;
  chords: Chord[];
  onChordSelect: (chord: Chord) => void;
}

const ChordList: React.FC<ChordListProps> = ({
  title,
  chords,
  onChordSelect,
}) => (
  <div className='mb-4'>
    <h2 className='text-xl font-bold'>{title}</h2>
    {chords.map((chord, index) => (
      <button
        key={index}
        onClick={() => onChordSelect(chord)}
        className='border p-2 m-1'
      >
        {chord.name}
      </button>
    ))}
  </div>
);

export default ChordList;
