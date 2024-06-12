import React from 'react';
import { Chord, Note } from './chords';

interface ChordDetailsProps {
  chord: Chord;
  onNameChange: (value: string) => void;
  onStartingFretChange: (value: string) => void;
  onNoteChange: (index: number, field: keyof Note, value: string) => void;
}

const ChordDetails: React.FC<ChordDetailsProps> = ({
  chord,
  onNameChange,
  onStartingFretChange,
  onNoteChange,
}) => (
  <div>
    <div className='mb-4'>
      <label className='mr-2'>Chord Name</label>
      <input
        type='text'
        value={chord.name}
        onChange={(e) => onNameChange(e.target.value)}
        className='border p-1'
      />
    </div>
    <div className='mb-4'>
      <label className='mr-2'>Starting Fret</label>
      <input
        type='number'
        value={chord.startingFret}
        onChange={(e) => onStartingFretChange(e.target.value)}
        className='border p-1'
      />
    </div>
    {chord.notes.map((note, index) => (
      <div key={index} className='mb-2'>
        <label className='mr-2'>String {note.string + 1}</label>
        <input
          type='number'
          value={note.fret}
          onChange={(e) => onNoteChange(index, 'fret', e.target.value)}
          className='border p-1'
        />
        <label className='mr-2'>Finger</label>
        <input
          type='number'
          value={note.finger}
          onChange={(e) => onNoteChange(index, 'finger', e.target.value)}
          className='border p-1'
        />
      </div>
    ))}
  </div>
);

export default ChordDetails;
