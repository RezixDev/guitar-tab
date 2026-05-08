import type { PracticeExercise, PracticeType, TabSlot } from "@shared/types/practice";
import { note, rest } from "../lib/exerciseHelpers";

// Logical string indices: 0 = high E, 1 = B, 2 = G, 3 = D, 4 = A, 5 = low E
const HIGH_E = 0;
const B = 1;
const G = 2;
const D = 3;
const A = 4;
const LOW_E = 5;

/** Alternate-pick down/up pattern for a flat run of notes. */
const altPick = (slots: TabSlot[]): TabSlot[] =>
  slots.map((s, i) => ({ ...s, pick: i % 2 === 0 ? "d" : "u" }));

// ─── CHROMATIC / FINGER-INDEPENDENCE ───────────────────────────────────────

const SPIDER_1234: PracticeExercise = {
  id: "chromatic-spider-1234",
  type: "chromatic",
  difficulty: "beginner",
  name: "1-2-3-4 Spider",
  description: "Classic finger-per-fret walk on every string. Build hand sync.",
  bpmSuggestion: { min: 60, max: 90 },
  beatLength: 4,
  baseFret: 5,
  tip: "Keep every finger close to the fretboard. Don't lift higher than needed.",
  slots: altPick([
    note(LOW_E, 5), note(LOW_E, 6), note(LOW_E, 7), note(LOW_E, 8),
    note(A, 5),     note(A, 6),     note(A, 7),     note(A, 8),
    note(D, 5),     note(D, 6),     note(D, 7),     note(D, 8),
    note(G, 5),     note(G, 6),     note(G, 7),     note(G, 8),
    note(B, 5),     note(B, 6),     note(B, 7),     note(B, 8),
    note(HIGH_E, 5),note(HIGH_E, 6),note(HIGH_E, 7),note(HIGH_E, 8),
  ]),
};

const SPIDER_4321: PracticeExercise = {
  id: "chromatic-spider-4321",
  type: "chromatic",
  difficulty: "beginner",
  name: "4-3-2-1 Descending Spider",
  description: "Mirror of the classic spider — pull-style descending warmup.",
  bpmSuggestion: { min: 60, max: 90 },
  beatLength: 4,
  baseFret: 5,
  slots: altPick([
    note(HIGH_E, 8),note(HIGH_E, 7),note(HIGH_E, 6),note(HIGH_E, 5),
    note(B, 8),     note(B, 7),     note(B, 6),     note(B, 5),
    note(G, 8),     note(G, 7),     note(G, 6),     note(G, 5),
    note(D, 8),     note(D, 7),     note(D, 6),     note(D, 5),
    note(A, 8),     note(A, 7),     note(A, 6),     note(A, 5),
    note(LOW_E, 8),note(LOW_E, 7),note(LOW_E, 6),note(LOW_E, 5),
  ]),
};

const OUTSIDE_PICKING: PracticeExercise = {
  id: "chromatic-outside-picking",
  type: "chromatic",
  difficulty: "intermediate",
  name: "Outside Picking 1-3-2-4",
  description: "Skip-pattern for outside-picking technique. Watch the right hand.",
  bpmSuggestion: { min: 80, max: 130 },
  beatLength: 4,
  baseFret: 5,
  tip: "Pick stays outside the strings between notes — minimal movement.",
  slots: altPick([
    note(LOW_E, 5), note(LOW_E, 7), note(LOW_E, 6), note(LOW_E, 8),
    note(A, 5),     note(A, 7),     note(A, 6),     note(A, 8),
    note(D, 5),     note(D, 7),     note(D, 6),     note(D, 8),
    note(G, 5),     note(G, 7),     note(G, 6),     note(G, 8),
  ]),
};

