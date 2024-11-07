'use client';
import React, { useState } from 'react';
import { useTheme } from 'next-themes';
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
} from '../utils/noteUtils';

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const SCALES = {
  Major: majorScale,
  Minor: minorScale,
  'Major Pentatonic': majorPentatonicScale,
  'Minor Pentatonic': minorPentatonicScale,
  Blues: bluesScale,
} as const;

// Korrekte Saitenreihenfolge (von oben nach unten)
const STRING_ORDER = [
  'E', // High E
  'B',
  'G',
  'D',
  'A',
  'E'  // Low E
] as const;

interface ScaleSelectorProps {
  selectedScale: string;
  handleScaleChange: (scale: string) => void;
}

interface GroundNoteSelectorProps {
  groundNote: string;
  handleGroundNoteChange: (note: string) => void;
}

const ScaleSelector = ({
  selectedScale,
  handleScaleChange,
}: ScaleSelectorProps) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Select Scale</h2>
      <div className="flex flex-wrap gap-2">
        {Object.keys(SCALES).map((scale) => (
          <button
            key={scale}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedScale === scale
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
  const { theme } = useTheme();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Select Root Note</h2>
      <div className="flex flex-wrap gap-2">
        {NOTES.map((note) => (
          <button
            key={note}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              groundNote === note
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
  const { theme } = useTheme();

  // Hilfsfunktion zum Finden aller Positionen einer Note auf dem Griffbrett
  const findNotePositions = (targetNote: string): NotePosition[] => {
    const positions: NotePosition[] = [];
    
    // Iteriere über alle Saiten
    for (let string = 0; string < 6; string++) {
      const openNote = STRING_ORDER[string];
      const openNoteIndex = NOTES.indexOf(openNote);
      
      // Überprüfe die ersten 12 Bünde
      for (let fret = 0; fret <= 12; fret++) {
        const noteIndex = (openNoteIndex  + 1 + fret) % 12;
        const currentNote = NOTES[noteIndex];
        
        if (currentNote === targetNote) {
          positions.push({
            string,
            fret,
            note: targetNote
          });
        }
      }
    }
    
    return positions;
  };

  const handleFretClick = (visualString: number, fret: number) => {
    const clickedPosition = { 
      string: visualString,
      fret, 
      note: calculateNoteAtPosition(visualString, fret)
    };
    setGuessedPositions([...guessedPositions, clickedPosition]);
  };

  const calculateNoteAtPosition = (string: number, fret: number): string => {
    const stringNote = STRING_ORDER[string];
    const noteIndex = NOTES.indexOf(stringNote);
    return NOTES[(noteIndex + fret) % 12];
  };

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
    setGuessedPositions([]);
  };

  const handleGroundNoteChange = (note: string) => {
    setGroundNote(note);
    setGuessedPositions([]);
  };

  const calculateScaleNotes = (): string[] => {
    const scaleType = selectedScale as keyof typeof SCALES;
    const scale = SCALES[scaleType];
    if (!scale) return [];
    
    const rootIndex = NOTES.indexOf(groundNote);
    return scale.map((interval) => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
    });
  };

  const scaleNotes = calculateScaleNotes();
  const scalePositions = scaleNotes.flatMap(note => findNotePositions(note));

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
          tuning={STRING_ORDER as unknown as Tuning}
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