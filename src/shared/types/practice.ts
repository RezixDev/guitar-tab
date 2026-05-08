import type { Difficulty } from "./learn";

export type PracticeType =
  | "chromatic"
  | "scaleRun"
  | "stringSkipping"
  | "legato"
  | "picking"
  | "arpeggio";

/** Connector between two adjacent slots on the same string. */
export type Technique =
  | "h" // hammer-on
  | "p" // pull-off
  | "/" // slide up
  | "\\" // slide down
  | "~" // vibrato
  | "b" // bend
  | "r"; // release bend

export type TabNote = {
  /** Logical string index (0 = high E … 5 = low E). */
  string: number;
  fret: number;
  /** Visually accent this note (e.g. chord root). */
  highlight?: boolean;
};

export type TabSlot = {
  /** Notes played simultaneously at this slot. Empty array = rest. */
  notes: TabNote[];
  /**
   * Connection FROM the note(s) at this slot TO the next slot's note on the
   * same string. Rendered as a small letter between the two cells.
   */
  link?: Technique;
  /** Picking direction hint shown below the staff. */
  pick?: "d" | "u";
};

export type PracticeExercise = {
  id: string;
  type: PracticeType;
  difficulty: Difficulty;
  name: string;
  description: string;
  bpmSuggestion: { min: number; max: number };
  /** Number of slots per beat: 4 = 16ths, 3 = triplets, 2 = 8ths. */
  beatLength: 2 | 3 | 4;
  /** Sequence of subdivision slots, left → right. */
  slots: TabSlot[];
  /** Specific practice tip for this exercise. */
  tip?: string;
  /**
   * If set, the start-fret slider shifts every fret in the exercise by
   * `(startFret - baseFret)`. If unset, the exercise is rendered as-authored.
   */
  baseFret?: number;
};

export type { Difficulty };