const FINGER_INDEPENDENCE: PracticeExercise = {
  id: "chromatic-1+3-2+4",
  type: "chromatic",
  difficulty: "advanced",
  name: "1+3 / 2+4 Independence",
  description: "Pinch finger pairs together. Decoupling drill for the fretting hand.",
  bpmSuggestion: { min: 100, max: 140 },
  beatLength: 4,
  baseFret: 5,
  tip: "Each pair lands as a clean unison. Keep the unused fingers planted.",
  slots: altPick([
    { notes: [{ string: D, fret: 5 }, { string: B, fret: 7 }] },
    { notes: [{ string: D, fret: 6 }, { string: B, fret: 8 }] },
    { notes: [{ string: D, fret: 5 }, { string: B, fret: 7 }] },
    { notes: [{ string: D, fret: 6 }, { string: B, fret: 8 }] },
    { notes: [{ string: G, fret: 5 }, { string: HIGH_E, fret: 7 }] },
    { notes: [{ string: G, fret: 6 }, { string: HIGH_E, fret: 8 }] },
    { notes: [{ string: G, fret: 5 }, { string: HIGH_E, fret: 7 }] },
    { notes: [{ string: G, fret: 6 }, { string: HIGH_E, fret: 8 }] },
  ]),
};

// ─── SCALE RUNS ───────────────────────────────────────────────────────────

const A_MINOR_PENTATONIC_BOX1: PracticeExercise = {
  id: "scale-am-pentatonic-box1",
  type: "scaleRun",
  difficulty: "beginner",
  name: "A Minor Pentatonic — Box 1",
  description: "The first box that every rock/blues player learns. Root on the 5th fret of low E.",
  bpmSuggestion: { min: 80, max: 120 },
  beatLength: 4,
  tip: "Root notes are highlighted. Play ascending, then descending.",
  slots: altPick([
    { notes: [{ string: LOW_E, fret: 5, highlight: true }] },
    note(LOW_E, 8),
    note(A, 5),
    note(A, 7),
    note(D, 5),
    note(D, 7),
    note(G, 5),
    note(G, 7),
    note(B, 5),
    note(B, 8),
    { notes: [{ string: HIGH_E, fret: 5 }] },
    { notes: [{ string: HIGH_E, fret: 8, highlight: true }] },
  ]),
};

const C_MAJOR_3NPS: PracticeExercise = {
  id: "scale-cmaj-3nps",
  type: "scaleRun",
  difficulty: "intermediate",
  name: "C Major Scale — 3 Notes Per String",
  description: "C major (Ionian) using the modern 3-NPS layout. Trains symmetric runs.",
  bpmSuggestion: { min: 90, max: 140 },
  beatLength: 3,
  tip: "Triplet feel. Anchor your hand at the 7th fret and shift only when needed.",
  slots: altPick([
    { notes: [{ string: LOW_E, fret: 8, highlight: true }] },
    note(LOW_E, 10),
    note(LOW_E, 12),
    note(A, 8),
    note(A, 10),
    note(A, 12),
    note(D, 9),
    note(D, 10),
    note(D, 12),
    note(G, 9),
    note(G, 10),
    note(G, 12),
    note(B, 10),
    note(B, 12),
    note(B, 13),
    note(HIGH_E, 10),
    note(HIGH_E, 12),
    { notes: [{ string: HIGH_E, fret: 13, highlight: true }] },
  ]),
};

const E_MINOR_SEQUENCE: PracticeExercise = {
  id: "scale-em-sequence-1234",
  type: "scaleRun",
  difficulty: "advanced",
  name: "E Minor 4-Note Sequence",
  description: "Run the scale in groups of four — a classic shred building block.",
  bpmSuggestion: { min: 120, max: 170 },
  beatLength: 4,
  tip: "Pattern is 1-2-3-4, 2-3-4-5, 3-4-5-6 ... Keep alternate picking strict.",
  slots: altPick([
    note(LOW_E, 12), note(LOW_E, 14), note(LOW_E, 15), note(A, 12),
    note(LOW_E, 14), note(LOW_E, 15), note(A, 12),     note(A, 14),
    note(LOW_E, 15), note(A, 12),     note(A, 14),     note(A, 15),
    note(A, 12),     note(A, 14),     note(A, 15),     note(D, 12),
  ]),
};

// ─── STRING SKIPPING ──────────────────────────────────────────────────────

