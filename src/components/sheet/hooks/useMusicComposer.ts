// hooks/useMusicComposer.ts
import { useState, useRef, useEffect } from 'react';
import { Note } from '../types/music';
import { AudioManager } from '../utils/AudioManager';
import { createNoteFromClick, findNoteAtPosition, sortNotesByPosition } from '../utils/noteUtils';
import { staffConfig } from '../constants/music';

export const useMusicComposer = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
    const [selectedDuration, setSelectedDuration] = useState('quarter');
    const [tempo, setTempo] = useState(120);
    const [volume, setVolume] = useState([-10]);
    const [playbackStartIndex, setPlaybackStartIndex] = useState(0);
    const [playheadPosition, setPlayheadPosition] = useState(-1);

    const audioManagerRef = useRef<AudioManager | null>(null);

    // Initialize audio manager
    useEffect(() => {
        audioManagerRef.current = new AudioManager();
        audioManagerRef.current.initialize(volume[0]);

        return () => {
            if (audioManagerRef.current) {
                audioManagerRef.current.dispose();
            }
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (audioManagerRef.current) {
            audioManagerRef.current.updateVolume(volume[0]);
        }
    }, [volume]);

    // Update tempo - Tone.js will handle this automatically for active sequences
    useEffect(() => {
        if (audioManagerRef.current) {
            audioManagerRef.current.updateTempo(tempo);
        }
    }, [tempo]);

    const stopPlayback = () => {
        if (audioManagerRef.current) {
            audioManagerRef.current.stopSequence();
        }
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
        setPlayheadPosition(-1);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicking on an existing note to set start position
        const clickedNoteIndex = findNoteAtPosition(notes, x, y);

        if (clickedNoteIndex !== -1 && e.shiftKey) {
            setPlaybackStartIndex(clickedNoteIndex);
            return;
        }

        // Create new note
        const newNote = createNoteFromClick(x, y, selectedDuration);
        if (!newNote) return;

        // Play preview sound
        if (audioManagerRef.current) {
            audioManagerRef.current.playPreviewNote(newNote.pitch);
        }

        setNotes(prevNotes => sortNotesByPosition([...prevNotes, newNote]));
    };

    const playNotes = async () => {
        if (!audioManagerRef.current) return;

        if (isPlaying) {
            stopPlayback();
            return;
        }

        if (notes.length === 0) return;

        const onNotePlay = (index: number, x: number) => {
            setCurrentNoteIndex(index);
            setPlayheadPosition(staffConfig.leftMargin + x);
        };

        const onSequenceEnd = () => {
            stopPlayback();
        };

        await audioManagerRef.current.playSequence(
            notes,
            playbackStartIndex,
            onNotePlay,
            onSequenceEnd
        );

        setIsPlaying(true);
    };

    const clearNotes = () => {
        stopPlayback();
        setNotes([]);
        setPlaybackStartIndex(0);
    };

    const deleteLastNote = () => {
        if (notes.length > 0) {
            const newNotes = notes.slice(0, -1);
            setNotes(newNotes);
            if (playbackStartIndex >= newNotes.length) {
                setPlaybackStartIndex(Math.max(0, newNotes.length - 1));
            }
        }
    };

    const moveStartPoint = (direction: 'prev' | 'next') => {
        if (notes.length === 0) return;

        if (direction === 'prev') {
            setPlaybackStartIndex(Math.max(0, playbackStartIndex - 1));
        } else {
            setPlaybackStartIndex(Math.min(notes.length - 1, playbackStartIndex + 1));
        }
    };

    const resetStartPoint = () => {
        setPlaybackStartIndex(0);
    };

    return {
        // State
        notes,
        isPlaying,
        currentNoteIndex,
        selectedDuration,
        tempo,
        volume,
        playbackStartIndex,
        playheadPosition,

        // Actions
        handleCanvasClick,
        playNotes,
        clearNotes,
        deleteLastNote,
        moveStartPoint,
        resetStartPoint,
        setSelectedDuration,
        setTempo,
        setVolume
    };
};