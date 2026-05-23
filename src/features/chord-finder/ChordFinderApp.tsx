import { useState } from "react";
import { Eraser, Search, ToggleLeft, ToggleRight } from "lucide-react";
import type { Locale, Messages } from "@shared/types/i18n";
import { I18nProvider } from "@shared/i18n/I18nProvider";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Separator } from "@shared/ui/Separator";
import { ChordFinderFretboard } from "./components/ChordFinderFretboard";
import { ChordMatches } from "./components/ChordMatches";
import { StringControls } from "./components/StringControls";
import { describeNotes } from "./lib/chordMatcher";
import { useChordFinder } from "./hooks/useChordFinder";

function ChordFinder() {
  const finder = useChordFinder();
  const [showLabels, setShowLabels] = useState(true);
  const notes = describeNotes(finder.placedNotes, finder.tuning);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Search className="size-6 text-[var(--color-accent)]" />
            <CardTitle className="text-2xl font-bold">Chord Finder</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLabels((v) => !v)}
              aria-pressed={showLabels}
            >
              {showLabels ? (
                <ToggleRight className="mr-1 size-4" />
              ) : (
                <ToggleLeft className="mr-1 size-4" />
              )}
              Note labels
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={finder.clear}
              disabled={finder.placedNotes.length === 0}
            >
              <Eraser className="mr-1 size-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-[var(--color-fg-muted)]">
          Place notes on the fretboard the way you'd press them on your guitar.
          Each string holds one note; click again to remove. Use the string
          panel on the left to mark a string as open (○) or muted (×).
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <section
            aria-labelledby="chord-suggestions-heading"
            className="flex h-56 flex-col"
          >
            <h2
              id="chord-suggestions-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]"
            >
              Chord Suggestions
            </h2>
            <div className="flex-1 overflow-y-auto pr-1">
              <ChordMatches
                matches={finder.matches}
                selectedCount={finder.placedNotes.length}
              />
            </div>
          </section>

          <section
            aria-labelledby="notes-heading"
            className="flex h-56 flex-col"
          >
            <h2
              id="notes-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]"
            >
              Notes
            </h2>
            <p className="text-lg font-mono text-[var(--color-fg)]">
              {notes.length === 0
                ? "—"
                : Array.from(new Set(notes)).join(" · ")}
            </p>
          </section>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-[12rem_1fr] md:items-start">
          <StringControls
            tuning={finder.tuning}
            selection={finder.selection}
            onSetOpen={finder.setOpen}
            onMute={finder.muteString}
          />
          <ChordFinderFretboard
            tuning={finder.tuning}
            selection={finder.selection}
            onToggle={finder.toggleFret}
            showNoteLabels={showLabels}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChordFinderApp({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="container mx-auto max-w-6xl p-4 md:p-8">
        <ChordFinder />
      </div>
    </I18nProvider>
  );
}
