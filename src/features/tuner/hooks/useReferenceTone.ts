import { useCallback, useEffect, useRef, useState } from "react";
import type { TunerNote } from "../types";

type Options = {
  ensureAudioContext: () => Promise<AudioContext | null>;
};

/**
 * Plays a sine wave at a chosen note's frequency through a shared GainNode
 * connected to the destination, used as a reference tone. Calling `play()`
 * with the currently-playing note stops it (toggle).
 */
export function useReferenceTone({ ensureAudioContext }: Options) {
  const [currentNote, setCurrentNote] = useState<TunerNote | null>(null);
  const [volume, setVolumeState] = useState(0.5);

  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const stop = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // already stopped
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    setCurrentNote(null);
  }, []);

  const play = useCallback(
    async (note: TunerNote) => {
      if (currentNote?.note === note.note) {
        stop();
        return;
      }
      const ctx = await ensureAudioContext();
      if (!ctx) return;
      ctxRef.current = ctx;

      if (!gainRef.current) {
        gainRef.current = ctx.createGain();
        gainRef.current.connect(ctx.destination);
      }
      gainRef.current.gain.setValueAtTime(volume, ctx.currentTime);

      // Replace any in-flight oscillator
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {
          // already stopped
        }
        oscillatorRef.current.disconnect();
      }
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(note.frequency, ctx.currentTime);
      osc.connect(gainRef.current);
      osc.start();
      oscillatorRef.current = osc;
      setCurrentNote(note);
    },
    [currentNote, ensureAudioContext, stop, volume],
  );

  const setVolume = useCallback((next: number) => {
    setVolumeState(next);
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(next, ctxRef.current.currentTime);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return { currentNote, isPlaying: currentNote !== null, volume, play, stop, setVolume };
}
