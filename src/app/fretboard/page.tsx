'use client';

import React, { useState, useEffect } from 'react';

const standardTuning = ['E', 'B', 'G', 'D', 'A', 'E'];
const halfStepDownTuning = ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'];

const fretNotes = [
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
  ['B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#'],
  ['G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#'],
  ['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#'],
  ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
  ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'],
];

const chords = {
  'C Major': ['C', 'E', 'G'],
  'G Major': ['G', 'B', 'D'],
  'D Major': ['D', 'F#', 'A'],
  'A Major': ['A', 'C#', 'E'],
  'E Major': ['E', 'G#', 'B'],
  'F Major': ['F', 'A', 'C'],
  'B Major': ['B', 'D#', 'F#'],
};

const getNoteIndex = (note) => {
  for (let i = 0; i < fretNotes.length; i++) {
    for (let j = 0; j < fretNotes[i].length; j++) {
      if (fretNotes[i][j] === note) {
        return { string: i, fret: j };
      }
    }
  }
  return { string: 0, fret: 0 };
};

const getNote = (string, fret, tuning) => {
  const noteIndex = getNoteIndex(tuning[string]);
  return fretNotes[noteIndex.string][(noteIndex.fret + fret + 1) % 12];
};

const generateRandomNote = (tuning) => {
  const string = Math.floor(Math.random() * 6);
  const fret = Math.floor(Math.random() * 12);
  return { string, fret, note: getNote(string, fret, tuning) };
};

const getAllNotePositions = (note, tuning) => {
  const positions = [];
  for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
    for (let fretIndex = 0; fretIndex < fretNotes[0].length; fretIndex++) {
      if (getNote(stringIndex, fretIndex, tuning) === note) {
        positions.push({ string: stringIndex, fret: fretIndex });
      }
    }
  }
  return positions;
};

const getChordPositions = (chord, tuning) => {
  const positions = [];
  chords[chord].forEach((note) => {
    positions.push(...getAllNotePositions(note, tuning));
  });
  return positions;
};

