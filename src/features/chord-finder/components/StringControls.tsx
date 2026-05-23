import { calculateNote } from "@shared/music/notes";
import { STRING_COUNT } from "@shared/music/fretboardConstants";
import { Button } from "@shared/ui/Button";
import type { Tuning } from "@shared/types/music";

type Props = {
  tuning: Tuning;
  selection: Record<number, number>;
  onSetOpen: (stringIndex: number) => void;
  onMute: (stringIndex: number) => void;
};

/**
 * Per-string action row: open / mute toggles plus a readout of what's
 * currently selected on that string. Lives next to the fretboard because
 * the SVG only handles fret 1–12 clicks; open/mute lives here.
 */
export function StringControls({ tuning, selection, onSetOpen, onMute }: Props) {
  // Strings high e (0) to low E (5) — match the flipped fretboard layout.
  const rows = Array.from({ length: STRING_COUNT }, (_, i) => i);

  return (
    <div className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-x-3 gap-y-1.5 text-sm">
      {rows.map((s) => {
        const fret = selection[s];
        const isMuted = fret === undefined;
        const isOpen = fret === 0;
        return (
          <div key={s} className="contents">
            <span className="font-mono text-[var(--color-fg-muted)]">
              {tuning[s]}
            </span>
            <Button
              size="sm"
              variant={isOpen ? "primary" : "outline"}
              onClick={() => onSetOpen(s)}
              aria-pressed={isOpen}
            >
              Open
            </Button>
            <Button
              size="sm"
              variant={isMuted ? "primary" : "outline"}
              onClick={() => onMute(s)}
              aria-pressed={isMuted}
            >
              Mute
            </Button>
            <span className="text-[var(--color-fg-muted)]">
              {isMuted
                ? "—"
                : isOpen
                  ? `${tuning[s]} (open)`
                  : `${calculateNote(s, fret, tuning)} · fret ${fret}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
