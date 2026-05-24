import { useCallback, useEffect, useRef, useState } from "react";
import { sensitivityToGain, SILENCE_RMS } from "@features/tuner/lib/pitch";
import {
  buildBinToPitchClass,
  computeChromagram,
  dbSpectrumToLinear,
  type Chromagram,
} from "../lib/chromagram";
import { matchChord, type ChordMatch } from "../lib/chords";

// 16384 → ~2.7 Hz bin width at 44.1 kHz. Enough to separate F2 (87 Hz) and
// E2 (82 Hz) on the low strings, which a 4096-point FFT cannot.
const FFT_SIZE = 16384;
// EMA smoothing applied to the chromagram between frames. Lower = snappier
// response, higher = more stable but slower to react to chord changes.
const SMOOTHING = 0.4;
// Mic level meter scale: same as the pitch detector for consistency.
const SIGNAL_LEVEL_SCALE = 2000;
// Below this cosine score, we report "no chord" rather than a guess.
const MIN_CONFIDENCE = 0.6;

type ChordDetectorState = {
  chord: ChordMatch | null;
  /** Smoothed chromagram (length 12). Stable reference; mutated in-place. */
  chroma: Chromagram;
  signalLevel: number;
  isActive: boolean;
  error: string | null;
};

type Options = {
  ensureAudioContext: () => Promise<AudioContext | null>;
  sensitivity: number;
};

/**
 * Mic → gain → analyser pipeline that computes a smoothed chromagram each
 * frame and matches it against pre-built chord templates. The chromagram
 * Float32Array is shared (mutated in place) to avoid per-frame allocations;
 * the React state holds the same reference but a bumped counter triggers
 * re-renders when its contents change.
 */
export function useChordDetector({ ensureAudioContext, sensitivity }: Options) {
  const [state, setState] = useState<ChordDetectorState>(() => ({
    chord: null,
    chroma: new Float32Array(12),
    signalLevel: 0,
    isActive: false,
    error: null,
  }));

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rafRef = useRef<number | null>(null);

  // Scratch buffers — sized once start() runs, reused every frame.
  // Typed as Float32Array<ArrayBuffer> so AnalyserNode methods accept them
  // under TS 5.7+'s newly-generic typed-array types.
  const timeBufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const dbBufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const linBufRef = useRef<Float32Array<ArrayBuffer> | null>(null);
  const binToPcRef = useRef<Int8Array | null>(null);
  const smoothedChromaRef = useRef<Float32Array<ArrayBuffer>>(new Float32Array(12));
  const frameChromaRef = useRef<Float32Array<ArrayBuffer>>(new Float32Array(12));

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    sourceRef.current?.disconnect();
    gainRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    sourceRef.current = null;
    gainRef.current = null;
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cleanup();
    smoothedChromaRef.current.fill(0);
    setState((s) => ({
      ...s,
      chord: null,
      signalLevel: 0,
      isActive: false,
      error: null,
    }));
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
      // Disable AnalyserNode's built-in temporal smoothing — we apply our own
      // EMA at the chromagram level, which is what we actually want.
      analyserRef.current.smoothingTimeConstant = 0;
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
      setState((s) => ({
        ...s,
        chord: null,
        signalLevel: 0,
        isActive: false,
        error: "Unable to access microphone. Please check permissions.",
      }));
      return;
    }

    streamRef.current = stream;
    sourceRef.current = ctx.createMediaStreamSource(stream);
    gainRef.current = ctx.createGain();
    gainRef.current.gain.value = sensitivityToGain(sensitivity);
    sourceRef.current.connect(gainRef.current);
    gainRef.current.connect(analyserRef.current!);

    const analyser = analyserRef.current!;
    const binCount = analyser.frequencyBinCount;
    timeBufRef.current = new Float32Array(analyser.fftSize);
    dbBufRef.current = new Float32Array(binCount);
    linBufRef.current = new Float32Array(binCount);
    binToPcRef.current = buildBinToPitchClass(ctx.sampleRate, analyser.fftSize);
    smoothedChromaRef.current.fill(0);

    setState({
      chord: null,
      chroma: smoothedChromaRef.current,
      signalLevel: 0,
      isActive: true,
      error: null,
    });

    const tick = () => {
      const a = analyserRef.current;
      const timeBuf = timeBufRef.current;
      const dbBuf = dbBufRef.current;
      const linBuf = linBufRef.current;
      const binToPc = binToPcRef.current;
      if (!a || !timeBuf || !dbBuf || !linBuf || !binToPc) return;

      // RMS for the level meter + silence gate.
      a.getFloatTimeDomainData(timeBuf);
      let sumSquares = 0;
      for (let i = 0; i < timeBuf.length; i++) sumSquares += timeBuf[i] * timeBuf[i];
      const rms = Math.sqrt(sumSquares / timeBuf.length);
      const signalLevel = Math.min(100, Math.round(rms * SIGNAL_LEVEL_SCALE));

      if (rms < SILENCE_RMS) {
        // Decay the smoothed chroma so an old chord doesn't linger when the
        // player stops. After ~10 frames of silence it's effectively zero.
        const smoothed = smoothedChromaRef.current;
        for (let i = 0; i < 12; i++) smoothed[i] *= 0.7;
        setState((s) => ({ ...s, signalLevel, chord: null }));
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      a.getFloatFrequencyData(dbBuf);
      dbSpectrumToLinear(dbBuf, linBuf, a.minDecibels);
      const frame = computeChromagram(linBuf, binToPc, frameChromaRef.current);

      // EMA blend into the smoothed chroma.
      const smoothed = smoothedChromaRef.current;
      for (let i = 0; i < 12; i++) {
        smoothed[i] = SMOOTHING * smoothed[i] + (1 - SMOOTHING) * frame[i];
      }

      const match = matchChord(smoothed);
      const chord = match && match.confidence >= MIN_CONFIDENCE ? match : null;

      setState((s) => ({ ...s, signalLevel, chord, chroma: smoothed }));

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [ensureAudioContext, sensitivity]);

  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setValueAtTime(
        sensitivityToGain(sensitivity),
        ctxRef.current.currentTime,
      );
    }
  }, [sensitivity]);

  useEffect(() => cleanup, [cleanup]);

  return { ...state, start, stop };
}
