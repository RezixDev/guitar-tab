'use client';
import { useState } from 'react';

import { FretboardScales } from './FretboardScales';
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
  calculateNote,
  getScaleNotes,
  notes as NOTES
} from '@/utils/noteUtils';

const SCALES = {
  Major: majorScale,
  Minor: minorScale,
  'Major Pentatonic': majorPentatonicScale,
  'Minor Pentatonic': minorPentatonicScale,
  Blues: bluesScale,
} as const;

type ScaleSelectorProps = {
  selectedScale: string;
  handleScaleChange: (scale: string) => void;
}

type GroundNoteSelectorProps = {
  groundNote: string;
  handleGroundNoteChange: (note: string) => void;
}

const ScaleSelector = ({
  selectedScale,
  handleScaleChange,
}: ScaleSelectorProps) => {

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Select Scale</h2>
      <div className="flex flex-wrap gap-2">
        {Object.keys(SCALES).map((scale) => (
          <button
            key={scale}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedScale === scale
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
              }`}
            onClick={() => handleScaleChange(scale)}
          >
            {scale}
          </button>
        ))}
      </div>
    </div>
  );
};

const GroundNoteSelector = ({
  groundNote,
  handleGroundNoteChange,
}: GroundNoteSelectorProps) => {

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Select Root Note</h2>
      <div className="flex flex-wrap gap-2">
        {NOTES.map((note) => (
          <button
            key={note}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${groundNote === note
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
              }`}
            onClick={() => handleGroundNoteChange(note)}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ScaleViewer = ({
  tuning = standardTuning,
  width,
  height,
}: {
  tuning?: Tuning;
  width: number;
  height: number;
}) => {
  const [guessedPositions, setGuessedPositions] = useState<NotePosition[]>([]);
  const [selectedScale, setSelectedScale] = useState<string>('Major');
  const [groundNote, setGroundNote] = useState<string>('C');

  const handleFretClick = (visualString: number, fret: number) => {
    const clickedPosition = {
      string: visualString,
      fret,
      note: calculateNote(visualString, fret, tuning)
    };
    setGuessedPositions([...guessedPositions, clickedPosition]);
  };

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
    setGuessedPositions([]);
  };

  const handleGroundNoteChange = (note: string) => {
    setGroundNote(note);
    setGuessedPositions([]);
  };

  const scaleType = selectedScale as keyof typeof SCALES;
  const scaleIntervals = SCALES[scaleType];
  const scaleNotes = getScaleNotes(groundNote, scaleIntervals ? [...scaleIntervals] : []);
  const scalePositions = scaleNotes.flatMap(note => getAllNotePositions(note, tuning));

  return (
    <div className="scale-viewer rounded-xl p-6 border bg-card text-card-foreground">
      <div className="mb-8 space-y-6 sm:space-y-0 sm:flex sm:justify-between sm:items-start">
        <ScaleSelector
          selectedScale={selectedScale}
          handleScaleChange={handleScaleChange}
        />
        <GroundNoteSelector
          groundNote={groundNote}
          handleGroundNoteChange={handleGroundNoteChange}
        />
      </div>
      <div className="overflow-x-auto rounded-lg bg-muted p-4">
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