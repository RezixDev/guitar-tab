'use client';

import React from 'react';

type Note = {
  string: number;
  fret: number;
  finger: number;
};

interface ChordSVGProps {
  chord: Note[];
  chordName: string;
  startingFret: number;
}

const generateChordSVG = (
  chord: Note[],
  chordName: string,
  startingFret: number
) => {
  const width = 110;
  const height = 140;
  const stringSpacing = width / 6;
  const fretSpacing = height / 5;
  const textMargin = 50; // Margin between text and chord diagram
  const leftMargin = 20; // Margin for fret numbers
  const rightMargin = 20; // Additional margin for fret numbers on the right
  const topMargin = 10; // Margin for string names
  const fretLineWidth = width - 20;

  // Reverse the order of string names
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
  const strings = [0, 1, 2, 3, 4, 5];
  const frets = [0, 1, 2, 3, 4];

  return (
    <svg
      width={width + leftMargin + rightMargin + 10}
      height={height + textMargin + 30}
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* Draw chord name */}
      <text
        x='50%'
        y={textMargin / 2}
        textAnchor='middle'
        fontSize='14'
        fontFamily='Arial'
        fontWeight='bold'
        fill='black'
      >
        {chordName}
      </text>

      {/* Draw string names below chord name */}
      {strings.map((string, i) => (
        <text
          key={i}
          x={stringSpacing * (i + 1) + leftMargin}
          y={textMargin}
          textAnchor='middle'
          fontSize='12'
          fontFamily='Arial'
          fill='black'
        >
          {stringNames[i]}
        </text>
      ))}

      {/* Draw strings */}
      {strings.map((string, i) => (
        <line
          key={i}
          x1={stringSpacing * (i + 1) + leftMargin}
          y1={textMargin + topMargin}
          x2={stringSpacing * (i + 1) + leftMargin}
          y2={height + textMargin}
          stroke='black'
        />
      ))}

      {/* Draw frets */}
      {frets.map((fret, i) => (
        <line
          key={i}
          x1={leftMargin + 20} // Adjusted start point
          y1={fretSpacing * i + textMargin + topMargin}
          x2={leftMargin + fretLineWidth + 20} // Adjusted end point
          y2={fretSpacing * i + textMargin + topMargin}
          stroke='black'
        />
      ))}

      {/* Draw fret numbers on the right side */}
      {frets.map((fret, i) => (
        <text
          key={i}
          x={width + leftMargin + 10} // Positioned on the right side
          y={fretSpacing * i + textMargin + topMargin + fretSpacing / 2 + 3}
          textAnchor='middle'
          fontSize='10'
          fontFamily='Arial'
          fill='black'
        >
          {startingFret + i}
        </text>
      ))}

      {/* Draw chord notes with finger numbers */}
      {chord.map(
        (note, i) =>
          note.fret > 0 && (
            <g key={i}>
              <circle
                cx={stringSpacing * (note.string + 1) + leftMargin}
                cy={
                  fretSpacing * (note.fret - startingFret + 1) +
                  textMargin +
                  topMargin -
                  fretSpacing / 2
                }
                r={8}
                fill='blue'
              />
              <text
                x={stringSpacing * (note.string + 1) + leftMargin}
                y={
                  fretSpacing * (note.fret - startingFret + 1) +
                  textMargin +
                  topMargin -
                  fretSpacing / 2 +
                  3
                }
                textAnchor='middle'
                fontSize='10'
                fontFamily='Arial'
                fill='white'
                fontWeight='bold'
              >
                {note.finger}
              </text>
            </g>
          )
      )}
    </svg>
  );
};

const ChordSVG: React.FC<ChordSVGProps> = ({
  chord,
  chordName,
  startingFret,
}) => {
  return <div>{generateChordSVG(chord, chordName, startingFret)}</div>;
};

export default ChordSVG;
