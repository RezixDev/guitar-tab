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
    <div className="scale-viewer p-4">
      <div className="flex mb-4">
        <ScaleSelector
          selectedScale={selectedScale}
          handleScaleChange={handleScaleChange}
        />
        <GroundNoteSelector
          groundNote={groundNote}
          handleGroundNoteChange={handleGroundNoteChange}
        />
      </div>
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
  <div className="mr-4">
    <h2 className="text-lg font-bold">Select Scale</h2>
    {Object.keys(scales).map((scale) => (
      <button
        key={scale}
        className={`px-2 py-1 m-1 ${
          selectedScale === scale ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => handleScaleChange(scale)}
      >
        {scale}
      </button>
    ))}
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
  <div>
    <h2 className="text-lg font-bold">Select Ground Note</h2>
    {fretNotes[0].map((note) => (
      <button
        key={note}
        className={`px-2 py-1 m-1 ${
          groundNote === note ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        onClick={() => handleGroundNoteChange(note)}
      >
        {note}
      </button>
    ))}
  </div>
);

export default ScaleViewer;
