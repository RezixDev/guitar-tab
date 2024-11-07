"use client";

import { useState } from "react";
import { ChordSearch } from "@/components/chords/ChordSearch";
import { ChordList } from "@/components/chords/ChordList";
import { ChordDetails } from "@/components/chords/ChordDetails";
import { ChordModal } from "@/components/chords/ChordModal";
import { useChordState } from "@/hooks/useChordState";
import { ChordSVG } from "@/components/chords/ChordSVG";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Guitar, Music, Settings2 } from "lucide-react";

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
						<Tabs defaultValue="standard" className="mt-4">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="standard">Standard</TabsTrigger>
								<TabsTrigger value="extended">Extended</TabsTrigger>
							</TabsList>
							<TabsContent value="standard">
								<ScrollArea className="h-[400px] pr-4">
									<ChordList
										title="Standard Chords"
										chords={filteredStandardChords}
										onChordSelect={handleChordChange}
									/>
								</ScrollArea>
							</TabsContent>
							<TabsContent value="extended">
								<ScrollArea className="h-[400px] pr-4">
									<ChordList
										title="Extended Chords"
										chords={filteredExtendedChords}
										onChordSelect={handleChordChange}
									/>
								</ScrollArea>
							</TabsContent>
						</Tabs>
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
							<Button onClick={() => setIsModalOpen(true)} className="gap-2">
								<Guitar className="w-4 h-4" />
								View Diagram
							</Button>
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
