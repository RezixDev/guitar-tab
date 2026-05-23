import { calculateNote } from "@shared/music/notes";
import { STRING_COUNT } from "@shared/music/fretboardConstants";
import { cn } from "@shared/lib/cn";
import type { Tuning } from "@shared/types/music";

type Props = {
  tuning: Tuning;
  selection: Record<number, number>;
  onSetOpen: (stringIndex: number) => void;
  onMute: (stringIndex: number) => void;
};

type State = "muted" | "open" | "fretted";

/**
 * Per-string control column — one row per string in the same order as the
 * (flipped) fretboard. Each row is a labelled radio-like group with three
 * buttons: Mute (×), Open (○), and a readout of the currently played note.
 *
 * Designed to sit to the left of the fretboard so users can scan a single
 * vertical strip to see the whole hand position.
 */
export function StringControls({ tuning, selection, onSetOpen, onMute }: Props) {
  const rows = Array.from({ length: STRING_COUNT }, (_, i) => i);

  return (
    <ul
      role="list"
      aria-label="String controls"
      className="flex flex-col gap-2"
    >
      {rows.map((s) => {
        const fret = selection[s];
        const state: State =
          fret === undefined ? "muted" : fret === 0 ? "open" : "fretted";
        const note =
          state === "fretted" ? calculateNote(s, fret as number, tuning) : null;

        return (
          <li
            key={s}
            className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-1.5"
          >
            <span
              aria-label={`String ${s + 1} (${tuning[s]})`}
              className="w-6 text-center font-mono text-sm font-semibold text-[var(--color-fg)]"
            >
              {tuning[s]}
            </span>

            <div
              role="radiogroup"
              aria-label={`String ${tuning[s]} state`}
              className="flex items-center gap-1"
            >
              <StateButton
                label={`Mute string ${tuning[s]}`}
                symbol="×"
                active={state === "muted"}
                onClick={() => onMute(s)}
              />
              <StateButton
                label={`Play string ${tuning[s]} open`}
                symbol="○"
                active={state === "open"}
                onClick={() => onSetOpen(s)}
              />
            </div>

            <span
              className={cn(
                "ml-auto min-w-[3rem] text-right font-mono text-xs",
                state === "muted"
                  ? "text-[var(--color-fg-muted)]"
                  : "text-[var(--color-accent)]",
              )}
              aria-live="polite"
            >
              {state === "muted"
                ? "muted"
                : state === "open"
                  ? `${tuning[s]} (open)`
                  : `${note} · ${fret}`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function StateButton({
  label,
  symbol,
  active,
  onClick,
}: {
  label: string;
  symbol: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md border text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
          : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-fg)]",
      )}
    >
      <span aria-hidden="true">{symbol}</span>
    </button>
  );
}
