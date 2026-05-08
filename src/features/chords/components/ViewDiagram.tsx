import { Guitar } from "lucide-react";
import type { FloatingChordViewerProps } from "@shared/types/chord";
import { Button } from "@shared/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/Tooltip";
import { ChordModal } from "./ChordModal";

type ViewDiagramProps = FloatingChordViewerProps & {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
};

export function ViewDiagram({
  chord,
  ChordSVGComponent,
  isOpen,
  onOpenChange,
  selectedTheme,
  onThemeChange,
}: ViewDiagramProps) {
  return (
    <>
      <div className="md:hidden">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onOpenChange(true)}
                className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
                size="icon"
                aria-label="View chord diagram"
              >
                <Guitar className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">View chord diagram</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Button
        onClick={() => onOpenChange(true)}
        className="hidden gap-2 md:inline-flex"
      >
        <Guitar className="size-4" />
        View Diagram
      </Button>

      <ChordModal
        chord={chord}
        isOpen={isOpen}
        onClose={() => onOpenChange(false)}
        ChordSVGComponent={ChordSVGComponent}
        selectedTheme={selectedTheme}
        onThemeChange={onThemeChange}
      />
    </>
  );
}
