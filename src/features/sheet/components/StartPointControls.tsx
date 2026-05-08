import { SkipBack, SkipForward } from "lucide-react";
import { Badge } from "@shared/ui/Badge";
import { Button } from "@shared/ui/Button";
import { Label } from "@shared/ui/Label";

type StartPointControlsProps = {
  notesLength: number;
  playbackStartIndex: number;
  onMoveStartPoint: (direction: "prev" | "next") => void;
  onResetStartPoint: () => void;
};

export function StartPointControls({
  notesLength,
  playbackStartIndex,
  onMoveStartPoint,
  onResetStartPoint,
}: StartPointControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Label>Start Point:</Label>
      <div className="flex gap-1">
        <Button
          onClick={() => onMoveStartPoint("prev")}
          variant="outline"
          size="icon"
          className="size-8"
          disabled={notesLength === 0 || playbackStartIndex === 0}
        >
          <SkipBack className="size-4" />
        </Button>
        <Badge variant="secondary" className="min-w-[3rem] justify-center">
          {notesLength > 0 ? `${playbackStartIndex + 1}/${notesLength}` : "0/0"}
        </Badge>
        <Button
          onClick={() => onMoveStartPoint("next")}
          variant="outline"
          size="icon"
          className="size-8"
          disabled={notesLength === 0 || playbackStartIndex >= notesLength - 1}
        >
          <SkipForward className="size-4" />
        </Button>
        <Button
          onClick={onResetStartPoint}
          variant="ghost"
          size="sm"
          disabled={playbackStartIndex === 0}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
