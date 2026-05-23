import { calculateNote, getNoteIndex } from "@shared/music/notes";
import { NOTES } from "@shared/types/music";
import type { Tuning } from "@shared/types/music";
import { QUALITIES, type ChordQualityKey } from "./chordQualities";

/** A note placed on the fretboard. `string` = 0 (high e) … 5 (low E). */
export type PlacedNote = {
  string: number;
  fret: number; // 0 = open
};

export type ChordMatch = {
  root: string;
  quality: ChordQualityKey;
  name: string;
  /** 1.0 = exact match (selected pitches == chord tones); lower for partial. */
  score: number;
  /** True when the lowest selected note's pitch equals the chord root. */
  bassMatches: boolean;
  /** True when the selected pitch-class set equals the chord's pitch-class set. */
  exact: boolean;
};

const NOTE_LIST = NOTES as readonly string[];

function bassPitchClass(notes: PlacedNote[], tuning: Tuning): string | null {
  if (notes.length === 0) return null;
  // Lowest pitch = highest string index (low E = 5). Tie-break by lowest fret.
  let lowest = notes[0];
  for (const n of notes) {
    if (n.string > lowest.string) lowest = n;
    else if (n.string === lowest.string && n.fret < lowest.fret) lowest = n;
  }
  return calculateNote(lowest.string, lowest.fret, tuning);
}

function pitchClassSet(notes: PlacedNote[], tuning: Tuning): Set<number> {
  const set = new Set<number>();
  for (const n of notes) {
    const idx = getNoteIndex(calculateNote(n.string, n.fret, tuning));
    if (idx !== -1) set.add(idx);
  }
  return set;
}

function buildName(root: string, quality: ChordQualityKey, bassPc: string | null): string {
  const q = QUALITIES.find((x) => x.key === quality)!;
  const base = `${root}${q.symbol}`;
  if (bassPc && bassPc !== root) return `${base}/${bassPc}`;
  return base;
}

/**
 * Identify chords matching the placed notes.
 *
 * - Exact matches (selected pitches == chord tones) score 1.0.
 * - Subset matches (selected ⊂ chord tones) score < 1.0 by ratio.
 * - Adds slash-chord names when the bass note isn't the root.
 *
 * Results are sorted by exact-first, then bass-matches, then score, then chord
 * size (prefer simpler chord that explains the notes).
 */
export function findChords(notes: PlacedNote[], tuning: Tuning): ChordMatch[] {
  if (notes.length === 0) return [];

  const selected = pitchClassSet(notes, tuning);
  if (selected.size === 0) return [];

  const bassPc = bassPitchClass(notes, tuning);
  const bassIdx = bassPc ? getNoteIndex(bassPc) : -1;

  const matches: ChordMatch[] = [];

  for (let rootIdx = 0; rootIdx < 12; rootIdx++) {
    const root = NOTE_LIST[rootIdx];

    for (const q of QUALITIES) {
      const chordTones = new Set(q.intervals.map((i) => (rootIdx + i) % 12));

      // Selected must be a subset of chord tones — otherwise selection
      // contains notes that aren't part of this chord.
      let subset = true;
      for (const pc of selected) {
        if (!chordTones.has(pc)) {
          subset = false;
          break;
        }
      }
      if (!subset) continue;

      // Root must be among the selected notes; otherwise we're inventing a
      // chord no one is actually playing.
      if (!selected.has(rootIdx)) continue;

      const exact = selected.size === chordTones.size;

      // Partial matches that drop only one tone of a small triad are noisy —
      // skip "X major" when only two of three notes are present unless those
      // two notes ARE the chord (covered by the `5` quality).
      if (!exact && selected.size < chordTones.size - 1) continue;

      const bassMatches = bassIdx === rootIdx;
      const score = selected.size / chordTones.size;

      matches.push({
        root,
        quality: q.key,
        name: buildName(root, q.key, bassPc),
        score,
        bassMatches,
        exact,
      });
    }
  }

  matches.sort((a, b) => {
    if (a.exact !== b.exact) return a.exact ? -1 : 1;
    if (a.bassMatches !== b.bassMatches) return a.bassMatches ? -1 : 1;
    if (a.score !== b.score) return b.score - a.score;
    // Prefer simpler chord (fewer tones) when scores tie.
    const aSize = QUALITIES.find((q) => q.key === a.quality)!.intervals.length;
    const bSize = QUALITIES.find((q) => q.key === b.quality)!.intervals.length;
    return aSize - bSize;
  });

  return matches;
}

export function describeNotes(notes: PlacedNote[], tuning: Tuning): string[] {
  return notes.map((n) => calculateNote(n.string, n.fret, tuning));
}