const OCTAVE_SKIP: PracticeExercise = {
  id: "skip-octaves",
  type: "stringSkipping",
  difficulty: "beginner",
  name: "Octave Skips",
  description: "Root note + its octave on the next-but-one string. Mute the in-between string.",
  bpmSuggestion: { min: 70, max: 110 },
  beatLength: 2,
  tip: "Use the index finger to mute the skipped string. Aim for a clean, percussive sound.",
  slots: [
    note(LOW_E, 5, { pick: "d" }), note(D, 7, { pick: "u" }),
    note(LOW_E, 7, { pick: "d" }), note(D, 9, { pick: "u" }),
    note(A, 5, { pick: "d" }),     note(G, 7, { pick: "u" }),
    note(A, 7, { pick: "d" }),     note(G, 9, { pick: "u" }),
  ],
};

const PENTATONIC_SKIPS: PracticeExercise = {
  id: "skip-pentatonic",
  type: "stringSkipping",
  difficulty: "intermediate",
  name: "A Minor Pentatonic Skips",
  description: "The Box 1 pentatonic, but skipping a string between notes.",
  bpmSuggestion: { min: 90, max: 130 },
  beatLength: 4,
  slots: altPick([
    note(LOW_E, 5), note(D, 7),     note(LOW_E, 8), note(D, 5),
    note(A, 5),     note(G, 7),     note(A, 7),     note(G, 5),
    note(D, 5),     note(B, 5),     note(D, 7),     note(B, 8),
    note(G, 5),     note(HIGH_E, 5),note(G, 7),     note(HIGH_E, 8),
  ]),
};

const WIDE_INTERVALS: PracticeExercise = {
  id: "skip-wide-intervals",
  type: "stringSkipping",
  difficulty: "advanced",
  name: "Wide Interval Sequence",
  description: "Major-7th leaps between non-adjacent strings. Trains pick accuracy under stretch.",
  bpmSuggestion: { min: 100, max: 150 },
  beatLength: 4,
  slots: altPick([
    note(LOW_E, 7), note(G, 5),     note(A, 7),     note(B, 5),
    note(LOW_E, 9), note(G, 7),     note(A, 9),     note(B, 7),
    note(A, 7),     note(B, 5),     note(D, 7),     note(HIGH_E, 5),
    note(A, 9),     note(B, 7),     note(D, 9),     note(HIGH_E, 7),
  ]),
};

// ─── LEGATO ───────────────────────────────────────────────────────────────

const HAMMER_PAIRS: PracticeExercise = {
  id: "legato-hammer-pairs",
  type: "legato",
  difficulty: "beginner",
  name: "Hammer-On Pairs",
  description: "Pick once per string, hammer on the second note. Build forearm endurance.",
  bpmSuggestion: { min: 70, max: 110 },
  beatLength: 2,
  tip: "Only the first note of each pair is picked. The hammer must ring clearly.",
  baseFret: 5,
  slots: [
    note(LOW_E, 5, { pick: "d", link: "h" }), note(LOW_E, 7),
    note(A, 5,     { pick: "d", link: "h" }), note(A, 7),
    note(D, 5,     { pick: "d", link: "h" }), note(D, 7),
    note(G, 5,     { pick: "d", link: "h" }), note(G, 7),
    note(B, 5,     { pick: "d", link: "h" }), note(B, 7),
    note(HIGH_E, 5,{ pick: "d", link: "h" }), note(HIGH_E, 7),
  ],
};

const TRILL_WORKOUT: PracticeExercise = {
  id: "legato-trill",
  type: "legato",
  difficulty: "intermediate",
  name: "Trill Workout",
  description: "Hammer-pull trill — one of the fastest ways to build legato strength.",
  bpmSuggestion: { min: 100, max: 160 },
  beatLength: 4,
  tip: "Pick the first note only. Maintain even rhythm and clear note separation.",
  baseFret: 5,
  slots: [
    note(G, 5, { pick: "d", link: "h" }),
    note(G, 7, { link: "p" }),
    note(G, 5, { link: "h" }),
    note(G, 7, { link: "p" }),
    note(G, 5, { link: "h" }),
    note(G, 7, { link: "p" }),
    note(G, 5, { link: "h" }),
    note(G, 7),
    note(B, 5, { pick: "d", link: "h" }),
    note(B, 7, { link: "p" }),
    note(B, 5, { link: "h" }),
    note(B, 7, { link: "p" }),
    note(B, 5, { link: "h" }),
    note(B, 7, { link: "p" }),
    note(B, 5, { link: "h" }),
    note(B, 7),
  ],
};

