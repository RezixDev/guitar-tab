import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/Tabs";
import { ScrollArea } from "@shared/ui/ScrollArea";
import type { ChordTabsProps } from "@shared/types/chord";
import { ChordList } from "./ChordList";

export function ChordTabs({
  filteredStandardChords,
  filteredExtendedChords,
  handleChordChange,
}: ChordTabsProps) {
  return (
    <Tabs defaultValue="standard" className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="extended">Extended</TabsTrigger>
      </TabsList>

      <TabsContent value="standard">
        <ScrollArea className="h-[420px] w-full pr-3">
          <ChordList chords={filteredStandardChords} onChordSelect={handleChordChange} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="extended">
        <ScrollArea className="h-[420px] w-full pr-3">
          <ChordList chords={filteredExtendedChords} onChordSelect={handleChordChange} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
