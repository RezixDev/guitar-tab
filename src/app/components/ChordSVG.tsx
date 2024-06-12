'use client';

import React from 'react';
/* import AudioPlayer from './AudioPlayer'; */

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

const stringNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
const fretNotes = [
  ['E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3'],
  ['A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3'],
  ['D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4'],
  ['G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4'],
  ['B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4'],
  ['E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5'],
];

const getNote = (string: number, fret: number): string => {
  if (fret === 0) return stringNotes[string];
  return fretNotes[string][
    (fretNotes[string].indexOf(stringNotes[string]) + fret) % 12
  ];
};

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
  // Calculate the notes for the chord
  const chordNotes = chord
    .map((note) => getNote(note.string, note.fret + (startingFret - 1)))
    .reverse(); // Reverse the order of the notes

  return (
    <div>
      {generateChordSVG(chord, chordName, startingFret)}
      <div className='mt-2'>
        <strong>Notes: </strong>
        {chordNotes.join(', ')}
        {/*     <AudioPlayer notes={chordNotes} />
        <button onClick={() => window.playChord()} className='border p-2 m-1'>
          Play
        </button> */}
      </div>
    </div>
  );
};

export default ChordSVG;
