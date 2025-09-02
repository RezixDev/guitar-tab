"use client"
import React from 'react';
import { Music } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Controls } from './components/Controls';
import { StaffCanvas } from './components/StaffCanvas';
import { StatusDisplay } from './components/StatusDisplay';
import { Instructions } from './components/Instructions';
import { useMusicComposer } from './hooks/useMusicComposer';

export function SheetMusicComposer() {
    const {
        // State
        notes,
        isPlaying,
        currentNoteIndex,
        selectedDuration,
        tempo,
        volume,
        playbackStartIndex,
        playheadPosition,

        // Actions
        handleCanvasClick,
        playNotes,
        clearNotes,
        deleteLastNote,
        moveStartPoint,
        resetStartPoint,
        setSelectedDuration,
        setTempo,
        setVolume
    } = useMusicComposer();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
                        <Music className="w-8 h-8 text-primary" />
                        Sheet Music Composer
                    </h1>
                    <p className="text-muted-foreground">Click to add notes • Shift+Click to set start point</p>
                </div>

                {/* Main Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <Controls
                            isPlaying={isPlaying}
                            notesLength={notes.length}
                            selectedDuration={selectedDuration}
                            tempo={tempo}
                            volume={volume}
                            playbackStartIndex={playbackStartIndex}
                            onPlay={playNotes}
                            onClear={clearNotes}
                            onDeleteLast={deleteLastNote}
                            onDurationChange={setSelectedDuration}
                            onTempoChange={setTempo}
                            onVolumeChange={setVolume}
                            onMoveStartPoint={moveStartPoint}
                            onResetStartPoint={resetStartPoint}
                        />
                    </CardHeader>

                    <CardContent className="p-6">
                        {/* Canvas Container */}
                        <StaffCanvas
                            notes={notes}
                            currentNoteIndex={currentNoteIndex}
                            playheadPosition={playheadPosition}
                            playbackStartIndex={playbackStartIndex}
                            tempo={tempo}
                            onCanvasClick={handleCanvasClick}
                        />

                        {/* Note Counter */}
                        <StatusDisplay
                            notes={notes}
                            playbackStartIndex={playbackStartIndex}
                        />
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Instructions />
            </div>
        </div>
    );
}