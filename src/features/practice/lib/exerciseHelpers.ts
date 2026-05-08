import type { PracticeExercise, TabSlot } from "@shared/types/practice";

/**
 * Returns a copy of `exercise` with every fret shifted by `startFret - baseFret`.
 * Exercises without `baseFret` are returned unchanged.
 */
export function transposeExercise(exercise: PracticeExercise, startFret: number): PracticeExercise {
  if (exercise.baseFret == null) return exercise;
  const offset = startFret - exercise.baseFret;
  if (offset === 0) return exercise;
  return {
    ...exercise,
    slots: exercise.slots.map((slot) => ({
      ...slot,
      notes: slot.notes.map((n) => ({ ...n, fret: Math.max(0, n.fret + offset) })),
    })),
  };
}

/** Picks one element of `arr` uniformly at random. */
export function sample<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** ASCII-tab string for the copy-to-clipboard button. */
export function exerciseToAscii(exercise: PracticeExercise): string {
  const STRING_NAMES = ["e", "B", "G", "D", "A", "E"];
  const { slots, beatLength } = exercise;

  // First pass: figure out cell width per slot (max chars across all strings)
  const cellWidth = slots.map((slot, i) => {
    let max = 1; // "—"
    for (let s = 0; s < 6; s++) {
      const note = slot.notes.find((n) => n.string === s);
      const prevSlot = slots[i - 1];
      const prevNote = prevSlot?.notes.find((n) => n.string === s);
      const link = prevSlot?.link && prevNote && note ? prevSlot.link : "";
      const text = note ? `${link}${note.fret}` : "";
      if (text.length > max) max = text.length;
    }
    return Math.max(max, 2); // 2 chars minimum for legibility
  });

  const lines = STRING_NAMES.map((name, stringIdx) => {
    let row = `${name}|`;
    slots.forEach((slot, i) => {
      const note = slot.notes.find((n) => n.string === stringIdx);
      const prevSlot = slots[i - 1];
      const prevNote = prevSlot?.notes.find((n) => n.string === stringIdx);
      const link = prevSlot?.link && prevNote && note ? prevSlot.link : "";
      const text = note ? `${link}${note.fret}` : "-";
      row += text.padEnd(cellWidth[i], "-");
      // Beat divider
      if ((i + 1) % beatLength === 0 && i < slots.length - 1) row += "|";
      else row += "-";
    });
    return row + "|";
  });

  return lines.join("\n");
}

/** Convenience: transpose then convert to ASCII. */
export function exerciseToAsciiAt(exercise: PracticeExercise, startFret: number): string {
  return exerciseToAscii(transposeExercise(exercise, startFret));
}

/**
 * Filter the catalog by type/difficulty and pick a random match.
 * If `excludeId` is provided and there are other matches available, the
 * returned exercise is guaranteed to be different from `excludeId`.
 */
export function pickExercise(
  catalog: PracticeExercise[],
  type: PracticeExercise["type"],
  difficulty: PracticeExercise["difficulty"],
  excludeId?: string,
): PracticeExercise | null {
  const matches = catalog.filter(
    (e) => e.type === type && e.difficulty === difficulty,
  );
  if (matches.length === 0) return null;
  if (excludeId !== undefined) {
    const others = matches.filter((e) => e.id !== excludeId);
    if (others.length > 0) return sample(others);
    // Only the excluded match exists in this bucket — return it (callers can
    // also call `countMatches` ahead of time to disable the reroll button).
  }
  return sample(matches);
}

/** Number of exercises in the catalog matching `(type, difficulty)`. */
export function countMatches(
  catalog: PracticeExercise[],
  type: PracticeExercise["type"],
  difficulty: PracticeExercise["difficulty"],
): number {
  let n = 0;
  for (const e of catalog) if (e.type === type && e.difficulty === difficulty) n++;
  return n;
}

/** Helper for catalog authors: build a slot from a (string, fret) tuple list. */
export function chord(
  notes: Array<[string: number, fret: number]>,
  opts: Omit<TabSlot, "notes"> = {},
): TabSlot {
  return {
    notes: notes.map(([string, fret]) => ({ string, fret })),
    ...opts,
  };
}

/** Helper for catalog authors: a single-note slot. */
export function note(
  string: number,
  fret: number,
  opts: Omit<TabSlot, "notes"> = {},
): TabSlot {
  return { notes: [{ string, fret }], ...opts };
}

/** Helper for catalog authors: an empty (rest) slot. */
export function rest(opts: Omit<TabSlot, "notes"> = {}): TabSlot {
  return { notes: [], ...opts };
}
