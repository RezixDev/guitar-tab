// components/GameSettings.tsx
import { Label } from "@/components/ui/label";
import { TuningSelector } from './TuningSelector';
import { PointsSelector } from './PointsSelector';
import { ModeToggle } from './ModeToggle';
import { Tuning } from '@/types/tuning'; 

interface GameSettingsProps {
    onTuningChange: (value: string) => void;
    targetPoints: number;
    onTargetPointsChange: (value: number) => void;
    modes: {
        newbieMode: boolean;
        easyMode: boolean;
        hardMode: boolean;
        timeChallenge: boolean;
    };
    onModeChange: (mode: 'newbie' | 'easy' | 'hard', value: boolean) => void;
    onTimeChallengeChange: (value: boolean) => void;
    disabled?: boolean;
    displayTuning: Tuning; 
}

export const GameSettings: React.FC<GameSettingsProps> = ({
                                                              onTuningChange,
                                                              targetPoints,
                                                              onTargetPointsChange,
                                                              modes,
                                                              onModeChange,
                                                              onTimeChallengeChange
                                                          }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Tuning</Label>
                    <TuningSelector onChange={onTuningChange} />
                </div>
                <div className="space-y-2">
                    <Label>Target Score</Label>
                    <PointsSelector value={targetPoints} onChange={onTargetPointsChange} />
                </div>
            </div>
            <div className="space-y-4">
                <Label>Game Modes</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ModeToggle
                        label="Guess One Position"
                        checked={modes.newbieMode}
                        onChange={(checked) => onModeChange('newbie', checked)}
                    />
                    <ModeToggle
                        label="Show All Notes"
                        checked={modes.easyMode}
                        onChange={(checked) => onModeChange('easy', checked)}
                    />
                    <ModeToggle
                        label="Guess All Positions"
                        checked={modes.hardMode}
                        onChange={(checked) => onModeChange('hard', checked)}
                    />
                    <ModeToggle
                        label="Time Challenge"
                        checked={modes.timeChallenge}
                        onChange={onTimeChallengeChange}
                    />
                </div>
            </div>
        </div>
    );
};