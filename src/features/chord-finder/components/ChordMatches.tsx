import { Badge } from "@shared/ui/Badge";
import type { ChordMatch } from "../lib/chordMatcher";

type Props = {
  matches: ChordMatch[];
  selectedCount: number;
};

export function ChordMatches({ matches, selectedCount }: Props) {
  if (selectedCount === 0) {
    return (
      <p className="text-sm text-[var(--color-fg-muted)]">
        Click frets on the fretboard to place notes. The chord name will appear
        here as soon as the notes form a recognizable chord.
      </p>
    );
  }

  if (matches.length === 0) {
    return (
      <p className="text-sm text-[var(--color-fg-muted)]">
        No chord matches those notes. Try adding or removing a note.
      </p>
    );
  }

  const exact = matches.filter((m) => m.exact);
  const partial = matches.filter((m) => !m.exact);

  return (
    <div className="space-y-4">
      {exact.length > 0 && (
        <Section title="Matches" matches={exact} />
      )}
      {partial.length > 0 && (
        <Section
          title="Possible chords (missing some tones)"
          matches={partial}
        />
      )}
    </div>
  );
}

function Section({ title, matches }: { title: string; matches: ChordMatch[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]">
        {title}
      </h3>
      <ul className="flex flex-wrap gap-2">
        {matches.slice(0, 12).map((m) => (
          <li key={`${m.root}-${m.quality}-${m.name}`}>
            <Badge
              variant={m.bassMatches ? "default" : "outline"}
              className="text-sm"
            >
              {m.name}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
