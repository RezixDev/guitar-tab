import { useCallback, useEffect, useRef } from "react";

type WindowWithAudioContext = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithAudioContext;
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

/**
 * Lazily creates a single shared AudioContext on first use, and closes it on
 * unmount. Returns a getter; both the pitch detector and reference-tone hooks
 * call this so they share one context (and one user-gesture activation).
 */
export function useAudioContext() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureAudioContext = useCallback(async (): Promise<AudioContext | null> => {
    let ctx = ctxRef.current;
    if (!ctx) {
      const AC = getAudioContextCtor();
      if (!AC) return null;
      try {
        ctx = new AC();
        ctxRef.current = ctx;
      } catch (err) {
        console.error("Error initializing AudioContext:", err);
        return null;
      }
    }
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx;
  }, []);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return { ensureAudioContext };
}
