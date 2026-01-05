"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Dumbbell, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PracticeTabDisplay } from "./PracticeTabDisplay";
import { PracticeSettings } from "./PracticeSettings";
import {
    generatePracticePattern,
    getRandomPracticeType,
    type PracticeType,
    type Difficulty,
    type PracticePattern,
} from "./practicePatterns";

export function DailyPracticeGenerator() {
    const [practiceType, setPracticeType] = useState<PracticeType>("chromatic");
    const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
    const [startFret, setStartFret] = useState(1);
    const [pattern, setPattern] = useState<PracticePattern>(() =>
        generatePracticePattern("chromatic", "beginner", 1)
    );

    const handleGenerate = useCallback(() => {
        const newPattern = generatePracticePattern(practiceType, difficulty, startFret);
        setPattern(newPattern);
    }, [practiceType, difficulty, startFret]);

    const handleRandomGenerate = useCallback(() => {
        const randomType = getRandomPracticeType();
        setPracticeType(randomType);
        const newPattern = generatePracticePattern(randomType, difficulty, startFret);
        setPattern(newPattern);
    }, [difficulty, startFret]);

    const handlePracticeTypeChange = (type: PracticeType) => {
        setPracticeType(type);
        const newPattern = generatePracticePattern(type, difficulty, startFret);
        setPattern(newPattern);
    };

    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        const newPattern = generatePracticePattern(practiceType, newDifficulty, startFret);
        setPattern(newPattern);
    };

    const handleStartFretChange = (fret: number) => {
        setStartFret(fret);
        const newPattern = generatePracticePattern(practiceType, difficulty, fret);
        setPattern(newPattern);
    };

    const difficultyColors: Record<Difficulty, string> = {
        beginner: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        intermediate: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        advanced: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    return (
        <div className="space-y-6">
            {/* Settings Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Practice Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <PracticeSettings
                        practiceType={practiceType}
                        difficulty={difficulty}
                        startFret={startFret}
                        onPracticeTypeChange={handlePracticeTypeChange}
                        onDifficultyChange={handleDifficultyChange}
                        onStartFretChange={handleStartFretChange}
                    />
                </CardContent>
            </Card>

            {/* Generated Exercise Card */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Dumbbell className="w-5 h-5" />
                                {pattern.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {pattern.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={difficultyColors[pattern.difficulty]}>
                                {pattern.difficulty.charAt(0).toUpperCase() + pattern.difficulty.slice(1)}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {pattern.bpmSuggestion.min}-{pattern.bpmSuggestion.max} BPM
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <PracticeTabDisplay tabs={pattern.tabs} />

                    <Separator />

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={handleGenerate} className="flex-1">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Generate New Pattern
                        </Button>
                        <Button onClick={handleRandomGenerate} variant="outline" className="flex-1">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Random Exercise
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Practice Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Start slowly and focus on clean, even notes</li>
                        <li>Use a metronome at the suggested BPM range</li>
                        <li>Gradually increase speed only when comfortable</li>
                        <li>Practice each exercise for 5-10 minutes</li>
                        <li>Take breaks to avoid tension in your hands</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
