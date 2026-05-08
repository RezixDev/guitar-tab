import type { SheetNote } from "@shared/types/sheet";
import { durations, staffConfig, staffPositions } from "../data/music";

export function createNoteFromClick(
  x: number,
  y: number,
  selectedDuration: string,
): SheetNote | null {
  if (
    x < staffConfig.leftMargin ||
    x > staffConfig.leftMargin + staffConfig.measures * staffConfig.measureWidth
  ) {
    return null;
  }
  if (
    y < staffConfig.topMargin - 25 ||
    y > staffConfig.topMargin + staffConfig.staffHeight + 25
  ) {
    return null;
  }

  const relativeY = y - staffConfig.topMargin - staffConfig.staffHeight / 2;
  const staffPosition = Math.round((relativeY / staffConfig.lineSpacing) * 2) / 2;

  const closest = staffPositions.reduce((prev, curr) =>
    Math.abs(curr.position - staffPosition) < Math.abs(prev.position - staffPosition)
      ? curr
      : prev,
  );

  return {
    id: Date.now(),
    pitch: closest.note,
    staffPosition: closest.position,
    ledger: closest.ledger ?? false,
    x: x - staffConfig.leftMargin,
    measure: Math.floor((x - staffConfig.leftMargin) / staffConfig.measureWidth),
    duration: selectedDuration,
    beats: durations[selectedDuration].beats,
  };
}

export function findNoteAtPosition(
  notes: SheetNote[],
  clickX: number,
  clickY: number,
): number {
  return notes.findIndex((note) => {
    const noteX = staffConfig.leftMargin + note.x;
    const noteY =
      staffConfig.topMargin +
      note.staffPosition * staffConfig.lineSpacing +
      staffConfig.staffHeight / 2;
    return Math.abs(noteX - clickX) < 15 && Math.abs(noteY - clickY) < 15;
  });
}

export function sortNotesByPosition(notes: SheetNote[]): SheetNote[] {
  return [...notes].sort((a, b) => a.x - b.x);
}

export function calculateTotalDuration(notes: SheetNote[]): number {
  return notes.reduce((sum, note) => sum + note.beats, 0);
}