const SATRIANI_LEGATO: PracticeExercise = {
  id: "legato-3-note-cascade",
  type: "legato",
  difficulty: "advanced",
  name: "3-Note Legato Cascade",
  description: "Pick once, then hammer + pull a 3-note cell. Satriani-style speed builder.",
  bpmSuggestion: { min: 120, max: 180 },
  beatLength: 3,
  tip: "Triplet groups. Pick only on each downbeat; the hammers do the rest.",
  baseFret: 5,
  slots: [
    note(HIGH_E, 5, { pick: "d", link: "h" }),
    note(HIGH_E, 7, { link: "h" }),
    note(HIGH_E, 8, { link: "p" }),
    note(HIGH_E, 7, { pick: "d", link: "p" }),
    note(HIGH_E, 5, { link: "h" }),
    note(HIGH_E, 7),
    note(B, 5, { pick: "d", link: "h" }),
    note(B, 7, { link: "h" }),
    note(B, 8, { link: "p" }),
    note(B, 7, { pick: "d", link: "p" }),
    note(B, 5, { link: "h" }),
    note(B, 7),
  ],
};

// ─── PICKING ──────────────────────────────────────────────────────────────

const SINGLE_STRING_PICK: PracticeExercise = {
  id: "picking-single-string",
  type: "picking",
  difficulty: "beginner",
  name: "Single-String Alternate Picking",
  description: "Strict down-up alternation on one note. The foundation of pick technique.",
  bpmSuggestion: { min: 60, max: 100 },
  beatLength: 4,
  tip: "Watch the picking-direction row at the bottom. Stay strict.",
  baseFret: 5,
  slots: altPick(Array.from({ length: 16 }, () => note(B, 5))),
};

const GALLOP_RHYTHM: PracticeExercise = {
  id: "picking-gallop",
  type: "picking",
  difficulty: "intermediate",
  name: "Gallop Rhythm",
  description: "Down-down-up grouped triplet — Iron Maiden territory.",
  bpmSuggestion: { min: 100, max: 160 },
  beatLength: 3,
  tip: "Each beat: ▼ ▼ ▲. Keep the gallop tight against the metronome.",
  slots: [
    note(LOW_E, 0, { pick: "d" }), note(LOW_E, 0, { pick: "d" }), note(LOW_E, 0, { pick: "u" }),
    note(LOW_E, 0, { pick: "d" }), note(LOW_E, 0, { pick: "d" }), note(LOW_E, 0, { pick: "u" }),
    note(A, 2,     { pick: "d" }), note(A, 2,     { pick: "d" }), note(A, 2,     { pick: "u" }),
    note(A, 2,     { pick: "d" }), note(A, 2,     { pick: "d" }), note(A, 2,     { pick: "u" }),
  ],
};

const TWO_STRING_PICK: PracticeExercise = {
  id: "picking-two-string-16ths",
  type: "picking",
  difficulty: "advanced",
  name: "16th-Note Two-String Burst",
  description: "Aggressive alternate picking across two strings. Watch the elbow.",
  bpmSuggestion: { min: 130, max: 180 },
  beatLength: 4,
  baseFret: 5,
  slots: altPick([
    note(B, 5), note(HIGH_E, 5), note(B, 7), note(HIGH_E, 5),
    note(B, 5), note(HIGH_E, 8), note(B, 7), note(HIGH_E, 8),
    note(B, 5), note(HIGH_E, 5), note(B, 7), note(HIGH_E, 5),
    note(B, 5), note(HIGH_E, 8), note(B, 7), note(HIGH_E, 8),
  ]),
};

// ─── ARPEGGIOS ────────────────────────────────────────────────────────────

