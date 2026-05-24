import { useTranslations } from "@shared/i18n/I18nProvider";
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

export function StringControls({ tuning, selection, onSetOpen, onMute }: Props) {
  const t = useTranslations("ChordFinder");
  const rows = Array.from({ length: STRING_COUNT }, (_, i) => i);

  return (
    <ul
      role="list"
      aria-label={t("strings.listLabel")}
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
              aria-hidden="true"
              className="w-6 text-center font-mono text-sm font-semibold text-[var(--color-fg)]"
            >
              {tuning[s]}
            </span>

            <div
              role="radiogroup"
              aria-label={t("strings.stateLabel", { string: tuning[s] })}
              className="flex items-center gap-1"
            >
              <StateButton
                label={t("strings.muteAria", { string: tuning[s] })}
                symbol="×"
                active={state === "muted"}
                onClick={() => onMute(s)}
              />
              <StateButton
                label={t("strings.openAria", { string: tuning[s] })}
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
                ? t("strings.muted")
                : state === "open"
                  ? t("strings.open", { string: tuning[s] })
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
