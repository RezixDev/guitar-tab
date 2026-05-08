type ShortcutProps = {
  description: string;
  keys: readonly string[];
};

type KeyboardControlsProps = {
  translations: {
    title: string;
    shortcuts: {
      navigate: string;
      selectNote: string;
      nextNote: string;
    };
  };
};

function Shortcut({ description, keys }: ShortcutProps) {
  return (
    <li className="flex items-center gap-2">
      <span className="text-[var(--color-fg-muted)]">{description}:</span>
      <div className="flex gap-1" aria-label={description}>
        {keys.map((keyLabel) => (
          <kbd
            key={`${description}-${keyLabel}`}
            className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-fg-muted)]"
          >
            {keyLabel}
          </kbd>
        ))}
      </div>
    </li>
  );
}

export function KeyboardControls({ translations }: KeyboardControlsProps) {
  const shortcuts: ShortcutProps[] = [
    { description: translations.shortcuts.navigate, keys: ["←", "↑", "↓", "→"] },
    { description: translations.shortcuts.selectNote, keys: ["Space"] },
    { description: translations.shortcuts.nextNote, keys: ["Enter"] },
  ];

  return (
    <section className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-4 text-sm">
      <h3 className="mb-3 font-medium">{translations.title}</h3>
      <ul className="flex flex-wrap gap-6">
        {shortcuts.map((s) => (
          <Shortcut key={s.description} description={s.description} keys={s.keys} />
        ))}
      </ul>
    </section>
  );
}
