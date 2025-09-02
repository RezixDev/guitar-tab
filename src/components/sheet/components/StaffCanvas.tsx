// components/StaffCanvas.tsx
import { useRef, useEffect } from 'react';
import { Note } from '../types/music';
import { StaffRenderer } from './StaffRenderer';
import { staffConfig } from '../constants/music';

type StaffCanvasProps = {
    notes: Note[];
    currentNoteIndex: number;
    playheadPosition: number;
    playbackStartIndex: number;
    tempo: number;
    onCanvasClick: (e: React.MouseEvent<HTMLCanvasElement>) => void;
};

export const StaffCanvas = ({
                                notes,
                                currentNoteIndex,
                                playheadPosition,
                                playbackStartIndex,
                                tempo,
                                onCanvasClick
                            }: StaffCanvasProps) => {
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
                tempo
            );
        }
    }, [notes, currentNoteIndex, playheadPosition, playbackStartIndex, tempo]);

    const canvasWidth = staffConfig.leftMargin + (staffConfig.measures * staffConfig.measureWidth) + 30;
    const canvasHeight = 280;

    return (
        <div className="bg-background rounded-lg border shadow-inner overflow-x-auto">
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={onCanvasClick}
                className="cursor-crosshair hover:bg-muted/10 transition-colors"
            />
        </div>
    );
};