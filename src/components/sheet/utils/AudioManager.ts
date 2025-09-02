// utils/AudioManager.ts
import * as Tone from 'tone';
import { Note } from '../types/music';
import { durations } from '../constants/music';

interface PartEvent {
    time: string;
    note: string;
    duration: string;
    index: number;
    x: number;
}

export class AudioManager {
    private synth: Tone.PolySynth | null = null;
    private sequence: Tone.Part | null = null;
    private isInitialized = false;

    async initialize(volume: number = -10): Promise<void> {
        try {
            // Create PolySynth with proper constructor pattern
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: 'triangle' },
                envelope: {
                    attack: 0.02,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 1
                }
            }).toDestination();

            // Set maxPolyphony as a property (not in constructor options)
            this.synth.maxPolyphony = 8;
            this.synth.volume.value = volume;
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize AudioManager:', error);
            throw error;
        }
    }

    updateVolume(volume: number): void {
        if (this.synth) {
            this.synth.volume.value = volume;
        }
    }

    updateTempo(tempo: number): void {
        // Simply update the transport BPM - this will affect all scheduled events
        Tone.Transport.bpm.value = tempo;
    }

    playPreviewNote(pitch: string): void {
        if (this.synth) {
            this.synth.triggerAttackRelease(pitch, '8n');
        }
    }

    async playSequence(
        notes: Note[],
        startIndex: number,
        onNotePlay: (index: number, x: number) => void,
        onSequenceEnd: () => void
    ): Promise<void> {
        if (!this.synth) {
            console.warn('AudioManager not initialized');
            return;
        }

        try {
            // Start audio context if needed
            if (Tone.context.state !== 'running') {
                await Tone.start();
            }

            // Stop any existing playback
            this.stopSequence();

            // Get notes to play starting from the selected index
            const notesToPlay = notes.slice(startIndex);
            if (notesToPlay.length === 0) {
                console.warn('No notes to play');
                return;
            }

            // Create events using Tone.js musical time notation
            let currentTime = 0; // Track position in quarter notes
            const events: PartEvent[] = [];

            notesToPlay.forEach((note, idx) => {
                const actualIndex = startIndex + idx;

                // Convert current time to Tone.js notation (bars:beats:subdivisions)
                // Since we're tracking in quarter notes, currentTime is the beat count
                const bars = Math.floor(currentTime / 4);
                const beats = currentTime % 4;
                const timeNotation = `${bars}:${beats}:0`;

                events.push({
                    time: timeNotation,
                    note: note.pitch,
                    duration: durations[note.duration].toneNotation,
                    index: actualIndex,
                    x: note.x
                });

                // Advance by the note's beat duration
                currentTime += note.beats;
            });

            // Create Tone.Part with musical time events
            this.sequence = new Tone.Part((time, event: PartEvent) => {
                // Trigger the note
                this.synth?.triggerAttackRelease(event.note, event.duration, time);

                // Update current note index on the main thread
                Tone.Draw.schedule(() => {
                    onNotePlay(event.index, event.x);
                }, time);

                // Clear highlight after the last note
                if (event.index === notes.length - 1) {
                    const noteDurationInSeconds = Tone.Time(event.duration).toSeconds();
                    Tone.Draw.schedule(() => {
                        onSequenceEnd();
                    }, time + noteDurationInSeconds);
                }
            }, events);

            // Configure and start the sequence
            this.sequence.loop = false;
            this.sequence.start(0);

            // Start transport
            Tone.Transport.start();

        } catch (error) {
            console.error('Failed to play sequence:', error);
            this.stopSequence();
            onSequenceEnd(); // Ensure UI is reset on error
        }
    }

    stopSequence(): void {
        try {
            // Stop and clear transport
            Tone.Transport.stop();
            Tone.Transport.cancel();

            // Dispose of the sequence
            if (this.sequence) {
                this.sequence.dispose();
                this.sequence = null;
            }

            // Stop all currently playing voices
            this.synth?.releaseAll();
        } catch (error) {
            console.error('Error stopping sequence:', error);
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
            console.error('Error disposing AudioManager:', error);
        }
    }

    get initialized(): boolean {
        return this.isInitialized;
    }

    // Additional utility methods for better UX
    get isPlaying(): boolean {
        return Tone.Transport.state === 'started';
    }

    get currentTempo(): number {
        return Tone.Transport.bpm.value;
    }

    pause(): void {
        if (this.isPlaying) {
            Tone.Transport.pause();
        }
    }

    resume(): void {
        if (Tone.Transport.state === 'paused') {
            Tone.Transport.start();
        }
    }
}