const Fretboard = () => {
  const [tuning, setTuning] = useState(standardTuning);
  const [currentNote, setCurrentNote] = useState(
    generateRandomNote(standardTuning)
  );
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [easyMode, setEasyMode] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [guessedPositions, setGuessedPositions] = useState([]);
  const [selectedChord, setSelectedChord] = useState('');

  const width = 900;
  const height = 300;
  const stringCount = 6;
  const fretCount = 12;
  const stringSpacing = height / (stringCount + 1);
  const fretSpacing = width / (fretCount + 1);

  useEffect(() => {
    setCurrentNote(generateRandomNote(tuning));
  }, [tuning]);

  useEffect(() => {
    if (hardMode) {
      setGuessedPositions([]);
    }
  }, [hardMode, currentNote]);

  const handleTuningChange = (event) => {
    const selectedTuning = event.target.value;
    if (selectedTuning === 'standard') {
      setTuning(standardTuning);
    } else if (selectedTuning === 'halfStepDown') {
      setTuning(halfStepDownTuning);
    }
  };

  const handleFretClick = (string, fret) => {
    const correctPositions = getAllNotePositions(currentNote.note, tuning);
    const isCorrect = correctPositions.some(
      (position) => position.string === string && position.fret === fret
    );

    if (isCorrect) {
      setGuessedPositions([...guessedPositions, { string, fret }]);
      setPoints(points + 1);
      setFeedback('Correct!');

      if (hardMode) {
        const remainingPositions = correctPositions.filter(
          (position) =>
            !guessedPositions.some(
              (guessed) =>
                guessed.string === position.string &&
                guessed.fret === position.fret
            )
        );
        if (remainingPositions.length === 1) {
          setShowNext(true);
        }
      } else {
        setShowNext(true);
      }
    } else {
      setFeedback(
        `Incorrect. Try again! You clicked on String ${string + 1}, Fret ${
          fret + 1
        }.`
      );
    }
  };

  const handleNextClick = () => {
    setCurrentNote(generateRandomNote(tuning));
    setFeedback('');
    setShowNext(false);
    setGuessedPositions([]);
  };

  const handleChordChange = (event) => {
    setSelectedChord(event.target.value);
  };

  const chordPositions = selectedChord
    ? getChordPositions(selectedChord, tuning)
    : [];

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Fretboard Guessing Game</h1>
      <div className='mb-4'>
        <label htmlFor='tuning' className='mr-2'>
          Select Tuning:
        </label>
        <select
          id='tuning'
          onChange={handleTuningChange}
          className='border border-gray-400 p-2'
        >
          <option value='standard'>Standard</option>
          <option value='halfStepDown'>Half Step Down</option>
        </select>
      </div>
      <div className='mb-4'>
        <label htmlFor='chord' className='mr-2'>
          Select Chord:
        </label>
        <select
          id='chord'
          onChange={handleChordChange}
          className='border border-gray-400 p-2'
        >
          <option value=''>None</option>
          {Object.keys(chords).map((chord) => (
            <option key={chord} value={chord}>
              {chord}
            </option>
          ))}
        </select>
      </div>
      <div className='mb-4'>
        <label htmlFor='easyMode' className='mr-2'>
          Easy Mode:
        </label>
        <input
          type='checkbox'
          id='easyMode'
          checked={easyMode}
          onChange={() => setEasyMode(!easyMode)}
          className='mr-2'
        />
        <span>Show All Notes</span>
      </div>
      <div className='mb-4'>
        <label htmlFor='hardMode' className='mr-2'>
          Hard Mode:
        </label>
        <input
          type='checkbox'
          id='hardMode'
          checked={hardMode}
          onChange={() => setHardMode(!hardMode)}
          className='mr-2'
        />
        <span>Guess All Positions</span>
      </div>
      <div className='mb-4'>
        <p>Guess the note: {currentNote.note}</p>
      </div>
      {feedback && <p>{feedback}</p>}
      <div className='mb-4'>
        <p>Points: {points}</p>
      </div>
      {showNext && (
        <button
          onClick={handleNextClick}
          className='bg-blue-500 text-white p-2 rounded'
        >
          Next
        </button>
      )}
      <div className='relative'>
        <div
          className='absolute left-0 top-0 h-full flex flex-col justify-center pr-2'
          style={{ gap: `${20}px` }}
        >
          {[...Array(stringCount)].map((_, i) => (
            <div key={`string-name-${i}`} className='text-14 font-Arial'>
              {tuning[i]}
            </div>
          ))}
        </div>
        <svg
          width={width}
          height={height}
          xmlns='http://www.w3.org/2000/svg'
          className='border border-gray-400 ml-12'
        >
          {/* Draw strings */}
          {[...Array(stringCount)].map((_, i) => (
            <line
              key={`string-${i}`}
              x1={0}
              y1={stringSpacing * (i + 1)}
              x2={width}
              y2={stringSpacing * (i + 1)}
              stroke='black'
              strokeWidth='2'
            />
          ))}

          {/* Draw frets */}
          {[...Array(fretCount + 1)].map((_, i) => (
            <line
              key={`fret-${i}`}
              x1={fretSpacing * i}
              y1={0}
              x2={fretSpacing * i}
              y2={height}
              stroke='black'
              strokeWidth={i === 0 ? '4' : '2'}
            />
          ))}

          {/* Draw fret numbers */}
          {[...Array(fretCount)].map((_, i) => (
            <text
              key={`fret-number-${i}`}
              x={fretSpacing * (i + 1) - fretSpacing / 2}
              y={height - 10}
              textAnchor='middle'
              fontSize='12'
              fontFamily='Arial'
              fill='black'
            >
              {i + 1}
            </text>
          ))}

          {/* Clickable areas for guessing */}
          {[...Array(stringCount)].map((_, stringIndex) =>
            [...Array(fretCount)].map((_, fretIndex) => (
              <g
                key={`fret-note-${stringIndex}-${fretIndex}`}
                onClick={() => handleFretClick(stringIndex, fretIndex)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={fretSpacing * fretIndex}
                  y={stringSpacing * stringIndex}
                  width={fretSpacing}
                  height={stringSpacing}
                  fill='transparent'
                />
                <text
                  x={fretSpacing * fretIndex + fretSpacing / 2}
                  y={stringSpacing * (stringIndex + 1) + 4}
                  textAnchor='middle'
                  fontSize='10'
                  fontFamily='Arial'
                  fill='black'
                >
                  {getNote(stringIndex, fretIndex, tuning)}
                </text>
              </g>
            ))
          )}

          {/* Show the correct note when guessed */}
          {showNext && (
            <circle
              cx={fretSpacing * (currentNote.fret + 1) - fretSpacing / 2}
              cy={stringSpacing * (currentNote.string + 1)}
              r={12}
              fill='lightblue'
              stroke='black'
              strokeWidth='1'
            />
          )}
          {showNext && (
            <text
              x={fretSpacing * (currentNote.fret + 1) - fretSpacing / 2}
              y={stringSpacing * (currentNote.string + 1) + 4}
              textAnchor='middle'
              fontSize='10'
              fontFamily='Arial'
              fill='black'
            >
              {currentNote.note}
            </text>
          )}

          {/* Show all notes of the selected chord */}
          {selectedChord &&
            chordPositions.map(({ string, fret }) => (
              <g key={`chord-note-${string}-${fret}`}>
                <circle
                  cx={fretSpacing * (fret + 1) - fretSpacing / 2}
                  cy={stringSpacing * (string + 1)}
                  r={12}
                  fill='lightgreen'
                  stroke='black'
                  strokeWidth='1'
                />
                <text
                  x={fretSpacing * (fret + 1) - fretSpacing / 2}
                  y={stringSpacing * (string + 1) + 4}
                  textAnchor='middle'
                  fontSize='10'
                  fontFamily='Arial'
                  fill='black'
                >
                  {getNote(string, fret, tuning)}
                </text>
              </g>
            ))}
        </svg>
      </div>
    </div>
  );
};

export default Fretboard;
