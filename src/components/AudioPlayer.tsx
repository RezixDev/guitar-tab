'use client';

import React, { useEffect } from 'react';
import * as Tone from 'tone';

interface AudioPlayerProps {
  notes: string[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ notes }) => {
  useEffect(() => {
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
      notes.forEach((note, index) => {
        sampler.triggerAttackRelease(note, '8n', Tone.now() + index * 0.1);
      });
    };

    // Attach the playChord function to the window object for global access
    /*  window.playChord = playChord; */

    // Cleanup
    return () => {
      sampler.dispose();
      /*       delete window.playChord; */
    };
  }, [notes]);

  return null; // This component does not render anything visible
};

export default AudioPlayer;
