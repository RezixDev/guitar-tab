"use client";

import { useState } from "react";
import { Guitar, Music, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChordSearch } from "@/components/chords/chordLibrary/ChordSearch";
import { ChordDetails } from "@/components/chords/chordDetails/ChordDetails";
import { ChordModal } from "@/components/chords/chordDetails/ChordModal";
import { ChordSVG } from "@/components/chords/chordDetails/ChordSVG";
import { ChordTabs } from "@/components/chords/chordLibrary/ChordTabs";
import { ViewDiagram } from "@/components/chords/chordDetails/ViewDiagram";
import { useChordState } from "@/hooks/useChordState";
import { Note } from "@/types/chord";

export default function Page() {
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


	const handleNoteChange = (
		index: number,
		field: keyof Note,
		value: string
	) => {
		const numValue = value === "" ? null : parseInt(value, 10);
		handleNoteUpdate(index, { [field]: numValue });
	};

	return (
		<main className="min-h-screen bg-background">
			{/* Header Section */}
			<header className="container mx-auto px-4 py-6 md:py-8">
				<div className="flex items-center gap-2 mb-4 md:mb-8">
					<Guitar className="w-6 h-6 md:w-8 md:h-8" />
					<h1 className="text-2xl md:text-4xl font-bold">Guitar Chord Tool</h1>
				</div>
			</header>

			{/* Main Content */}
			<section className="container mx-auto px-4 pb-6 md:pb-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
					{/* Chord Library Card */}
					<Card className="lg:col-span-1 h-fit">
						<CardHeader className="space-y-2">
							<CardTitle className="flex items-center gap-2 text-lg md:text-xl">
								<Music className="w-4 h-4 md:w-5 md:h-5" />
								Chord Library
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
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

					{/* Chord Configuration Card */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2 text-lg md:text-xl">
									<Settings2 className="w-4 h-4 md:w-5 md:h-5" />
									Chord Details
								</CardTitle>
								<ViewDiagram
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
								onNoteChange={handleNoteChange}
							/>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Modal */}
			<ChordModal
				chord={currentChord}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				ChordSVGComponent={ChordSVG}
			/>
		</main>
	);
}
