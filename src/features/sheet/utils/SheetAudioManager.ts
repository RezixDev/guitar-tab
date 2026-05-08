import * as Tone from "tone";
import type { SheetNote } from "@shared/types/sheet";
import { durations } from "../data/music";

interface PartEvent {
  time: string;
  note: string;
  duration: string;
  index: number;
  x: number;
}

export class SheetAudioManager {
  private synth: Tone.PolySynth | null = null;
  private sequence: Tone.Part | null = null;
  private isInitialized = false;

  async initialize(volume = -10): Promise<void> {
    try {
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 },
      }).toDestination();
      this.synth.maxPolyphony = 8;
      this.synth.volume.value = volume;
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize SheetAudioManager:", error);
      throw error;
    }
  }

  updateVolume(volume: number): void {
    if (this.synth) this.synth.volume.value = volume;
  }

  updateTempo(tempo: number): void {
    Tone.Transport.bpm.value = tempo;
  }

  playPreviewNote(pitch: string): void {
    if (this.synth) this.synth.triggerAttackRelease(pitch, "8n");
  }

  async playSequence(
    notes: SheetNote[],
    startIndex: number,
    onNotePlay: (index: number, x: number) => void,
    onSequenceEnd: () => void,
  ): Promise<void> {
    if (!this.synth) {
      console.warn("SheetAudioManager not initialized");
      return;
    }

    try {
      if (Tone.context.state !== "running") await Tone.start();
      this.stopSequence();

      const notesToPlay = notes.slice(startIndex);
      if (notesToPlay.length === 0) return;

      let currentTime = 0;
      const events: PartEvent[] = [];
      notesToPlay.forEach((note, idx) => {
        const actualIndex = startIndex + idx;
        const bars = Math.floor(currentTime / 4);
        const beats = currentTime % 4;
        events.push({
          time: `${bars}:${beats}:0`,
          note: note.pitch,
          duration: durations[note.duration].toneNotation,
          index: actualIndex,
          x: note.x,
        });
        currentTime += note.beats;
      });

      this.sequence = new Tone.Part((time, event: PartEvent) => {
        this.synth?.triggerAttackRelease(event.note, event.duration, time);
        Tone.Draw.schedule(() => onNotePlay(event.index, event.x), time);
        if (event.index === notes.length - 1) {
          const dur = Tone.Time(event.duration).toSeconds();
          Tone.Draw.schedule(() => onSequenceEnd(), time + dur);
        }
      }, events);

      this.sequence.loop = false;
      this.sequence.start(0);
      Tone.Transport.start();
    } catch (error) {
      console.error("Failed to play sequence:", error);
      this.stopSequence();
      onSequenceEnd();
    }
  }

  stopSequence(): void {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      if (this.sequence) {
        this.sequence.dispose();
        this.sequence = null;
      }
      this.synth?.releaseAll();
    } catch (error) {
      console.error("Error stopping sequence:", error);
    }
  }

  dispose(): void {
    try {
      this.stopSequence();
      if (this.synth) {
        this.synth.dispose();
        this.synth = null;
      }
      this.isInitialized = false;
    } catch (error) {
      console.error("Error disposing SheetAudioManager:", error);
    }
  }

  get initialized(): boolean {
    return this.isInitialized;
  }
}
