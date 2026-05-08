import { Guitar, Download, Share2, ClipboardCopy, Palette } from "lucide-react";
import type { ChordModalProps } from "@shared/types/chord";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/Dialog";
import { Button } from "@shared/ui/Button";
import { Card, CardContent } from "@shared/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/DropdownMenu";
import { chordThemes } from "../data/themes";

export function ChordModal({
  chord,
  isOpen,
  onClose,
  ChordSVGComponent,
  selectedTheme = "classic",
  onThemeChange,
}: ChordModalProps) {
  const currentTheme = chordThemes[selectedTheme] || chordThemes.classic;

  const handleThemeChange = (theme: string) => {
    onThemeChange?.(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("chordTheme", theme);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${chord.name} Chord`,
        text: `Check out this ${chord.name} chord diagram`,
      });
    }
  };

  const handleDownload = () => {
    const svgElement = document.querySelector('svg[role="img"]');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chord.name.replace(/\s+/g, "-")}-chord.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const notation = chord.notes.map((n) => (n.fret === null ? "x" : n.fret)).join("-");
    navigator.clipboard.writeText(`${chord.name}: ${notation}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-auto p-0 sm:max-w-[600px]">
        <DialogHeader className="border-b border-[var(--color-border)] px-6 pb-4 pt-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Guitar className="size-6 text-[var(--color-accent)]" />
              <div>
                <DialogTitle className="text-xl tracking-tight">{chord.name} Chord</DialogTitle>
                <DialogDescription>Starting from fret {chord.startingFret}</DialogDescription>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette className="size-4" />
                  <span className="hidden sm:inline">{currentTheme.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(chordThemes).map(([key, theme]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={selectedTheme === key ? "bg-[var(--color-accent-soft)]" : ""}
                  >
                    <span
                      aria-hidden
                      className="size-4 rounded border"
                      style={{
                        backgroundColor: theme.backgroundColor,
                        borderColor: theme.textColor,
                      }}
                    />
                    {theme.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="p-6">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <ChordSVGComponent
                chord={chord.notes}
                chordName={chord.name}
                startingFret={chord.startingFret}
                theme={currentTheme}
              />
            </CardContent>
          </Card>

          {currentTheme.showStringNames && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="mb-2 text-base font-semibold">Chord Type</h3>
                <div className="flex flex-wrap gap-2">
                  {chord.name.split(" ").map((part, index) => (
                    <span
                      key={index}
                      className={
                        "rounded-md px-2 py-1 text-xs " +
                        (index === 0
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-fg)]")
                      }
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="border-t border-[var(--color-border)] px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={handleShare}>
                <Share2 className="size-4" />
                Share
              </Button>
              <Button variant="secondary" size="sm" className="gap-1.5" onClick={handleDownload}>
                <Download className="size-4" />
                Download
              </Button>
            </div>
            <Button variant="primary" size="sm" className="gap-1.5" onClick={handleCopy}>
              <ClipboardCopy className="size-4" />
              Copy
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
