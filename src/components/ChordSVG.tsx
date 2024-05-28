'use client';

import React from 'react';
import * as Tone from 'tone';

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

  const samples = {
    A2: 'samples/A2.mp3',
    'A#2': 'samples/A#2.mp3',
    B2: 'samples/B2.mp3',
    C3: 'samples/C3.mp3',
    'C#3': 'samples/C#3.mp3',
    D3: 'samples/D3.mp3',
    'D#3': 'samples/D#3.mp3',
    E3: 'samples/E3.mp3',
    F3: 'samples/F3.mp3',
    'F#3': 'samples/F#3.mp3',
    G3: 'samples/G3.mp3',
    'G#3': 'samples/G#3.mp3',
    A3: 'samples/A3.mp3',
    'A#3': 'samples/A#3.mp3',
    B3: 'samples/B3.mp3',
    C4: 'samples/C4.mp3',
    'C#4': 'samples/C#4.mp3',
    D4: 'samples/D4.mp3',
    'D#4': 'samples/D#4.mp3',
    E4: 'samples/E4.mp3',
    F4: 'samples/F4.mp3',
    'F#4': 'samples/F#4.mp3',
    G4: 'samples/G4.mp3',
    'G#4': 'samples/G#4.mp3',
    A4: 'samples/A4.mp3',
    'A#4': 'samples/A#4.mp3',
    B4: 'samples/B4.mp3',
    C5: 'samples/C5.mp3',
    'C#5': 'samples/C#5.mp3',
    D5: 'samples/D5.mp3',
    'D#5': 'samples/D#5.mp3',
  };

  const sampler = new Tone.Sampler(samples, () => {
    console.log('Sampler loaded');
  }).toDestination();

  const playChord = () => {
    chordNotes.forEach((note, index) => {
      sampler.triggerAttackRelease(note, '8n', Tone.now() + index * 0.1);
    });
  };

  return (
    <div>
      {generateChordSVG(chord, chordName, startingFret)}
      <div className='mt-2'>
        <strong>Notes: </strong>
        {chordNotes.join(', ')}
        <button onClick={playChord} className='border p-2 m-1'>
          Play
        </button>
      </div>
    </div>
  );
};

export default ChordSVG;
