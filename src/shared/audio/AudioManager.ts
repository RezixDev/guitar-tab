import { NOTES } from "@shared/types/music";

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers = new Map<string, AudioBuffer>();
  private gainNode: GainNode | null = null;
  private audioEnabled = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") return;
    try {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.5;
      this.audioEnabled = true;
    } catch (error) {
      console.warn("AudioContext init failed:", error);
    }
  }

  async loadNoteSound(note: string, octave: number): Promise<void> {
    if (!this.audioEnabled || !this.audioContext) return;
    const key = `${note}${octave}`;
    if (this.audioBuffers.has(key)) return;

    const fileName = note.replace("#", "s");
    const tryLoad = async (ext: string) => {
      const response = await fetch(`/audio/${fileName}${octave}.${ext}`);
      if (!response.ok) throw new Error(`${ext} not found`);
      const buffer = await response.arrayBuffer();
      return this.audioContext!.decodeAudioData(buffer);
    };

    try {
      const buffer = await tryLoad("mp3").catch(() => tryLoad("ogg"));
      this.audioBuffers.set(key, buffer);
    } catch (error) {
      console.warn(`Failed to load audio ${key}:`, error);
    }
  }

  async preloadAllNotes(): Promise<void> {
    if (!this.audioEnabled) return;
    for (const note of NOTES) {
      for (const octave of [2, 3, 4]) {
        await this.loadNoteSound(note, octave);
      }
    }
  }

  playNote(note: string, octave: number): void {
    if (!this.audioContext || !this.gainNode) return;
    const buffer = this.audioBuffers.get(`${note}${octave}`);
    if (!buffer) return;
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.gainNode);
      source.start();
    } catch (error) {
      console.warn("playNote failed:", error);
    }
  }

  setVolume(volume: number): void {
    if (!this.gainNode) return;
    this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
  }
}

export const getAudioContext = (): AudioContext => {
  return new (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext)();
};
