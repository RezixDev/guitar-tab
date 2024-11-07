import React from 'react';
import { Tuning, Note, NotePosition } from '@/utils/noteUtils';

interface BaseFretboardProps {
  tuning: Tuning;
  width: number;
  height: number;
  onFretClick: (string: number, fret: number) => void;
  renderNotes: (stringSpacing: number, fretSpacing: number) => React.ReactNode;
}

export const BaseFretboard: React.FC<BaseFretboardProps> = ({
  tuning,
  width,
  height,
  onFretClick,
  renderNotes,
}) => {
  const stringCount = 6;
  const fretCount = 12;
  const stringSpacing = height / (stringCount + 1);
  const fretSpacing = width / (fretCount + 1);

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
        strokeWidth={i === 0 ? "4" : "2"}
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

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="border border-gray-300 rounded-lg shadow-md"
      >
        <g transform={`translate(40, 0)`}>
          {renderStrings()}
          {renderFrets()}
          {renderFretNumbers()}
          {renderNotes(stringSpacing, fretSpacing)}
        </g>
        <g>
          {tuning.map((note, index) => (
            <text
              key={`string-name-${index}`}
              x="20"
              y={stringSpacing * (index + 1) + 5}
              textAnchor="middle"
              fontSize="12"
              fontFamily="Arial"
              fill="black"
            >
              {note}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};