const C_MAJOR_TRIAD: PracticeExercise = {
  id: "arpeggio-cmaj-triad",
  type: "arpeggio",
  difficulty: "beginner",
  name: "C Major Triad Arpeggio",
  description: "C-E-G across three strings. The shape every chord is built from.",
  bpmSuggestion: { min: 70, max: 120 },
  beatLength: 3,
  tip: "Roots highlighted. Let each note ring into the next for a chord-like effect.",
  slots: altPick([
    { notes: [{ string: A, fret: 3, highlight: true }] },
    note(D, 5),
    note(G, 5),
    { notes: [{ string: A, fret: 3, highlight: true }] },
    note(D, 5),
    note(G, 5),
    note(G, 5),
    note(D, 5),
    { notes: [{ string: A, fret: 3, highlight: true }] },
    note(G, 5),
    note(D, 5),
    { notes: [{ string: A, fret: 3, highlight: true }] },
  ]),
};

const A_MINOR_ARPEGGIO: PracticeExercise = {
  id: "arpeggio-am-3string",
  type: "arpeggio",
  difficulty: "intermediate",
  name: "A Minor Sweep (3-String)",
  description: "Three-string sweep arpeggio. The first step toward neoclassical chops.",
  bpmSuggestion: { min: 90, max: 130 },
  beatLength: 3,
  tip: "Sweep down with ONE pick stroke through the 3 ascending notes; pull-off on the descent.",
  slots: [
    { notes: [{ string: G, fret: 2, highlight: true }], pick: "d" },
    note(B, 5, { pick: "d" }),
    note(HIGH_E, 5, { pick: "d", link: "p" }),
    note(HIGH_E, 8, { link: "p" }),
    note(HIGH_E, 5, { pick: "u" }),
    note(B, 5, { pick: "u" }),
    { notes: [{ string: G, fret: 2, highlight: true }], pick: "u" },
    rest(),
  ],
};

const MAJ7_ARPEGGIO: PracticeExercise = {
  id: "arpeggio-cmaj7",
  type: "arpeggio",
  difficulty: "advanced",
  name: "Cmaj7 Arpeggio Cascade",
  description: "C-E-G-B across four strings with hammer-pull connectors.",
  bpmSuggestion: { min: 110, max: 160 },
  beatLength: 4,
  slots: [
    { notes: [{ string: A, fret: 3, highlight: true }], pick: "d", link: "h" },
    note(A, 7, { pick: "d" }),
    note(D, 5, { pick: "u" }),
    note(D, 9, { pick: "d", link: "h" }),
    note(G, 5, { pick: "u" }),
    note(G, 9, { pick: "d", link: "h" }),
    note(B, 5, { pick: "u" }),
    { notes: [{ string: B, fret: 8, highlight: true }], pick: "d" },
    note(HIGH_E, 5, { pick: "u" }),
    note(HIGH_E, 8, { pick: "d", link: "p" }),
    note(HIGH_E, 5, { pick: "u" }),
    note(B, 5, { pick: "d" }),
    note(B, 8, { pick: "u", link: "p" }),
    note(B, 5, { pick: "d" }),
    note(G, 5, { pick: "u" }),
    note(G, 9, { pick: "d" }),
  ],
};

// ─── ADDITIONAL VARIANTS (so every bucket has ≥2 exercises) ───────────────

const SPIDER_SHIFT: PracticeExercise = {
  id: "chromatic-spider-shift",
  type: "chromatic",
  difficulty: "intermediate",
  name: "Spider Walk Up the Neck",
  description: "1-2-3-4 across all strings, then shift up one fret and repeat.",
  bpmSuggestion: { min: 80, max: 130 },
  beatLength: 4,
  baseFret: 5,
  tip: "After the 6th string, move every finger up one fret without losing the rhythm.",
  slots: altPick([
    note(LOW_E, 5), note(LOW_E, 6), note(LOW_E, 7), note(LOW_E, 8),
    note(A, 5),     note(A, 6),     note(A, 7),     note(A, 8),
    note(D, 5),     note(D, 6),     note(D, 7),     note(D, 8),
    note(G, 6),     note(G, 7),     note(G, 8),     note(G, 9),
    note(B, 6),     note(B, 7),     note(B, 8),     note(B, 9),
    note(HIGH_E, 6),note(HIGH_E, 7),note(HIGH_E, 8),note(HIGH_E, 9),
  ]),
};

