import { Trophy, Clock, Target, Music, Play, RefreshCcw } from "lucide-react";
import type { Note } from "@shared/types/music";
import { Button } from "@shared/ui/Button";
import { Badge } from "@shared/ui/Badge";

type GameControlsProps = {
  points: number;
  targetPoints: number;
  streak: number;
  bestTime: number | null;
  timeChallenge: boolean;
  elapsedTime: number;
  showNext: boolean;
  currentNote: Note;
  isGameStarted: boolean;
  feedback?: string;
  onNextNote: () => void;
  onStartGame: () => void;
  onReset: () => void;
  translations: {
    ready: string;
    startGame: string;
    findNote: string;
    pressEnter: string;
    nextNote: string;
    resetGame: string;
    streak: string;
    score: string;
    time: string;
    best: string;
  };
};

const formatSeconds = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60).toString().padStart(2, "0");
  return m > 0 ? `${m}:${sec}` : `${parseInt(sec, 10)}s`;
};

export function GameControls({
  points,
  targetPoints,
  streak,
  bestTime,
  timeChallenge,
  elapsedTime,
  showNext,
  currentNote,
  isGameStarted,
  feedback = "",
  onNextNote,
  onStartGame,
  onReset,
  translations,
}: GameControlsProps) {
  if (!isGameStarted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight">{translations.ready}</h2>
        <Button size="lg" onClick={onStartGame} className="gap-2">
          <Play className="size-5" />
          {translations.startGame}
        </Button>
      </div>
    );
  }

  const isPositive = /correct|perfect|great|excellent|found/i.test(feedback);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
        <div className="mb-2 flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
          <Music className="size-4" />
          {translations.findNote}
        </div>
        <div className="mb-2 text-5xl font-semibold tracking-wider">{currentNote.note}</div>
        {feedback && (
          <div
            className={
              "mt-2 text-sm " +
              (isPositive
                ? "text-[var(--color-success,#16a34a)]"
                : "text-[var(--color-danger,#dc2626)]")
            }
            aria-live="polite"
          >
            {feedback}
          </div>
        )}
        {showNext && (
          <div className="mt-2 text-sm text-[var(--color-fg-muted)]">{translations.pressEnter}</div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Target className="size-4" />
            {translations.score}: {points}/{targetPoints}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Trophy className="size-4" />
            {translations.streak}: {streak}
          </Badge>
          {timeChallenge && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="size-4" />
              {translations.time}: {formatSeconds(elapsedTime)}
            </Badge>
          )}
          {typeof bestTime === "number" && (
            <Badge variant="outline" className="gap-1">
              <Trophy className="size-4" />
              {translations.best}: {formatSeconds(bestTime)}
            </Badge>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onReset} className="gap-2">
            <RefreshCcw className="size-4" />
            {translations.resetGame}
          </Button>
          {showNext && (
            <Button onClick={onNextNote} className="flex-1">
              {translations.nextNote}
              <kbd className="ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 font-mono text-[10px] font-medium text-[var(--color-fg-muted)]">
                ⏎ Enter
              </kbd>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
