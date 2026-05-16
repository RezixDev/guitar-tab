import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/Tabs";
import { ScrollArea } from "@shared/ui/ScrollArea";
import type { ChordTabsProps } from "@shared/types/chord";
import { ChordList } from "./ChordList";

export function ChordTabs({
  filteredStandardChords,
  filteredExtendedChords,
  handlePresetChange,
}: ChordTabsProps) {
  return (
    <Tabs defaultValue="standard" className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="extended">Extended</TabsTrigger>
      </TabsList>

      <TabsContent value="standard">
        <ScrollArea className="h-[420px] w-full pr-3">
          <ChordList presets={filteredStandardChords} onPresetSelect={handlePresetChange} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="extended">
        <ScrollArea className="h-[420px] w-full pr-3">
          <ChordList presets={filteredExtendedChords} onPresetSelect={handlePresetChange} />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
