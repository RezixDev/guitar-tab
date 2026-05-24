import { PITCH_CLASS_NAMES, type Chromagram } from "../lib/chromagram";

type ChromagramBarsProps = {
  chroma: Chromagram;
  /** Pitch classes to highlight (the chord's notes). */
  highlight?: readonly number[];
};

export function ChromagramBars({ chroma, highlight }: ChromagramBarsProps) {
  // Normalize for display so the tallest bar always reaches the top.
  let max = 0;
  for (let i = 0; i < 12; i++) if (chroma[i] > max) max = chroma[i];
  const denom = max > 0 ? max : 1;
  const highlighted = new Set(highlight ?? []);

  return (
    <div
      className="grid grid-cols-12 gap-1 sm:gap-2"
      aria-label="Pitch class energy"
    >
      {PITCH_CLASS_NAMES.map((name, i) => {
        const pct = Math.round((chroma[i] / denom) * 100);
        const isHi = highlighted.has(i);
        return (
          <div key={name} className="flex flex-col items-center gap-1">
            <div className="relative h-24 w-full overflow-hidden rounded bg-[var(--color-bg)] sm:h-32">
              <div
                className={
                  isHi
                    ? "absolute bottom-0 left-0 right-0 bg-[var(--color-accent)] transition-[height] duration-75"
                    : "absolute bottom-0 left-0 right-0 bg-[var(--color-fg-muted)]/40 transition-[height] duration-75"
                }
                style={{ height: `${pct}%` }}
              />
            </div>
            <span
              className={
                "text-[10px] font-medium tabular-nums sm:text-xs " +
                (isHi
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-fg-muted)]")
              }
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
