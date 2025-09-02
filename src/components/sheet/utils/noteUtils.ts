// utils/noteUtils.ts
import { Note } from '../types/music';
import { staffConfig, staffPositions, durations } from '../constants/music';

export const createNoteFromClick = (
    x: number,
    y: number,
    selectedDuration: string
): Note | null => {
    // Check boundaries
    if (x < staffConfig.leftMargin ||
        x > staffConfig.leftMargin + (staffConfig.measures * staffConfig.measureWidth)) {
        return null;
    }

    if (y < staffConfig.topMargin - 25 ||
        y > staffConfig.topMargin + staffConfig.staffHeight + 25) {
        return null;
    }

    const relativeY = y - staffConfig.topMargin - (staffConfig.staffHeight / 2);
    const staffPosition = Math.round(relativeY / staffConfig.lineSpacing * 2) / 2;

    const closestNote = staffPositions.reduce((prev, curr) => {
        return Math.abs(curr.position - staffPosition) < Math.abs(prev.position - staffPosition) ? curr : prev;
    });

    return {
        id: Date.now(),
        pitch: closestNote.note,
        staffPosition: closestNote.position,
        ledger: closestNote.ledger || false,
        x: x - staffConfig.leftMargin,
        measure: Math.floor((x - staffConfig.leftMargin) / staffConfig.measureWidth),
        duration: selectedDuration,
        beats: durations[selectedDuration].beats
    };
};

export const findNoteAtPosition = (
    notes: Note[],
    clickX: number,
    clickY: number
): number => {
    return notes.findIndex(note => {
        const noteX = staffConfig.leftMargin + note.x;
        const noteY = staffConfig.topMargin + (note.staffPosition * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);
        return Math.abs(noteX - clickX) < 15 && Math.abs(noteY - clickY) < 15;
    });
};

export const sortNotesByPosition = (notes: Note[]): Note[] => {
    return [...notes].sort((a, b) => a.x - b.x);
};

export const calculateTotalDuration = (notes: Note[]): number => {
    return notes.reduce((sum, note) => sum + note.beats, 0);
};