const TRILL_SPIDER: PracticeExercise = {
  id: "chromatic-trill-spider",
  type: "chromatic",
  difficulty: "advanced",
  name: "Trill Spider",
  description: "1-2 trill on each string for one beat, then advance.",
  bpmSuggestion: { min: 110, max: 160 },
  beatLength: 4,
  baseFret: 5,
  tip: "Pick only the first note of each string. The trill creates the rest.",
  slots: [
    note(LOW_E, 5, { pick: "d", link: "h" }), note(LOW_E, 6, { link: "p" }),
    note(LOW_E, 5, { link: "h" }),            note(LOW_E, 6),
    note(A, 5, { pick: "d", link: "h" }),     note(A, 6, { link: "p" }),
    note(A, 5, { link: "h" }),                note(A, 6),
    note(D, 5, { pick: "d", link: "h" }),     note(D, 6, { link: "p" }),
    note(D, 5, { link: "h" }),                note(D, 6),
    note(G, 5, { pick: "d", link: "h" }),     note(G, 6, { link: "p" }),
    note(G, 5, { link: "h" }),                note(G, 6),
  ],
};

const C_MAJOR_OPEN: PracticeExercise = {
  id: "scale-cmaj-open",
  type: "scaleRun",
  difficulty: "beginner",
  name: "C Major Scale (Open Position)",
  description: "Seven-note C major using open strings — the first scale most beginners learn.",
  bpmSuggestion: { min: 60, max: 100 },
  beatLength: 4,
  tip: "Mind the open A and high-E strings — they're notes, not skipped.",
  slots: altPick([
    { notes: [{ string: A, fret: 3, highlight: true }] },
    note(D, 0),
    note(D, 2),
    note(D, 3),
    note(G, 0),
    note(G, 2),
    note(B, 0),
    note(B, 1),
    { notes: [{ string: B, fret: 3, highlight: true }] },
    note(HIGH_E, 0),
    note(HIGH_E, 1),
    note(HIGH_E, 3),
  ]),
};

const G_MAJOR_3NPS: PracticeExercise = {
  id: "scale-gmaj-3nps",
  type: "scaleRun",
  difficulty: "intermediate",
  name: "G Major Scale — 3 Notes Per String",
  description: "G major (Ionian) using the modern 3-NPS layout. Symmetrical run.",
  bpmSuggestion: { min: 90, max: 140 },
  beatLength: 3,
  tip: "Triplets. Each string gets exactly 3 notes — anchor on the 3rd fret of the low E.",
  slots: altPick([
    { notes: [{ string: LOW_E, fret: 3, highlight: true }] },
    note(LOW_E, 5),
    note(LOW_E, 7),
    note(A, 3),
    note(A, 5),
    note(A, 7),
    note(D, 4),
    note(D, 5),
    note(D, 7),
    note(G, 4),
    note(G, 5),
    note(G, 7),
    note(B, 5),
    note(B, 7),
    note(B, 8),
    note(HIGH_E, 5),
    note(HIGH_E, 7),
    { notes: [{ string: HIGH_E, fret: 8, highlight: true }] },
  ]),
};

const A_DORIAN_RUN: PracticeExercise = {
  id: "scale-a-dorian",
  type: "scaleRun",
  difficulty: "advanced",
  name: "A Dorian 3-NPS Run",
  description: "A Dorian mode (A-B-C-D-E-F#-G). The 'jazzy minor' sound.",
  bpmSuggestion: { min: 120, max: 170 },
  beatLength: 3,
  tip: "Listen for the major 6th (F#) — that's the Dorian color tone.",
  slots: altPick([
    { notes: [{ string: LOW_E, fret: 5, highlight: true }] },
    note(LOW_E, 7),
    note(LOW_E, 8),
    note(A, 5),
    note(A, 7),
    note(A, 9),
    note(D, 5),
    note(D, 7),
    note(D, 9),
    note(G, 5),
    note(G, 7),
    note(G, 9),
    note(B, 5),
    note(B, 7),
    note(B, 8),
    note(HIGH_E, 5),
    note(HIGH_E, 7),
    note(HIGH_E, 9),
  ]),
};

