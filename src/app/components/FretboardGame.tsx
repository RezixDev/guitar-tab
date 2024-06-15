'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import FretboardSVG from './FretboardSVG';
import ModeToggle from './ModeToggle';
import useClientEffect from './useClientEffect';
import {
  standardTuning,
  halfStepDownTuning,
  dropDTuning,
  generateRandomNote,
  getAllNotePositions,
  getNote,
  Note,
  Tuning,
  NotePosition,
} from '../utils/noteUtils';

const TuningSelector = ({
  onChange,
}: {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className='mb-4'>
    <label htmlFor='tuning' className='mr-2'>
      Select Tuning:
    </label>
    <select
      id='tuning'
      onChange={onChange}
      className='border border-gray-400 p-2'
    >
      <option value='standard'>Standard</option>
      <option value='halfStepDown'>Half Step Down</option>
      <option value='dropD'>Drop D</option>
    </select>
  </div>
);

const FretboardGame: React.FC = () => {
  const [tuning, setTuning] = useState<Tuning>(standardTuning);
  const [currentNote, setCurrentNote] = useState<Note>(
    generateRandomNote(standardTuning)
  );
  const [feedback, setFeedback] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [showNext, setShowNext] = useState<boolean>(false);
  const [newbieMode, setNewbieMode] = useState<boolean>(true);
  const [easyMode, setEasyMode] = useState<boolean>(false);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [guessedPositions, setGuessedPositions] = useState<NotePosition[]>([]);
  const [selectedChord, setSelectedChord] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timeChallenge, setTimeChallenge] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const width = 900;
  const height = 300;

  useClientEffect(() => {
    setCurrentNote(generateRandomNote(tuning));
  }, [tuning]);

  useClientEffect(() => {
    if (hardMode) {
      setGuessedPositions([]);
    }
  }, [hardMode, currentNote, tuning]);

  useClientEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeChallenge) {
      interval = setInterval(() => {
        setElapsedTime(
          parseFloat(((Date.now() - startTime) / 1000).toFixed(2))
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timeChallenge, startTime]);

  const handleTuningChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedTuning =
      event.target.value === 'standard'
        ? standardTuning
        : event.target.value === 'halfStepDown'
        ? halfStepDownTuning
        : dropDTuning;
    setTuning(selectedTuning);
  };

  const handleFretClick = (string: number, fret: number) => {
    if (!newbieMode && !easyMode && !hardMode) {
      setFeedback('Please select a mode.');
      return;
    }

    const correctPositions = getAllNotePositions(currentNote.note, tuning);
    const isCorrect = correctPositions.some(
      (position) => position.string === string && position.fret === fret
    );

    if (isCorrect) {
      const note = getNote(string, fret, tuning);
      setGuessedPositions((prev) => [...prev, { string, fret, note }]);
      setPoints((prev) => prev + 1);
      setFeedback('Correct!');

      if (points + 1 === 20) {
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
              (guessed) =>
                guessed.string === position.string &&
                guessed.fret === position.fret
            ) ||
            (position.string === string && position.fret === fret)
        );

        if (allGuessed) {
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

  const handleChordChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedChord(event.target.value);
  };

  const handleModeChange = (mode: string) => {
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

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Fretboard Guessing Game</h1>
      <TuningSelector onChange={handleTuningChange} />
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
          <button
            onClick={handleNextClick}
            className='bg-blue-500 text-white p-2 rounded'
          >
            Next
          </button>
        )}
      </div>
      {showNotification && (
        <div className='mb-4 p-4 bg-green-200 text-green-800 rounded'>
          Congratulations! Youve scored 30 points!
        </div>
      )}
      <div className='relative'>
        {tuning ? (
          <>
            <div
              className='absolute left-0 top-0 h-full flex flex-col justify-center pr-2'
              style={{ gap: '20px' }}
            >
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
