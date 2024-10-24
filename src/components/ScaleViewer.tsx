'use client';
import React, { useState } from 'react';
import FretboardScales from './FretboardScales';
import {
  Tuning,
  standardTuning,
  NotePosition,
  getAllNotePositions,
  majorScale,
  minorScale,
  majorPentatonicScale,
  minorPentatonicScale,
  bluesScale,
  fretNotes,
  getNote,
} from '../utils/noteUtils';

interface ScaleViewerProps {
  tuning?: Tuning;
  width: number;
  height: number;
}

const scales: { [key: string]: string[] } = {
  Major: majorScale,
  Minor: minorScale,
  'Major Pentatonic': majorPentatonicScale,
  'Minor Pentatonic': minorPentatonicScale,
  Blues: bluesScale,
};

const ScaleViewer: React.FC<ScaleViewerProps> = ({
  tuning = standardTuning,
  width,
  height,
}) => {
  const [guessedPositions, setGuessedPositions] = useState<NotePosition[]>([]);
  const [selectedScale, setSelectedScale] = useState<string>('Major');
  const [groundNote, setGroundNote] = useState<string>('C');

  const handleFretClick = (string: number, fret: number) => {
    const note = getNote(string, fret, tuning);
    setGuessedPositions([...guessedPositions, { string, fret, note }]);
  };

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
  };

  const handleGroundNoteChange = (note: string) => {
    setGroundNote(note);
  };

  const calculateScaleNotes = (): string[] => {
    const scale = scales[selectedScale];
    const rootIndex = fretNotes[0].indexOf(groundNote);
    return scale.map((note) => {
      const noteIndex = (rootIndex + fretNotes[0].indexOf(note) - fretNotes[0].indexOf(scale[0]) + 12) % 12;
      return fretNotes[0][noteIndex];
    });
  };

  const scaleNotes = calculateScaleNotes();
  const scalePositions = scaleNotes.flatMap((note) =>
    getAllNotePositions(note, tuning)
  );

  return (
    <div className="scale-viewer">
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:justify-between sm:items-start">
        <ScaleSelector
          selectedScale={selectedScale}
          handleScaleChange={handleScaleChange}
        />
        <GroundNoteSelector
          groundNote={groundNote}
          handleGroundNoteChange={handleGroundNoteChange}
        />
      </div>
      <div className="overflow-x-auto">
      <FretboardScales
        tuning={tuning}
        width={width}
        height={height}
        onFretClick={handleFretClick}
        showNext={false}
        currentNote={{ string: 0, fret: 0, note: '' }}
        guessedPositions={guessedPositions}
        chordPositions={scalePositions}
        easyMode={true}
      />
      </div>
    </div>
  );
};

interface ScaleSelectorProps {
  selectedScale: string;
  handleScaleChange: (scale: string) => void;
}

const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  selectedScale,
  handleScaleChange,
}) => (
  <div className="space-y-2">
    <h2 className="text-lg font-bold text-gray-800">Select Scale</h2>
    <div className="flex flex-wrap gap-2">
    {Object.keys(scales).map((scale) => (
      <button
        key={scale}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedScale === scale
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
        onClick={() => handleScaleChange(scale)}
      >
        {scale}
      </button>
    ))}
    </div>
  </div>
);

interface GroundNoteSelectorProps {
  groundNote: string;
  handleGroundNoteChange: (note: string) => void;
}

const GroundNoteSelector: React.FC<GroundNoteSelectorProps> = ({
  groundNote,
  handleGroundNoteChange,
}) => (
  <div className="space-y-2">
    <h2 className="text-lg font-bold text-gray-800">Select Root Note</h2>
    <div className="flex flex-wrap gap-2">
    {fretNotes[0].map((note) => (
      <button
        key={note}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
            groundNote === note
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
        onClick={() => handleGroundNoteChange(note)}
      >
        {note}
      </button>
    ))}
    </div>
  </div>
);

export default ScaleViewer;
