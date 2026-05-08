// Geometry — assumes a 6-string, 12-fret guitar (the only layout used today).
export const STRING_COUNT = 6;
export const FRET_COUNT = 12;

// Per-note colors used to overlay note dots on the fretboard.
export const NORMAL_COLORS: Record<string, string> = {
  A: "#1D7669",
  "A#": "#3FB82D",
  B: "#A5E906",
  C: "#FEF200",
  "C#": "#FBC40F",
  D: "#f7c68d",
  "D#": "#F36B2C",
  E: "#C73333",
  F: "#B84098",
  "F#": "#5D25BE",
  G: "#5251EB",
  "G#": "#1767FC",
};

export const HIGH_CONTRAST_COLORS: Record<string, string> = {
  A: "#000000",
  "A#": "#1a1a1a",
  B: "#333333",
  C: "#4d4d4d",
  "C#": "#666666",
  D: "#808080",
  "D#": "#999999",
  E: "#b3b3b3",
  F: "#cccccc",
  "F#": "#e6e6e6",
  G: "#f2f2f2",
  "G#": "#ffffff",
};

/** Returns relative luminance in [0,1] for a `#rrggbb` hex color. */
export function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** Black or white foreground for legible text over a colored background. */
export const fontOn = (bg: string): string =>
  luminance(bg) > 0.5 ? "#000000" : "#FFFFFF";

/**
 * Converts a logical string index (0 = high E, 5 = low E) to a visual row.
 * `flipped=true` puts the high E on top (the way most tabs are written).
 */
export const toDisplayIndex = (logical: number, flipped: boolean): number =>
  flipped ? logical : STRING_COUNT - 1 - logical;

/** Clamp `v` to `[min, max]`. */
export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));
