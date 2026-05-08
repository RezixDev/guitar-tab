import { useCallback, useMemo, useState } from "react";
import { Clock, Dumbbell, Lightbulb, RefreshCw, Shuffle, Target } from "lucide-react";
import type {
  Difficulty,
  PracticeExercise,
  PracticeType,
} from "@shared/types/practice";
import { Badge } from "@shared/ui/Badge";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Separator } from "@shared/ui/Separator";
import { PracticeSettings } from "./components/PracticeSettings";
import { PracticeTabDisplay } from "./components/PracticeTabDisplay";
import { EXERCISE_CATALOG, PRACTICE_TYPES } from "./data/exercises";
import {
  countMatches,
  pickExercise,
  sample,
  transposeExercise,
} from "./lib/exerciseHelpers";

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  beginner:
    "bg-[color-mix(in_oklab,var(--color-success),transparent_85%)] text-[var(--color-success)]",
  intermediate:
    "bg-[color-mix(in_oklab,var(--color-warning),transparent_85%)] text-[var(--color-warning)]",
  advanced:
    "bg-[color-mix(in_oklab,var(--color-danger),transparent_85%)] text-[var(--color-danger)]",
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function pickInitial(): PracticeExercise {
  return (
    pickExercise(EXERCISE_CATALOG, "chromatic", "beginner") ?? EXERCISE_CATALOG[0]
  );
}

export default function PracticeApp() {
  const [practiceType, setPracticeType] = useState<PracticeType>("chromatic");
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [startFret, setStartFret] = useState(5);
  const [exercise, setExercise] = useState<PracticeExercise>(() => pickInitial());

  const transposed = useMemo(
    () => transposeExercise(exercise, startFret),
    [exercise, startFret],
  );

  const rerollWithExclude = useCallback(
    (type: PracticeType, diff: Difficulty, excludeId?: string) => {
      const next = pickExercise(EXERCISE_CATALOG, type, diff, excludeId);
      if (next) setExercise(next);
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    // Always pass the current exercise id so we get a *different* one when possible
    rerollWithExclude(practiceType, difficulty, exercise.id);
  }, [practiceType, difficulty, exercise.id, rerollWithExclude]);

  const handleRandomGenerate = useCallback(() => {
    // Fully random — pick a type (different from current if possible), then a matching exercise
    const otherTypes = PRACTICE_TYPES.filter((t) => t !== practiceType);
    const nextType = otherTypes.length > 0 ? sample(otherTypes) : practiceType;
    setPracticeType(nextType);
    rerollWithExclude(nextType, difficulty, exercise.id);
  }, [practiceType, difficulty, exercise.id, rerollWithExclude]);

  const handlePracticeTypeChange = (type: PracticeType) => {
    setPracticeType(type);
    // Switching type: any exercise of that type/difficulty is fine
    rerollWithExclude(type, difficulty);
  };

  const handleDifficultyChange = (next: Difficulty) => {
    setDifficulty(next);
    rerollWithExclude(practiceType, next);
  };

  // True when this (type, difficulty) bucket has at least one *other* exercise
  const hasAlternatives = useMemo(
    () => countMatches(EXERCISE_CATALOG, practiceType, difficulty) > 1,
    [practiceType, difficulty],
  );

  const transposable = exercise.baseFret != null;

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <header className="mb-2 flex items-center gap-2">
        <Dumbbell className="size-8" />
        <h1 className="text-4xl font-bold tracking-tight">Daily Practice</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="size-5" />
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
            onStartFretChange={setStartFret}
            startFretDisabled={!transposable}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="size-5" />
                {transposed.name}
              </CardTitle>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {transposed.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={DIFFICULTY_CLASSES[transposed.difficulty]}>
                {capitalize(transposed.difficulty)}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="size-3" />
                {transposed.bpmSuggestion.min}–{transposed.bpmSuggestion.max} BPM
              </Badge>
              <Badge variant="outline">
                {transposed.beatLength === 4
                  ? "16ths"
                  : transposed.beatLength === 3
                    ? "Triplets"
                    : "8ths"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <PracticeTabDisplay exercise={transposed} />

          {transposed.tip && (
            <div className="flex items-start gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-3 text-sm">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
              <p>{transposed.tip}</p>
            </div>
          )}

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={handleGenerate}
              className="flex-1"
              disabled={!hasAlternatives}
              title={
                hasAlternatives
                  ? undefined
                  : "Only one exercise of this type/difficulty — try changing the difficulty."
              }
            >
              <RefreshCw className="mr-2 size-4" />
              Another {capitalize(practiceType)}
            </Button>
            <Button onClick={handleRandomGenerate} variant="outline" className="flex-1">
              <Shuffle className="mr-2 size-4" />
              Surprise Me
            </Button>
          </div>
          {!hasAlternatives && (
            <p className="text-center text-xs text-[var(--color-fg-muted)]">
              This is the only {capitalize(practiceType)} exercise at the {difficulty} level.
              Change the difficulty for more variety.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Practice Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li>Start at the slow end of the BPM range and only speed up once notes are clean.</li>
            <li>The bottom row shows pick direction (▼ down, ▲ up) — follow it strictly.</li>
            <li>Beat dividers and the count row (1 e + a) help lock the rhythm.</li>
            <li>Highlighted notes are roots or anchors — emphasize them slightly.</li>
            <li>5–10 minutes per exercise; rotate through types weekly.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
