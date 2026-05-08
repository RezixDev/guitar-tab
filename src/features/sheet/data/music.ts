import type { DurationInfo, StaffConfig, StaffPosition } from "@shared/types/sheet";

export const durations: Record<string, DurationInfo> = {
  whole: { beats: 4, symbol: "𝅝", name: "Whole", toneNotation: "1n" },
  half: { beats: 2, symbol: "𝅗𝅥", name: "Half", toneNotation: "2n" },
  quarter: { beats: 1, symbol: "♩", name: "Quarter", toneNotation: "4n" },
  eighth: { beats: 0.5, symbol: "♪", name: "Eighth", toneNotation: "8n" },
  sixteenth: { beats: 0.25, symbol: "♬", name: "Sixteenth", toneNotation: "16n" },
};

export const staffConfig: StaffConfig = {
  topMargin: 120,
  lineSpacing: 14,
  staffHeight: 56,
  measureWidth: 220,
  leftMargin: 90,
  measures: 4,
};

export const staffPositions: StaffPosition[] = [
  { note: "C6", position: -3.5, ledger: true },
  { note: "B5", position: -3, ledger: true },
  { note: "A5", position: -2.5, ledger: true },
  { note: "G5", position: -2, ledger: true },
  { note: "F5", position: -1.5 },
  { note: "E5", position: -1 },
  { note: "D5", position: -0.5 },
  { note: "C5", position: 0 },
  { note: "B4", position: 0.5 },
  { note: "A4", position: 1 },
  { note: "G4", position: 1.5 },
  { note: "F4", position: 2 },
  { note: "E4", position: 2.5 },
  { note: "D4", position: 3 },
  { note: "C4", position: 3.5, ledger: true },
  { note: "B3", position: 4, ledger: true },
  { note: "A3", position: 4.5, ledger: true },
  { note: "G3", position: 5, ledger: true },
];