const PULL_OFF_PAIRS: PracticeExercise = {
  id: "legato-pulloff-pairs",
  type: "legato",
  difficulty: "beginner",
  name: "Pull-Off Pairs",
  description: "Mirror of Hammer-On Pairs — pull the second note back to the first.",
  bpmSuggestion: { min: 70, max: 110 },
  beatLength: 2,
  baseFret: 5,
  tip: "Snap the pull-off finger sideways — don't just lift it.",
  slots: [
    note(HIGH_E, 7, { pick: "d", link: "p" }), note(HIGH_E, 5),
    note(B, 7,      { pick: "d", link: "p" }), note(B, 5),
    note(G, 7,      { pick: "d", link: "p" }), note(G, 5),
    note(D, 7,      { pick: "d", link: "p" }), note(D, 5),
    note(A, 7,      { pick: "d", link: "p" }), note(A, 5),
    note(LOW_E, 7,  { pick: "d", link: "p" }), note(LOW_E, 5),
  ],
};

const HAMMER_CHAIN: PracticeExercise = {
  id: "legato-hammer-chain",
  type: "legato",
  difficulty: "intermediate",
  name: "3-Note Hammer Chain",
  description: "One pick, two hammer-ons. Builds left-hand strength on every string.",
  bpmSuggestion: { min: 100, max: 150 },
  beatLength: 3,
  baseFret: 5,
  tip: "Only beat 1 of each string is picked. Hammers must be loud and clear.",
  slots: [
    note(LOW_E, 5, { pick: "d", link: "h" }), note(LOW_E, 7, { link: "h" }), note(LOW_E, 8),
    note(A, 5,     { pick: "d", link: "h" }), note(A, 7,     { link: "h" }), note(A, 8),
    note(D, 5,     { pick: "d", link: "h" }), note(D, 7,     { link: "h" }), note(D, 8),
    note(G, 5,     { pick: "d", link: "h" }), note(G, 7,     { link: "h" }), note(G, 8),
  ],
};

const OPEN_DRONE: PracticeExercise = {
  id: "picking-open-drone",
  type: "picking",
  difficulty: "beginner",
  name: "Open-String Drone",
  description: "Alternate-pick the open low E. Pure right-hand mechanics.",
  bpmSuggestion: { min: 60, max: 100 },
  beatLength: 4,
  tip: "Keep the wrist relaxed. The pick should barely clear the string.",
  slots: altPick(Array.from({ length: 16 }, () => note(LOW_E, 0))),
};

const TREMOLO_BURSTS: PracticeExercise = {
  id: "picking-tremolo-bursts",
  type: "picking",
  difficulty: "intermediate",
  name: "Tremolo Bursts",
  description: "Four 16th-note bursts on a single high note. Surf-rock style.",
  bpmSuggestion: { min: 110, max: 160 },
  beatLength: 4,
  baseFret: 7,
  tip: "All down-up-down-up. The motion comes from the wrist, not the elbow.",
  slots: altPick([
    note(HIGH_E, 7), note(HIGH_E, 7), note(HIGH_E, 7), note(HIGH_E, 7),
    note(HIGH_E, 7), note(HIGH_E, 7), note(HIGH_E, 7), note(HIGH_E, 7),
    note(HIGH_E, 9), note(HIGH_E, 9), note(HIGH_E, 9), note(HIGH_E, 9),
    note(HIGH_E, 9), note(HIGH_E, 9), note(HIGH_E, 9), note(HIGH_E, 9),
  ]),
};

const ECONOMY_PICKING: PracticeExercise = {
  id: "picking-economy",
  type: "picking",
  difficulty: "advanced",
  name: "Economy Picking Sequence",
  description: "When changing strings, sweep through with a single direction.",
  bpmSuggestion: { min: 130, max: 180 },
  beatLength: 3,
  baseFret: 5,
  tip: "When you cross strings going UP, two consecutive ▼ picks. Going down: two ▲.",
  slots: [
    note(D, 5,  { pick: "d" }), note(D, 7,  { pick: "u" }), note(D, 9,  { pick: "d" }),
    note(G, 5,  { pick: "d" }), note(G, 7,  { pick: "u" }), note(G, 9,  { pick: "d" }),
    note(B, 5,  { pick: "d" }), note(B, 7,  { pick: "u" }), note(B, 8,  { pick: "d" }),
    note(HIGH_E, 5, { pick: "d" }), note(HIGH_E, 7, { pick: "u" }), note(HIGH_E, 8, { pick: "d" }),
  ],
};

