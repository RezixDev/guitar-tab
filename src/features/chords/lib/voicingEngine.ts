import type {
  Chord,
  ChordDefinition,
  ChordNote,
  ChordRootNote,
} from "@shared/types/chord";
import { normalize, semitone, transpose, NOTE_NAMES } from "./notes";
import { qualities } from "../data/qualities";
import { shapes, type ChordShape } from "../data/shapes";

const MAX_FRET = 22;
const MAX_FINGER = 4;
const MAX_BARRE_REPEATS = 6;

type AnchoredShape = {
  shape: ChordShape;
  anchor: number;
};

export function getDisplayName(definition: ChordDefinition): string {
  if (definition.displayName) return definition.displayName;
  return definition.root + qualities[definition.quality].symbol;
}

// Lowest anchor fret >= minFret where this shape produces the target root.
function anchorFretFor(shape: ChordShape, root: ChordRootNote, minFret: number): number {
  const base = normalize(semitone(root) - semitone(shape.rootNote));
  let anchor = base;
  while (anchor < minFret) anchor += 12;
  return anchor;
}

// Whether a shape can physically be played at this anchor (fingers fit in 4).
function isPlayable(shape: ChordShape, anchor: number): boolean {
  if (anchor + Math.max(...shape.pattern.map((p) => p ?? 0)) > MAX_FRET) {
    return false;
  }
  if (anchor === 0) return true;
  // Barred: any pattern[i] === 0 becomes the barre with finger 1, others shift up by 1.
  let barreCount = 0;
  for (let i = 0; i < shape.pattern.length; i++) {
    const offset = shape.pattern[i];
    if (offset === null) continue;
    if (offset === 0) {
      barreCount++;
      continue;
    }
    const f = shape.openFingers[i];
    if (f != null && f + 1 > MAX_FINGER) return false;
  }
  return barreCount <= MAX_BARRE_REPEATS;
}

export function selectAnchoredShape(
  definition: ChordDefinition,
  startingFret: number,
): AnchoredShape | null {
  const candidates = shapes.filter((s) => s.qualityKey === definition.quality);
  if (candidates.length === 0) return null;

  const ranked = candidates
    .map((shape) => ({ shape, anchor: anchorFretFor(shape, definition.root, startingFret) }))
    .filter(({ shape, anchor }) => isPlayable(shape, anchor))
    .sort((a, b) => a.anchor - b.anchor);

  return ranked[0] ?? null;
}

// Build a Chord (high-e first to match existing ChordNote convention) for the
// given definition + minimum starting fret. Returns null if no shape fits.
export function buildVoicing(
  definition: ChordDefinition,
  startingFret: number,
): Chord | null {
  const picked = selectAnchoredShape(definition, startingFret);
  if (!picked) return null;
  const { shape, anchor } = picked;
  const isBarred = anchor > 0;

  // Build notes in low E -> high e order first.
  const lowToHigh: ChordNote[] = shape.pattern.map((offset, i) => {
    if (offset === null) {
      return { fret: null, finger: null };
    }
    const fret = anchor + offset;
    let finger: number | null;
    if (offset === 0) {
      finger = isBarred ? 1 : null;
    } else {
      const openFinger = shape.openFingers[i];
      finger = openFinger == null ? null : isBarred ? openFinger + 1 : openFinger;
    }
    return { fret, finger };
  });

  // Reverse to high-e first (array index 0 = high e) and assign `string` to
  // match existing convention (note.string = 5 for high e, 0 for low E).
  const notes: ChordNote[] = lowToHigh
    .slice()
    .reverse()
    .map((n, i) => ({ string: 5 - i, fret: n.fret, finger: n.finger }));

  return {
    name: getDisplayName(definition),
    startingFret: Math.max(1, anchor),
    notes,
  };
}

// Notes (pitch classes) produced by a chord definition.
export function chordPitchClasses(definition: ChordDefinition): ChordRootNote[] {
  return qualities[definition.quality].intervals.map((interval) =>
    transpose(definition.root, interval),
  );
}

export { NOTE_NAMES };
