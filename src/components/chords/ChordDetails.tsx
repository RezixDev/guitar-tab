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
    <div className="mb-4">
      <label htmlFor="chord-name" className="block text-sm font-medium mb-1">
        Chord Name
      </label>
      <input
        type="text"
        id="chord-name"
        value={chord.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
    <div className="mb-4">
      <label htmlFor="starting-fret" className="block text-sm font-medium mb-1">
        Starting Fret
      </label>
      <input
        type="number"
        id="starting-fret"
        value={chord.startingFret}
        onChange={(e) => onStartingFretChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
    <h3 className="text-lg font-semibold mb-2">String Details</h3>
    {chord.notes.map((note, index) => (
      <div key={index} className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label htmlFor={`string-${6-index}-fret`} className="block text-sm font-medium mb-1">
            String {6-index} Fret
          </label>
          <input
            type="number"
            id={`string-${6-index}-fret`}
            value={note.fret}
            onChange={(e) => onNoteChange(index, 'fret', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor={`string-${6-index}-finger`} className="block text-sm font-medium mb-1">
            String {6-index} Finger
          </label>
          <input
            type="number"
            id={`string-${6-index}-finger`}
            value={note.finger}
            onChange={(e) => onNoteChange(index, 'finger', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    ))}
  </div>
);

export default ChordDetails;