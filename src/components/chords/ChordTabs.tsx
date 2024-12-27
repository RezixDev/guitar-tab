import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChordList } from "@/components/chords/ChordList";
import type { Chord, ChordTabsProps } from "@/types/chord";

export function ChordTabs({
	filteredStandardChords,
	filteredExtendedChords,
	handleChordChange,
}: ChordTabsProps) {
	return (
		<Tabs defaultValue="standard" className="mt-4">
			<div className="min-h-[500px] sm:min-h-[450px]">
				<TabsList className="sticky top-0 z-10 w-full bg-muted rounded-lg p-1 h-10 mb-4">
					<TabsTrigger
						value="standard"
						className="w-full data-[state=active]:bg-background rounded-md transition-all"
					>
						Standard
					</TabsTrigger>
					<TabsTrigger
						value="extended"
						className="w-full data-[state=active]:bg-background rounded-md transition-all"
					>
						Extended
					</TabsTrigger>
				</TabsList>

				<div className="relative">
					<TabsContent
						value="standard"
						className="absolute top-0 left-0 w-full data-[state=inactive]:pointer-events-none"
					>
						<ScrollArea className="h-[400px] w-full">
							<div className="pr-4">
								<ChordList
									title="Standard Chords"
									chords={filteredStandardChords}
									onChordSelect={handleChordChange}
								/>
							</div>
						</ScrollArea>
					</TabsContent>
					<TabsContent
						value="extended"
						className="absolute top-0 left-0 w-full data-[state=inactive]:pointer-events-none"
					>
						<ScrollArea className="h-[400px] w-full">
							<div className="pr-4">
								<ChordList
									title="Extended Chords"
									chords={filteredExtendedChords}
									onChordSelect={handleChordChange}
								/>
							</div>
						</ScrollArea>
					</TabsContent>
				</div>
			</div>
		</Tabs>
	);
}