const A_MINOR_TRIAD: PracticeExercise = {
  id: "arpeggio-am-triad",
  type: "arpeggio",
  difficulty: "beginner",
  name: "A Minor Triad Arpeggio",
  description: "A-C-E across three strings. The minor counterpart to the C major triad.",
  bpmSuggestion: { min: 70, max: 120 },
  beatLength: 3,
  tip: "Roots highlighted. Notice the b3 (C) — that's what makes it minor.",
  slots: altPick([
    { notes: [{ string: A, fret: 0, highlight: true }] },
    note(D, 2),
    note(G, 2),
    { notes: [{ string: A, fret: 0, highlight: true }] },
    note(D, 2),
    note(G, 2),
    note(G, 2),
    note(D, 2),
    { notes: [{ string: A, fret: 0, highlight: true }] },
    note(G, 2),
    note(D, 2),
    { notes: [{ string: A, fret: 0, highlight: true }] },
  ]),
};

const STRING_SKIP_OCTAVES_UP: PracticeExercise = {
  id: "skip-octaves-up",
  type: "stringSkipping",
  difficulty: "beginner",
  name: "Octave Climb",
  description: "Walk a chromatic line in octaves up the neck.",
  bpmSuggestion: { min: 70, max: 110 },
  beatLength: 2,
  tip: "Index mutes the middle string. The two notes should sound as one fat unison.",
  slots: [
    { notes: [{ string: LOW_E, fret: 3 }, { string: D, fret: 5 }], pick: "d" },
    { notes: [{ string: LOW_E, fret: 5 }, { string: D, fret: 7 }], pick: "u" },
    { notes: [{ string: LOW_E, fret: 7 }, { string: D, fret: 9 }], pick: "d" },
    { notes: [{ string: LOW_E, fret: 8 }, { string: D, fret: 10 }], pick: "u" },
    { notes: [{ string: A, fret: 3 }, { string: G, fret: 5 }], pick: "d" },
    { notes: [{ string: A, fret: 5 }, { string: G, fret: 7 }], pick: "u" },
    { notes: [{ string: A, fret: 7 }, { string: G, fret: 9 }], pick: "d" },
    { notes: [{ string: A, fret: 8 }, { string: G, fret: 10 }], pick: "u" },
  ],
};

// ─── CATALOG ──────────────────────────────────────────────────────────────

export const EXERCISE_CATALOG: PracticeExercise[] = [
  // chromatic
  SPIDER_1234,
  SPIDER_4321,
  OUTSIDE_PICKING,
  SPIDER_SHIFT,
  FINGER_INDEPENDENCE,
  TRILL_SPIDER,
  // scaleRun
  A_MINOR_PENTATONIC_BOX1,
  C_MAJOR_OPEN,
  C_MAJOR_3NPS,
  G_MAJOR_3NPS,
  E_MINOR_SEQUENCE,
  A_DORIAN_RUN,
  // stringSkipping
  OCTAVE_SKIP,
  STRING_SKIP_OCTAVES_UP,
  PENTATONIC_SKIPS,
  WIDE_INTERVALS,
  // legato
  HAMMER_PAIRS,
  PULL_OFF_PAIRS,
  TRILL_WORKOUT,
  HAMMER_CHAIN,
  SATRIANI_LEGATO,
  // picking
  SINGLE_STRING_PICK,
  OPEN_DRONE,
  GALLOP_RHYTHM,
  TREMOLO_BURSTS,
  TWO_STRING_PICK,
  ECONOMY_PICKING,
  // arpeggio
  C_MAJOR_TRIAD,
  A_MINOR_TRIAD,
  A_MINOR_ARPEGGIO,
  MAJ7_ARPEGGIO,
];

export const PRACTICE_TYPES: PracticeType[] = [
  "chromatic",
  "scaleRun",
  "stringSkipping",
  "legato",
  "picking",
  "arpeggio",
];

export const PRACTICE_TYPE_LABELS: Record<PracticeType, string> = {
  chromatic: "Chromatic / Spider",
  scaleRun: "Scale Run",
  stringSkipping: "String Skipping",
  legato: "Legato",
  picking: "Picking",
  arpeggio: "Arpeggio",
};
