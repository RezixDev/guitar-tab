// components/StatusDisplay.tsx
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { calculateTotalDuration } from '../utils/noteUtils';
import { Note } from '../types/music';

interface StatusDisplayProps {
    notes: Note[];
    playbackStartIndex: number;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
                                                                notes,
                                                                playbackStartIndex
                                                            }) => {
    const totalDuration = calculateTotalDuration(notes);

    return (
        <div className="mt-4 flex justify-between items-center">
            <Badge variant="outline" className="text-sm">
                {notes.length} note{notes.length !== 1 ? 's' : ''} in composition
            </Badge>
            {notes.length > 0 && (
                <div className="flex gap-2">
                    <Badge variant="secondary" className="text-sm">
                        Total duration: {totalDuration} beats
                    </Badge>
                    {playbackStartIndex > 0 && (
                        <Badge variant="outline" className="text-sm text-green-600">
                            Playing from note {playbackStartIndex + 1}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
};