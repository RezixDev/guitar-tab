// components/Instructions.tsx
import React from 'react';
import { Music } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const Instructions: React.FC = () => {
    return (
        <Alert>
            <Music className="h-4 w-4" />
            <AlertDescription className="space-y-2">
                <p>
                    <strong>How to compose:</strong> Click on the staff to place notes. Select different durations from the dropdown.
                    The playback will respect note durations and tempo settings.
                </p>
                <p className="text-sm text-muted-foreground">
                    <strong>Tips:</strong>
                    • Shift+Click on a note to set it as the playback start point
                    • Use the Start Point controls to navigate through notes
                    • The tempo slider changes playback speed in real-time
                    • A red line shows the current playback position
                </p>
            </AlertDescription>
        </Alert>
    );
};