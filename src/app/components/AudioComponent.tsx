import React, { useEffect } from 'react';
import { getAudioContext } from '../utils/audioContext';

const AudioComponent: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);

      return () => {
        audioContext.close();
      };
    }
  }, []);

  return <div>Audio Component</div>;
};

export default AudioComponent;
