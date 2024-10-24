// app/utils/audioUtils.ts

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private gainNode: GainNode | null = null;
  private audioEnabled: boolean = false;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      if (typeof window !== 'undefined') {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 0.5;
        this.audioEnabled = true;
      }
    } catch (error) {
      console.warn('Audio context initialization failed:', error);
      this.audioEnabled = false;
    }
  }

  async loadNoteSound(note: string, octave: number): Promise<void> {
    if (!this.audioEnabled || !this.audioContext) return;

    const noteKey = `${note}${octave}`;
    if (this.audioBuffers.has(noteKey)) return;

    try {
      // Convert note name to filename format (e.g., "C#" to "Cs")
      const fileName = note.replace('#', 's');

      // Try loading MP3 first, then fall back to OGG
      try {
        const response = await fetch(`/audio/${fileName}${octave}.mp3`);
        if (!response.ok) throw new Error('MP3 not found');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(noteKey, audioBuffer);
      } catch (mp3Error) {
        // Try OGG if MP3 fails
        try {
          const response = await fetch(`/audio/${fileName}${octave}.ogg`);
          if (!response.ok) throw new Error('OGG not found');
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.audioBuffers.set(noteKey, audioBuffer);
        } catch (oggError) {
          console.warn(`Failed to load audio for note ${noteKey}:`, oggError);
        }
      }
    } catch (error) {
      console.warn(`Failed to load audio for note ${noteKey}:`, error);
    }
  }

  async preloadAllNotes(): Promise<void> {
    if (!this.audioEnabled) {
      console.warn('Audio is not enabled or supported');
      return;
    }

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octaves = [2, 3, 4];

    for (const note of notes) {
      for (const octave of octaves) {
        await this.loadNoteSound(note, octave);
      }
    }
  }

  playNote(note: string, octave: number): void {
    if (!this.audioEnabled || !this.audioContext || !this.gainNode) {
      console.warn('Audio is not enabled or supported');
      return;
    }

    const noteKey = `${note}${octave}`;
    const buffer = this.audioBuffers.get(noteKey);

    if (buffer) {
      try {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.gainNode);
        source.start();
      } catch (error) {
        console.warn('Failed to play note:', error);
      }
    }
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}