import { useCallback, useEffect, useRef, useState } from "react";
import * as Pitchfinder from "pitchfinder";
import {
  MAX_GUITAR_FREQUENCY,
  MIN_GUITAR_FREQUENCY,
  SILENCE_RMS,
  sensitivityToGain,
} from "../lib/pitch";

type PitchDetector = (input: Float32Array) => number | null;

const SMOOTHING_COUNT = 5;
const FFT_SIZE = 4096;
// RMS ~0.05 maps to ~100% on the meter
const SIGNAL_LEVEL_SCALE = 2000;

type PitchDetectorState = {
  /** Smoothed detected pitch (Hz). `null` while silent or out of range. */
  frequency: number | null;
  /** Mic input level 0–100. Useful for "is the mic actually picking up sound?" UI. */
  signalLevel: number;
  /** Whether the mic is currently streaming. */
  isActive: boolean;
  /** Last error from `start()`, if any. */
  error: string | null;
};

type Options = {
  ensureAudioContext: () => Promise<AudioContext | null>;
  /** Sensitivity 1–10. Re-applies live to the input gain. */
  sensitivity: number;
};

/**
 * Mic → gain → analyser pipeline driven by `requestAnimationFrame`. Each frame
 * computes RMS for the level meter, gates pitch detection on silence, and
 * smooths the YIN output over the last few frames.
 */
export function usePitchDetector({ ensureAudioContext, sensitivity }: Options) {
  const [state, setState] = useState<PitchDetectorState>({
    frequency: null,
    signalLevel: 0,
    isActive: false,
    error: null,
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<PitchDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const historyRef = useRef<number[]>([]);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    sourceRef.current?.disconnect();
    gainRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    sourceRef.current = null;
    gainRef.current = null;
    streamRef.current = null;
    historyRef.current = [];
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setState({ frequency: null, signalLevel: 0, isActive: false, error: null });
  }, [cleanup]);

  const start = useCallback(async () => {
    const ctx = await ensureAudioContext();
    if (!ctx) {
      setState((s) => ({ ...s, error: "AudioContext is not available." }));
      return;
    }
    ctxRef.current = ctx;

    if (!analyserRef.current) {
      analyserRef.current = ctx.createAnalyser();
      analyserRef.current.fftSize = FFT_SIZE;
    }
    if (!detectorRef.current) {
      detectorRef.current = Pitchfinder.YIN({
        sampleRate: ctx.sampleRate,
        threshold: 0.1,
        probabilityThreshold: 0.05,
      }) as PitchDetector;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
    } catch {
      setState({
        frequency: null,
        signalLevel: 0,
        isActive: false,
        error: "Unable to access microphone. Please check permissions.",
      });
      return;
    }

    streamRef.current = stream;
    sourceRef.current = ctx.createMediaStreamSource(stream);
    gainRef.current = ctx.createGain();
    gainRef.current.gain.value = sensitivityToGain(sensitivity);
    // mic → gain → analyser. Analyser is NOT connected to destination, so this
    // boosted signal never reaches the speakers.
    sourceRef.current.connect(gainRef.current);
    gainRef.current.connect(analyserRef.current!);

    const buffer = new Float32Array(analyserRef.current!.fftSize);
    historyRef.current = [];

    setState({ frequency: null, signalLevel: 0, isActive: true, error: null });

    const tick = () => {
      const analyser = analyserRef.current;
      const detector = detectorRef.current;
      if (!analyser || !detector) return;

      analyser.getFloatTimeDomainData(buffer);

      let sumSquares = 0;
      for (let i = 0; i < buffer.length; i++) sumSquares += buffer[i] * buffer[i];
      const rms = Math.sqrt(sumSquares / buffer.length);
      const signalLevel = Math.min(100, Math.round(rms * SIGNAL_LEVEL_SCALE));

      if (rms < SILENCE_RMS) {
        historyRef.current = [];
        setState((s) => (s.signalLevel === signalLevel ? s : { ...s, signalLevel }));
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const freq = detector(buffer);
      if (freq && freq > MIN_GUITAR_FREQUENCY && freq < MAX_GUITAR_FREQUENCY) {
        const history = historyRef.current;
        history.push(freq);
        if (history.length > SMOOTHING_COUNT) history.shift();
        const smoothed = history.reduce((a, b) => a + b, 0) / history.length;
        setState((s) => ({ ...s, signalLevel, frequency: smoothed, error: null }));
      } else {
        setState((s) => (s.signalLevel === signalLevel ? s : { ...s, signalLevel }));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [ensureAudioContext, sensitivity]);

  // Live-update input gain when the user moves the sensitivity slider
  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(
        sensitivityToGain(sensitivity),
        ctxRef.current.currentTime,
      );
    }
  }, [sensitivity]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return { ...state, start, stop };
}
