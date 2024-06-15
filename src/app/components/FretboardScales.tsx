import React from 'react';
import { Tuning, Note, NotePosition, getNote } from '../utils/noteUtils';

interface FretboardSVGProps {
  tuning: Tuning;
  width: number;
  height: number;
  onFretClick: (string: number, fret: number) => void;
  showNext: boolean;
  currentNote: Note;
  guessedPositions: NotePosition[];
  chordPositions: NotePosition[];
  easyMode: boolean;
}

const FretboardScales: React.FC<FretboardSVGProps> = ({
  tuning,
  width,
  height,
  onFretClick,
  showNext,
  currentNote,
  guessedPositions,
  chordPositions,
  easyMode,
}) => {
  const stringCount = 6;
  const fretCount = 12;
  const stringSpacing = height / (stringCount + 1);
  const fretSpacing = width / (fretCount + 1);

  const noteColors: { [key: string]: string } = {
    A: '#1D7669',
    'A#': '#3FB82D',
    B: '#A5E906',
    C: '#FEF200',
    'C#': '#FBC40F',
    D: '#f7c68d',
    'D#': '#F36B2C',
    E: '#C73333',
    F: '#B84098',
    'F#': '#5D25BE',
    G: '#5251EB',
    'G#': '#1767FC',
  };

  const getLuminance = (hexColor: string): number => {
    const r = parseInt(hexColor.substr(1, 2), 16) / 255;
    const g = parseInt(hexColor.substr(3, 2), 16) / 255;
    const b = parseInt(hexColor.substr(5, 2), 16) / 255;

    const a = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const getFontColor = (hexColor: string): string =>
    getLuminance(hexColor) > 0.5 ? '#000000' : '#FFFFFF';

  const renderStrings = () =>
    [...Array(stringCount)].map((_, i) => (
      <line
        key={`string-${i}`}
        x1={0}
        y1={stringSpacing * (i + 1)}
        x2={width}
        y2={stringSpacing * (i + 1)}
        stroke="black"
        strokeWidth="2"
      />
    ));

  const renderFrets = () =>
    [...Array(fretCount + 1)].map((_, i) => (
      <line
        key={`fret-${i}`}
        x1={fretSpacing * i}
        y1={0}
        x2={fretSpacing * i}
        y2={height}
        stroke="black"
        strokeWidth={i === 0 ? '4' : '2'}
      />
    ));

  const renderFretNumbers = () =>
    [...Array(fretCount)].map((_, i) => (
      <text
        key={`fret-number-${i}`}
        x={fretSpacing * (i + 1) - fretSpacing / 2}
        y={height - 10}
        textAnchor="middle"
        fontSize="12"
        fontFamily="Arial"
        fill="black"
      >
        {i + 1}
      </text>
    ));

  const renderClickableAreas = () =>
    chordPositions.map(({ string, fret, note }) => {
      const backgroundColor = easyMode ? noteColors[note] : 'transparent';
      const fontColor = getFontColor(backgroundColor);
      return (
        <g
          key={`fret-note-${string}-${fret}`}
          onClick={() => onFretClick(string, fret)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={fretSpacing * (fret + 0.5)}
            cy={stringSpacing * (string + 1)}
            r={fretSpacing / 4}
            fill={backgroundColor}
          />
          {easyMode && (
            <text
              x={fretSpacing * (fret + 0.5)}
              y={stringSpacing * (string + 1) + 4}
              textAnchor="middle"
              fontSize="10"
              fontFamily="Arial"
              fill={fontColor}
              style={{ pointerEvents: 'none' }}
            >
              {note}
            </text>
          )}
        </g>
      );
    });

  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className="border-gray-400 ml-12"
    >
      {renderStrings()}
      {renderFrets()}
      {renderFretNumbers()}
      {renderClickableAreas()}
    </svg>
  );
};

export default FretboardScales;
