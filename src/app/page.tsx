"use client";

import { useState } from "react";
import { ChordSearch } from "@/components/chords/ChordSearch";

import { ChordDetails } from "@/components/chords/ChordDetails";
import { ChordModal } from "@/components/chords/ChordModal";
import { useChordState } from "@/hooks/useChordState";
import { ChordSVG } from "@/components/chords/ChordSVG";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Guitar, Music, Settings2 } from "lucide-react";
import { ChordTabs } from "@/components/chords/ChordTabs";
import { FloatingChordViewer } from "@/components/chords/FloatingChordViewer";


export default function Page() {
  const {
    currentChord,
    searchTerm,
    filteredStandardChords,
    filteredExtendedChords,
    handleChordChange,
    handleInputChange,
    handleNameChange,
    handleStartingFretChange,
    handleSearchChange,
  } = useChordState();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-background">
      <div className="flex items-center gap-2 mb-8">
        <Guitar className="w-8 h-8" />
        <h1 className="text-4xl font-bold">Guitar Chord Tool</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Chord Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChordSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
			<ChordTabs
				filteredStandardChords={filteredStandardChords}
				filteredExtendedChords={filteredExtendedChords}
				handleChordChange={handleChordChange}
			/>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Chord Configuration
              </CardTitle>
			  <FloatingChordViewer 
                chord={currentChord}
                ChordSVGComponent={ChordSVG}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ChordDetails
              chord={currentChord}
              onNameChange={handleNameChange}
              onStartingFretChange={handleStartingFretChange}
              onNoteChange={handleInputChange}
            />
          </CardContent>
        </Card>
      </div>

      <ChordModal
        chord={currentChord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ChordSVGComponent={ChordSVG}
      />
    </div>
  );
}