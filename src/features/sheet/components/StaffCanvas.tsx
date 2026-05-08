import { useEffect, useRef, type MouseEvent } from "react";
import type { SheetNote } from "@shared/types/sheet";
import { staffConfig } from "../data/music";
import { StaffRenderer } from "./StaffRenderer";

type StaffCanvasProps = {
  notes: SheetNote[];
  currentNoteIndex: number;
  playheadPosition: number;
  playbackStartIndex: number;
  tempo: number;
  onCanvasClick: (e: MouseEvent<HTMLCanvasElement>) => void;
};

export function StaffCanvas({
  notes,
  currentNoteIndex,
  playheadPosition,
  playbackStartIndex,
  tempo,
  onCanvasClick,
}: StaffCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StaffRenderer | null>(null);

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new StaffRenderer(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.drawStaff(
        notes,
        currentNoteIndex,
        playheadPosition,
        playbackStartIndex,
        tempo,
      );
    }
  }, [notes, currentNoteIndex, playheadPosition, playbackStartIndex, tempo]);

  const canvasWidth =
    staffConfig.leftMargin + staffConfig.measures * staffConfig.measureWidth + 30;
  const canvasHeight = 280;

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-white shadow-inner">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={onCanvasClick}
        className="cursor-crosshair transition-colors"
      />
    </div>
  );
}
