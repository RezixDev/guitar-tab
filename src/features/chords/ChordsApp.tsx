import { useEffect, useState } from "react";
import { Guitar, Music, Settings2 } from "lucide-react";
import type { ChordNote } from "@shared/types/chord";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { ChordSearch } from "./components/ChordSearch";
import { ChordTabs } from "./components/ChordTabs";
import { ChordDetails } from "./components/ChordDetails";
import { ChordSVG } from "./components/ChordSVG";
import { ViewDiagram } from "./components/ViewDiagram";
import { useChordState } from "./hooks/useChordState";

export default function ChordsApp() {
  const {
    currentChord,
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handleChordChange,
    handleNoteUpdate,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  } = useChordState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("classic");

  useEffect(() => {
    const stored = localStorage.getItem("chordTheme");
    if (stored) setSelectedTheme(stored);
  }, []);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem("chordTheme", theme);
  };

  const handleNoteChange = (index: number, field: keyof ChordNote, value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    handleNoteUpdate(index, { [field]: numValue });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center gap-3">
        <Guitar className="size-7 text-[var(--color-accent)]" />
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Chord Tool</h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5" />
              Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChordSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            <ChordTabs
              filteredStandardChords={filteredStandardChords}
              filteredExtendedChords={filteredExtendedChords}
              handleChordChange={handleChordChange}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="size-5" />
                Details
              </CardTitle>
              <ViewDiagram
                chord={currentChord}
                ChordSVGComponent={ChordSVG}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                selectedTheme={selectedTheme}
                onThemeChange={handleThemeChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ChordDetails
              chord={currentChord}
              onNameChange={handleNameChange}
              onStartingFretChange={handleStartingFretChange}
              onNoteChange={handleNoteChange}
              selectedTheme={selectedTheme}
              onThemeChange={handleThemeChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
