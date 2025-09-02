// components/Controls.tsx
import { Play, Pause, RotateCcw, Trash2, Clock, Volume2, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { durations } from '../constants/music';

type ControlsProps = {
    isPlaying: boolean;
    notesLength: number;
    selectedDuration: string;
    tempo: number;
    volume: number[];
    playbackStartIndex: number;
    onPlay: () => void;
    onClear: () => void;
    onDeleteLast: () => void;
    onDurationChange: (duration: string) => void;
    onTempoChange: (tempo: number) => void;
    onVolumeChange: (volume: number[]) => void;
    onMoveStartPoint: (direction: 'prev' | 'next') => void;
    onResetStartPoint: () => void;
};

export const Controls = ({
                             isPlaying,
                             notesLength,
                             selectedDuration,
                             tempo,
                             volume,
                             playbackStartIndex,
                             onPlay,
                             onClear,
                             onDeleteLast,
                             onDurationChange,
                             onTempoChange,
                             onVolumeChange,
                             onMoveStartPoint,
                             onResetStartPoint
                         }: ControlsProps) => {
    return (
        <div className="space-y-4">
            {/* Primary Controls Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Playback Controls */}
                <div className="flex gap-2">
                    <Button
                        onClick={onPlay}
                        variant={isPlaying ? "destructive" : "default"}
                        size="default"
                        className="gap-2"
                        disabled={notesLength === 0}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Stop' : 'Play'}
                    </Button>

                    <Button
                        onClick={onClear}
                        variant="secondary"
                        size="default"
                        className="gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear
                    </Button>

                    <Button
                        onClick={onDeleteLast}
                        variant="outline"
                        size="default"
                        className="gap-2"
                        disabled={notesLength === 0}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Undo
                    </Button>
                </div>

                {/* Note Duration Selector */}
                <div className="flex items-center gap-2">
                    <Label htmlFor="duration">Duration:</Label>
                    <Select value={selectedDuration} onValueChange={onDurationChange}>
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
            </div>

            <Separator />

            {/* Secondary Controls Row */}
            <div className="flex flex-wrap gap-6 items-center justify-between">
                {/* Start Point Controls */}
                <div className="flex items-center gap-2">
                    <Label>Start Point:</Label>
                    <div className="flex gap-1">
                        <Button
                            onClick={() => onMoveStartPoint('prev')}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={notesLength === 0 || playbackStartIndex === 0}
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>
                        <Badge variant="secondary" className="min-w-[3rem] justify-center">
                            {notesLength > 0 ? `${playbackStartIndex + 1}/${notesLength}` : '0/0'}
                        </Badge>
                        <Button
                            onClick={() => onMoveStartPoint('next')}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={notesLength === 0 || playbackStartIndex >= notesLength - 1}
                        >
                            <SkipForward className="w-4 h-4" />
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

                {/* Tempo Control */}
                <div className="flex items-center gap-3">
                    <Label className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Tempo:
                    </Label>
                    <div className="flex items-center gap-2">
                        <Slider
                            value={[tempo]}
                            onValueChange={(value) => onTempoChange(value[0])}
                            min={60}
                            max={180}
                            step={5}
                            className="w-24"
                        />
                        <Badge variant="secondary" className="min-w-[4rem] justify-center">
                            {tempo} BPM
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
                        onValueChange={onVolumeChange}
                        min={-30}
                        max={0}
                        step={1}
                        className="w-24"
                    />
                </div>
            </div>
        </div>
    );
};
