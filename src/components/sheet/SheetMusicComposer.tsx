"use client"
import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { Play, Pause, RotateCcw, Trash2, Music, Clock, Volume2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Note = {
    id: number;
    pitch: string;
    staffPosition: number;
    ledger: boolean;
    x: number;
    measure: number;
    duration: string;
    beats: number;
}

type StaffPosition = {
    note: string;
    position: number;
    ledger?: boolean;
}

type DurationInfo = {
    beats: number;
    symbol: string;
    name: string;
}

export const SheetMusicComposer: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentBeat, setCurrentBeat] = useState(-1);
    const [selectedDuration, setSelectedDuration] = useState('quarter');
    const [tempo, setTempo] = useState(120);
    const [volume, setVolume] = useState([-10]);
    const synthRef = useRef<Tone.PolySynth | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sequenceRef = useRef<Tone.Part | null>(null);

    // Note durations in beats
    const durations: Record<string, DurationInfo> = {
        whole: { beats: 4, symbol: '○', name: 'Whole' },
        half: { beats: 2, symbol: '𝅗𝅥', name: 'Half' },
        quarter: { beats: 1, symbol: '♩', name: 'Quarter' },
        eighth: { beats: 0.5, symbol: '♪', name: 'Eighth' },
        sixteenth: { beats: 0.25, symbol: '♬', name: 'Sixteenth' }
    };

    // Staff configuration
    const staffConfig = {
        topMargin: 120,
        lineSpacing: 14,
        staffHeight: 56,
        measureWidth: 220,
        leftMargin: 90,
        measures: 4
    };

    // Note positions on treble clef
    const staffPositions: StaffPosition[] = [
        { note: 'C6', position: -3.5, ledger: true },
        { note: 'B5', position: -3, ledger: true },
        { note: 'A5', position: -2.5, ledger: true },
        { note: 'G5', position: -2, ledger: true },
        { note: 'F5', position: -1.5 },
        { note: 'E5', position: -1 },
        { note: 'D5', position: -0.5 },
        { note: 'C5', position: 0 },
        { note: 'B4', position: 0.5 },
        { note: 'A4', position: 1 },
        { note: 'G4', position: 1.5 },
        { note: 'F4', position: 2 },
        { note: 'E4', position: 2.5 },
        { note: 'D4', position: 3 },
        { note: 'C4', position: 3.5, ledger: true },
        { note: 'B3', position: 4, ledger: true },
        { note: 'A3', position: 4.5, ledger: true },
        { note: 'G3', position: 5, ledger: true }
    ];

    // Initialize Tone.js
    useEffect(() => {
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            maxPolyphony: 8,
            oscillator: { type: 'triangle' },
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1
            }
        }).toDestination();

        synthRef.current.volume.value = volume[0];

        return () => {
            if (synthRef.current) {
                synthRef.current.dispose();
            }
            if (sequenceRef.current) {
                sequenceRef.current.dispose();
            }
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };
    }, []);

    // Update volume
    useEffect(() => {
        if (synthRef.current) {
            synthRef.current.volume.value = volume[0];
        }
    }, [volume]);

    // Draw staff
    useEffect(() => {
        drawStaff();
    }, [notes, currentBeat]);

    const drawStaff = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw title
        ctx.fillStyle = '#020817';
        ctx.font = '600 24px system-ui, -apple-system, sans-serif';
        ctx.fillText('Interactive Composition', 30, 50);

        // Draw tempo marking
        ctx.font = '400 14px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`♩ = ${tempo} BPM`, 30, 80);

        // Draw staff lines for each measure
        for (let measure = 0; measure < staffConfig.measures; measure++) {
            const measureX = staffConfig.leftMargin + (measure * staffConfig.measureWidth);

            // Draw staff lines
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 5; i++) {
                const y = staffConfig.topMargin + (i * staffConfig.lineSpacing);
                ctx.beginPath();
                ctx.moveTo(measureX, y);
                ctx.lineTo(measureX + staffConfig.measureWidth, y);
                ctx.stroke();
            }

            // Draw measure lines
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(measureX, staffConfig.topMargin);
            ctx.lineTo(measureX, staffConfig.topMargin + staffConfig.staffHeight);
            ctx.stroke();

            // Draw end barline
            if (measure === staffConfig.measures - 1) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#475569';
                ctx.beginPath();
                ctx.moveTo(measureX + staffConfig.measureWidth, staffConfig.topMargin);
                ctx.lineTo(measureX + staffConfig.measureWidth, staffConfig.topMargin + staffConfig.staffHeight);
                ctx.stroke();
            }
        }

        // Draw clef
        ctx.font = 'bold 52px serif';
        ctx.fillStyle = '#020817';
        ctx.fillText('𝄞', staffConfig.leftMargin - 55, staffConfig.topMargin + 40);

        // Draw time signature
        ctx.font = '600 30px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('4', staffConfig.leftMargin - 25, staffConfig.topMargin + 20);
        ctx.fillText('4', staffConfig.leftMargin - 25, staffConfig.topMargin + 48);

        // Draw notes
        notes.forEach((note, index) => {
            drawNote(ctx, note, index === currentBeat);
        });
    };

    const drawNote = (ctx: CanvasRenderingContext2D, note: Note, isPlaying: boolean) => {
        const x = staffConfig.leftMargin + note.x;
        const y = staffConfig.topMargin + (note.staffPosition * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);

        // Draw ledger lines if needed
        if (note.ledger) {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;

            if (note.staffPosition < 0) {
                for (let pos = -0.5; pos >= note.staffPosition; pos -= 1) {
                    const ledgerY = staffConfig.topMargin + (pos * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);
                    ctx.beginPath();
                    ctx.moveTo(x - 18, ledgerY);
                    ctx.lineTo(x + 18, ledgerY);
                    ctx.stroke();
                }
            } else if (note.staffPosition > 4) {
                for (let pos = 4.5; pos <= note.staffPosition; pos += 1) {
                    const ledgerY = staffConfig.topMargin + (pos * staffConfig.lineSpacing) + (staffConfig.staffHeight / 2);
                    ctx.beginPath();
                    ctx.moveTo(x - 18, ledgerY);
                    ctx.lineTo(x + 18, ledgerY);
                    ctx.stroke();
                }
            }
        }

        // Highlight if playing
        if (isPlaying) {
            ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
        }

        const noteColor = isPlaying ? '#6366f1' : '#020817';

        // Draw note head
        ctx.fillStyle = note.duration === 'whole' || note.duration === 'half' ? '#ffffff' : noteColor;
        ctx.strokeStyle = noteColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(x, y, 9, 7, -0.25, 0, Math.PI * 2);
        if (note.duration === 'whole' || note.duration === 'half') {
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        } else {
            ctx.fill();
        }

        // Draw stem
        if (note.duration !== 'whole') {
            const stemDirection = note.staffPosition > 1 ? -1 : 1;
            const stemHeight = 40;
            ctx.strokeStyle = noteColor;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), y);
            ctx.lineTo(x + (stemDirection === 1 ? 8 : -8), y + (stemHeight * stemDirection));
            ctx.stroke();

            // Draw flags
            if (note.duration === 'eighth' || note.duration === 'sixteenth') {
                const flagY = y + (stemHeight * stemDirection);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), flagY);
                ctx.quadraticCurveTo(
                    x + (stemDirection === 1 ? 18 : -18),
                    flagY + (18 * stemDirection),
                    x + (stemDirection === 1 ? 14 : -14),
                    flagY + (28 * stemDirection)
                );
                ctx.stroke();

                if (note.duration === 'sixteenth') {
                    ctx.beginPath();
                    ctx.moveTo(x + (stemDirection === 1 ? 8 : -8), flagY + 10);
                    ctx.quadraticCurveTo(
                        x + (stemDirection === 1 ? 18 : -18),
                        flagY + 10 + (18 * stemDirection),
                        x + (stemDirection === 1 ? 14 : -14),
                        flagY + 10 + (28 * stemDirection)
                    );
                    ctx.stroke();
                }
            }
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < staffConfig.leftMargin || x > staffConfig.leftMargin + (staffConfig.measures * staffConfig.measureWidth)) {
            return;
        }

        if (y < staffConfig.topMargin - 25 || y > staffConfig.topMargin + staffConfig.staffHeight + 25) {
            return;
        }

        const relativeY = y - staffConfig.topMargin - (staffConfig.staffHeight / 2);
        const staffPosition = Math.round(relativeY / staffConfig.lineSpacing * 2) / 2;

        const closestNote = staffPositions.reduce((prev, curr) => {
            return Math.abs(curr.position - staffPosition) < Math.abs(prev.position - staffPosition) ? curr : prev;
        });

        // Play preview sound
        if (synthRef.current) {
            synthRef.current.triggerAttackRelease(closestNote.note, '8n');
        }

        const newNote: Note = {
            id: Date.now(),
            pitch: closestNote.note,
            staffPosition: closestNote.position,
            ledger: closestNote.ledger || false,
            x: x - staffConfig.leftMargin,
            measure: Math.floor((x - staffConfig.leftMargin) / staffConfig.measureWidth),
            duration: selectedDuration,
            beats: durations[selectedDuration].beats
        };

        setNotes([...notes, newNote].sort((a, b) => a.x - b.x));
    };

    const playNotes = async () => {
        if (!synthRef.current) return;

        if (isPlaying) {
            // Stop playback
            Tone.Transport.stop();
            Tone.Transport.cancel();
            if (sequenceRef.current) {
                sequenceRef.current.dispose();
                sequenceRef.current = null;
            }
            setIsPlaying(false);
            setCurrentBeat(-1);
            return;
        }

        if (notes.length === 0) return;

        // Start audio context
        await Tone.start();

        // Set tempo
        Tone.Transport.bpm.value = tempo;

        // Create events for Tone.Part
        let currentTime = 0;
        const events: Array<[number, any]> = [];

        notes.forEach((note, index) => {
            events.push([currentTime, { note: note.pitch, duration: note.beats, index }]);
            currentTime += note.beats;
        });

        // Create and start Tone.Part
        sequenceRef.current = new Tone.Part((time, value) => {
            setCurrentBeat(value.index);
            synthRef.current?.triggerAttackRelease(
                value.note,
                value.duration + 'n',
                time
            );

            // Clear highlight after note plays
            Tone.Draw.schedule(() => {
                if (value.index === notes.length - 1) {
                    setTimeout(() => {
                        setCurrentBeat(-1);
                        setIsPlaying(false);
                    }, (value.duration * 60 / tempo) * 1000);
                }
            }, time + value.duration);
        }, events);

        sequenceRef.current.loop = false;
        sequenceRef.current.start(0);

        // Start transport
        Tone.Transport.start();
        setIsPlaying(true);
    };

    const clearNotes = () => {
        setNotes([]);
        if (isPlaying) {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            if (sequenceRef.current) {
                sequenceRef.current.dispose();
                sequenceRef.current = null;
            }
            setIsPlaying(false);
            setCurrentBeat(-1);
        }
    };

    const deleteLastNote = () => {
        if (notes.length > 0) {
            setNotes(notes.slice(0, -1));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
                        <Music className="w-8 h-8 text-primary" />
                        Sheet Music Composer
                    </h1>
                    <p className="text-muted-foreground">Click on the staff to compose your melody</p>
                </div>

                {/* Main Card */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex flex-wrap gap-4 items-center justify-between">
                            {/* Playback Controls */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={playNotes}
                                    variant={isPlaying ? "destructive" : "default"}
                                    size="default"
                                    className="gap-2"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isPlaying ? 'Stop' : 'Play'}
                                </Button>

                                <Button
                                    onClick={clearNotes}
                                    variant="secondary"
                                    size="default"
                                    className="gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear
                                </Button>

                                <Button
                                    onClick={deleteLastNote}
                                    variant="outline"
                                    size="default"
                                    className="gap-2"
                                    disabled={notes.length === 0}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Undo
                                </Button>
                            </div>

                            {/* Note Duration Selector */}
                            <div className="flex items-center gap-2">
                                <Label htmlFor="duration">Duration:</Label>
                                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                    <SelectTrigger id="duration" className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(durations).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{value.symbol}</span>
                          <span>{value.name}</span>
                        </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tempo Control */}
                            <div className="flex items-center gap-3">
                                <Label className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Tempo:
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Slider
                                        value={[tempo]}
                                        onValueChange={(value) => setTempo(value[0])}
                                        min={60}
                                        max={180}
                                        step={5}
                                        className="w-24"
                                    />
                                    <Badge variant="secondary" className="min-w-[3rem] justify-center">
                                        {tempo}
                                    </Badge>
                                </div>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-3">
                                <Label className="flex items-center gap-1">
                                    <Volume2 className="w-4 h-4" />
                                    Volume:
                                </Label>
                                <Slider
                                    value={volume}
                                    onValueChange={setVolume}
                                    min={-30}
                                    max={0}
                                    step={1}
                                    className="w-24"
                                />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        {/* Canvas Container */}
                        <div className="bg-background rounded-lg border shadow-inner overflow-x-auto">
                            <canvas
                                ref={canvasRef}
                                width={staffConfig.leftMargin + (staffConfig.measures * staffConfig.measureWidth) + 30}
                                height={280}
                                onClick={handleCanvasClick}
                                className="cursor-crosshair hover:bg-muted/10 transition-colors"
                            />
                        </div>

                        {/* Note Counter */}
                        <div className="mt-4 flex justify-between items-center">
                            <Badge variant="outline" className="text-sm">
                                {notes.length} note{notes.length !== 1 ? 's' : ''} in composition
                            </Badge>
                            {notes.length > 0 && (
                                <Badge variant="secondary" className="text-sm">
                                    Duration: {notes.reduce((sum, note) => sum + note.beats, 0)} beats
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Alert>
                    <Music className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                        <p>
                            <strong>How to compose:</strong> Select a note duration, then click on the staff to place notes.
                            Click Play to hear your composition.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Tips: Notes snap to the nearest line or space. You'll hear a preview when placing each note.
                            Playback follows left-to-right order.
                        </p>
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}