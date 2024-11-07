import type { Chord } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Guitar, 
  Download,
  Share2,
  ClipboardCopy,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChordModalProps {
  chord: Chord;
  isOpen: boolean;
  onClose: () => void;
  ChordSVGComponent: React.ComponentType<{
    chord: Chord['notes'];
    chordName: string;
    startingFret: number;
  }>;
}

export function ChordModal({ 
  chord, 
  isOpen, 
  onClose, 
  ChordSVGComponent 
}: ChordModalProps) {
  const chordNotes = chord.notes
    .map((note, index) => ({
      string: 6 - index,
      fret: note.fret,
      finger: note.finger
    }))
    .reverse();

  const stringLetters = ['E', 'A', 'D', 'G', 'B', 'e'];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Guitar className="w-6 h-6 text-primary" />
              <div>
                <DialogTitle className="text-2xl">{chord.name} Chord</DialogTitle>
                <DialogDescription>
                  Starting from fret {chord.startingFret}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-5 gap-6 p-6">
          {/* Chord Diagram */}
          <div className="md:col-span-3">
            <Card className="border-2">
              <CardContent className="p-4">
                <ChordSVGComponent
                  chord={chord.notes}
                  chordName={chord.name}
                  startingFret={chord.startingFret}
                />
              </CardContent>
            </Card>
          </div>

          {/* Chord Details */}
          <div className="md:col-span-2 space-y-6">
            {/* String Details */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">String Details</h3>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-2">
                    {chordNotes.map((note, index) => (
                      <div 
                        key={`note-${index}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary">
                            {stringLetters[index]}
                          </span>
                          <span>String {note.string}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            Fret: <span className="font-semibold">{note.fret}</span>
                          </div>
                          {note.finger > 0 && (
                            <div className="text-sm">
                              Finger: <span className="font-semibold">{note.finger}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Chord Type</h3>
                <div className="flex gap-2 flex-wrap">
                  {chord.name.split(' ').map((part, index) => (
                    <span 
                      key={index}
                      className={cn(
                        "px-2 py-1 rounded-md text-sm",
                        index === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"
                      )}
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="secondary" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
            <Button variant="default" size="sm" className="gap-2">
              <ClipboardCopy className="w-4 h-4" />
              Copy Diagram
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}