// components/GameControls.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target } from "lucide-react";

interface GameControlsProps {
    points: number;
    targetPoints: number;
    streak: number;
    bestTime: number | null;
    timeChallenge: boolean;
    elapsedTime: number;
    showNext: boolean;
    onNextNote: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
                                                              points,
                                                              targetPoints,
                                                              streak,
                                                              bestTime,
                                                              timeChallenge,
                                                              elapsedTime,
                                                              showNext,
                                                              onNextNote
                                                          }) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex gap-1">
                    <Target className="w-4 h-4" />
                    <span>{points} / {targetPoints}</span>
                </Badge>
                <Badge variant="secondary" className="flex gap-1">
                    <Trophy className="w-4 h-4" />
                    <span>Streak: {streak}</span>
                </Badge>
                {timeChallenge && (
                    <Badge variant="secondary" className="flex gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{elapsedTime}s</span>
                    </Badge>
                )}
                {bestTime && (
                    <Badge variant="outline" className="flex gap-1">
                        <Trophy className="w-4 h-4" />
                        <span>Best: {bestTime}s</span>
                    </Badge>
                )}
            </div>
            {showNext && (
                <Button onClick={onNextNote} className="flex items-center gap-2">
                    Next Note
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
                        <span className="text-xs">⏎</span>
                        Enter
                    </kbd>
                </Button>
            )}
        </div>
    );
};