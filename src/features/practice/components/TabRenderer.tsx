import { Fragment } from "react";
import { cn } from "@shared/lib/cn";
import type { PracticeExercise } from "@shared/types/practice";

type TabRendererProps = {
  exercise: PracticeExercise;
};

// Top-down: high E first (matches `string: 0`), low E last.
const STRING_LABELS = ["e", "B", "G", "D", "A", "E"];

const PICK_GLYPH = { d: "▼", u: "▲" } as const;

/**
 * Returns the count syllable for a slot inside its beat — e.g. "1 e + a" for
 * 16ths, "1 + a" for triplets, "1 +" for 8ths.
 */
function beatLabel(slotIndex: number, beatLength: 2 | 3 | 4): string {
  const beatNumber = Math.floor(slotIndex / beatLength) + 1;
  const sub = slotIndex % beatLength;
  if (sub === 0) return String(beatNumber);
  if (beatLength === 4) return ["", "e", "+", "a"][sub] ?? "";
  if (beatLength === 3) return ["", "+", "a"][sub] ?? "";
  return "+";
}

export function TabRenderer({ exercise }: TabRendererProps) {
  const { slots, beatLength } = exercise;
  // grid: [label-col, ...slot-cols]
  const gridTemplate = `28px repeat(${slots.length}, minmax(28px, 1fr))`;

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div
        className="grid font-mono text-sm"
        style={{ gridTemplateColumns: gridTemplate, minWidth: "min-content" }}
      >
        {/* 6 string rows */}
        {STRING_LABELS.map((name, stringIdx) => (
          <Fragment key={name}>
            <div className="flex items-center justify-end pr-2 text-[var(--color-fg-muted)]">
              {name}
            </div>
            {slots.map((slot, slotIdx) => {
              const noteOnString = slot.notes.find((n) => n.string === stringIdx);
              const prevSlot = slots[slotIdx - 1];
              const prevNote = prevSlot?.notes.find((n) => n.string === stringIdx);
              const showLink =
                prevSlot?.link && prevNote && noteOnString
                  ? prevSlot.link
                  : null;
              // Beat boundary — left border every `beatLength` slots, except the very first
              const isBeatStart =
                slotIdx > 0 && slotIdx % beatLength === 0;

              return (
                <div
                  key={slotIdx}
                  className={cn(
                    "relative flex h-7 items-center justify-center",
                    "border-b border-[var(--color-border)]/40",
                    isBeatStart && "border-l-2 border-l-[var(--color-border)]",
                  )}
                >
                  {/* Background fill line so the row reads as a string */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-[var(--color-border)]/60" />

                  {showLink && (
                    <span
                      className="absolute -left-1 top-0 text-[10px] leading-none text-[var(--color-fg-muted)]"
                      aria-hidden="true"
                    >
                      {showLink}
                    </span>
                  )}

                  {noteOnString ? (
                    <span
                      className={cn(
                        "relative z-10 inline-flex min-w-[1.25rem] items-center justify-center rounded px-1 leading-none",
                        noteOnString.highlight
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)] font-semibold"
                          : "bg-[var(--color-bg-elevated)] text-[var(--color-fg)]",
                      )}
                    >
                      {noteOnString.fret}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </Fragment>
        ))}

        {/* Picking direction row */}
        <div />
        {slots.map((slot, i) => (
          <div
            key={`pick-${i}`}
            className={cn(
              "flex h-5 items-center justify-center text-xs text-[var(--color-fg-muted)]",
              i > 0 &&
                i % beatLength === 0 &&
                "border-l-2 border-l-[var(--color-border)]",
            )}
            aria-hidden="true"
          >
            {slot.pick ? PICK_GLYPH[slot.pick] : ""}
          </div>
        ))}

        {/* Beat-count row */}
        <div />
        {slots.map((_, i) => (
          <div
            key={`beat-${i}`}
            className={cn(
              "flex h-5 items-center justify-center text-[11px]",
              i % beatLength === 0
                ? "font-semibold text-[var(--color-fg)]"
                : "text-[var(--color-fg-muted)]",
              i > 0 &&
                i % beatLength === 0 &&
                "border-l-2 border-l-[var(--color-border)]",
            )}
            aria-hidden="true"
          >
            {beatLabel(i, beatLength)}
          </div>
        ))}
      </div>
    </div>
  );
}
