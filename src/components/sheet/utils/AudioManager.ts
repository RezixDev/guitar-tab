// utils/AudioManager.ts
import * as Tone from 'tone';
import { Note } from '../types/music';
import { durations } from '../constants/music';

export class AudioManager {
    private synth: Tone.PolySynth | null = null;
    private sequence: Tone.Part | null = null;
    private isInitialized = false;

    async initialize(volume: number = -10) {
        this.synth = new Tone.PolySynth(Tone.Synth, {
            maxPolyphony: 8,
            oscillator: { type: 'triangle' },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toDestination();

        this.synth.volume.value = volume;
        this.isInitialized = true;
    }

    updateVolume(volume: number) {
        if (this.synth) {
            this.synth.volume.value = volume;
        }
    }

    updateTempo(tempo: number) {
        Tone.Transport.bpm.value = tempo;
    }

    playPreviewNote(pitch: string) {
        if (this.synth) {
            this.synth.triggerAttackRelease(pitch, '8n');
        }
    }

    async playSequence(
        notes: Note[],
        startIndex: number,
        onNotePlay: (index: number, x: number) => void,
        onSequenceEnd: () => void
    ) {
        if (!this.synth) return;

        // Start audio context
        await Tone.start();

        // Stop any existing playback
        this.stopSequence();

        // Get notes to play starting from the selected index
        const notesToPlay = notes.slice(startIndex);
        if (notesToPlay.length === 0) return;

        // Create events for Tone.Part
        let currentTime = 0;
        const events: Array<{ time: number; note: string; duration: string; index: number; x: number }> = [];

        notesToPlay.forEach((note, idx) => {
            const actualIndex = startIndex + idx;
            events.push({
                time: currentTime,
                note: note.pitch,
                duration: durations[note.duration].toneNotation,
                index: actualIndex,
                x: note.x
            });
            currentTime += note.beats;
        });

        // Create Tone.Part
        this.sequence = new Tone.Part((time, value) => {
            // Trigger the note
            this.synth?.triggerAttackRelease(value.note, value.duration, time);

            // Update current note index
            Tone.Draw.schedule(() => {
                onNotePlay(value.index, value.x);
            }, time);

            // Clear highlight after the last note
            if (value.index === notes.length - 1) {
                const noteDurationInSeconds = Tone.Time(value.duration).toSeconds();
                Tone.Draw.schedule(() => {
                    onSequenceEnd();
                }, time + noteDurationInSeconds);
            }
        }, events.map(e => [e.time, e]));

        this.sequence.loop = false;
        this.sequence.start(0);

        // Start transport
        Tone.Transport.start();
    }

    stopSequence() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        if (this.sequence) {
            this.sequence.dispose();
            this.sequence = null;
        }
    }

    dispose() {
        this.stopSequence();
        if (this.synth) {
            this.synth.dispose();
        }
    }

    get initialized() {
        return this.isInitialized;
    }
}