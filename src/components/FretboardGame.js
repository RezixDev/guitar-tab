'use client';

import React, { useState, useEffect, useMemo } from 'react';
import FretboardSVG from './FretboardSVG';
import {
  standardTuning,
  halfStepDownTuning,
  dropDTuning, // Import Drop D tuning
  generateRandomNote,
  getAllNotePositions,
  getChordPositions,
  chords,
} from '../utils/noteUtils';

const TuningSelector = ({ onChange }) => (
  <div className='mb-4'>
    <label htmlFor='tuning' className='mr-2'>
      Select Tuning:
    </label>
    <select id='tuning' onChange={onChange} className='border border-gray-400 p-2'>
      <option value='standard'>Standard</option>
      <option value='halfStepDown'>Half Step Down</option>
      <option value='dropD'>Drop D</option> {/* Add Drop D option */}
    </select>
  </div>
);

const ChordSelector = ({ onChange }) => (
  <div className='mb-4'>
    <label htmlFor='chord' className='mr-2'>
      Select Chord:
    </label>
    <select id='chord' onChange={onChange} className='border border-gray-400 p-2'>
      <option value=''>None</option>
      {Object.keys(chords).map((chord) => (
        <option key={chord} value={chord}>
          {chord}
        </option>
      ))}
    </select>
  </div>
);

const ModeToggle = ({ label, checked, onChange }) => (
  <div className='mb-4'>
    <label htmlFor={label} className='mr-2'>
      {label}:
    </label>
    <input
      type='checkbox'
      id={label}
      checked={checked}
      onChange={onChange}
      className='mr-2'
    />
    <span>
      {label === 'newbieMode'
        ? 'Show All Notes'
        : label === 'easyMode'
        ? 'Guess One Position'
        : 'Guess All Positions'}
    </span>
  </div>
);

const FretboardGame = () => {
  const [tuning, setTuning] = useState(standardTuning);
  const [currentNote, setCurrentNote] = useState(generateRandomNote(standardTuning));
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [newbieMode, setNewbieMode] = useState(true);
  const [easyMode, setEasyMode] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [guessedPositions, setGuessedPositions] = useState([]);
  const [selectedChord, setSelectedChord] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeChallenge, setTimeChallenge] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const width = 900;
  const height = 300;

  useEffect(() => {
    setCurrentNote(generateRandomNote(tuning));
  }, [tuning]);

  useEffect(() => {
    if (hardMode) {
      setGuessedPositions([]);
    }
  }, [hardMode, currentNote, tuning]);

  useEffect(() => {
    let interval;
    if (timeChallenge) {
      interval = setInterval(() => {
        setElapsedTime(((Date.now() - startTime) / 1000).toFixed(2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timeChallenge, startTime]);

  const handleTuningChange = (event) => {
    const selectedTuning =
      event.target.value === 'standard'
        ? standardTuning
        : event.target.value === 'halfStepDown'
        ? halfStepDownTuning
        : dropDTuning; // Handle Drop D tuning
    setTuning(selectedTuning);
  };

  const handleFretClick = (string, fret) => {
    if (!newbieMode && !easyMode && !hardMode) {
      setFeedback('Please select a mode.');
      return;
    }

    const correctPositions = getAllNotePositions(currentNote.note, tuning);
    const isCorrect = correctPositions.some(
      (position) => position.string === string && position.fret === fret
    );

    if (isCorrect) {
      setGuessedPositions((prev) => [...prev, { string, fret }]);
      setPoints((prev) => prev + 1);
      setFeedback('Correct!');

      if (points + 1 === 5) {
        setShowNotification(true);
        if (timeChallenge) {
          alert(`Great! You did it in ${elapsedTime} seconds!`);
        }
        setStartTime(Date.now());
        setPoints(0);
      }

      if (hardMode) {
        const allGuessed = correctPositions.every(
          (position) =>
            guessedPositions.some(
              (guessed) => guessed.string === position.string && guessed.fret === position.fret
            ) || (position.string === string && position.fret === fret)
        );

        if (allGuessed) {
          setShowNext(true);
        }
      } else {
        setShowNext(true);
      }
    } else {
      setFeedback(`Incorrect. Try again! You clicked on String ${string + 1}, Fret ${fret + 1}.`);
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

  const handleModeChange = (mode) => {
    if (mode === 'newbieMode') {
      setNewbieMode(!newbieMode);
      if (!newbieMode) {
        setEasyMode(false);
        setHardMode(false);
      }
    } else if (mode === 'easyMode') {
      setEasyMode(!easyMode);
      if (!easyMode) {
        setNewbieMode(false);
        setHardMode(false);
      }
    } else if (mode === 'hardMode') {
      setHardMode(!hardMode);
      if (!hardMode) {
        setNewbieMode(false);
        setEasyMode(false);
      }
    }
  };

  const handleTimeChallengeChange = () => {
    setTimeChallenge(!timeChallenge);
    setElapsedTime(0);
    setStartTime(Date.now());
  };

  const chordPositions = useMemo(
    () => (selectedChord ? getChordPositions(selectedChord, tuning) : []),
    [selectedChord, tuning]
  );

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Fretboard Guessing Game</h1>
      <TuningSelector onChange={handleTuningChange} />
      <ChordSelector onChange={handleChordChange} />
      <ModeToggle
        label='newbieMode'
        checked={newbieMode}
        onChange={() => handleModeChange('newbieMode')}
      />
      <ModeToggle
        label='easyMode'
        checked={easyMode}
        onChange={() => handleModeChange('easyMode')}
      />
      <ModeToggle
        label='hardMode'
        checked={hardMode}
        onChange={() => handleModeChange('hardMode')}
      />
      <ModeToggle
        label='timeChallenge'
        checked={timeChallenge}
        onChange={handleTimeChallengeChange}
      />
      <div className='mb-4'>
        <p>Guess the note: {currentNote ? currentNote.note : 'Loading...'}</p>
      </div>
      <div className='mb-4 min-h-8'>
        <p>{feedback}</p>
      </div>
      <div className='mb-4'>
        <p>Points: {points} / 30</p>
      </div>
      {timeChallenge && (
        <div className='mb-4'>
          <p>Time Elapsed: {elapsedTime} seconds</p>
        </div>
      )}
      <div className='mb-4 min-h-12'>
        {showNext && (
          <button onClick={handleNextClick} className='bg-blue-500 text-white p-2 rounded'>
            Next
          </button>
        )}
      </div>
      {showNotification && (
        <div className='mb-4 p-4 bg-green-200 text-green-800 rounded'>
          Congratulations! You've scored 30 points!
        </div>
      )}
      <div className='relative'>
        {tuning ? (
          <>
            <div className='absolute left-0 top-0 h-full flex flex-col justify-center pr-2' style={{ gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={`string-name-${i}`} className='text-14 font-Arial'>
                  {tuning[i]}
                </div>
              ))}
            </div>
            <FretboardSVG
              tuning={tuning}
              width={width}
              height={height}
              onFretClick={handleFretClick}
              showNext={showNext}
              currentNote={currentNote}
              guessedPositions={guessedPositions}
              chordPositions={chordPositions}
              easyMode={newbieMode}
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default FretboardGame;
