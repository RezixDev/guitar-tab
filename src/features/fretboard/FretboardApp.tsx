import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import type { Locale, Messages } from "@shared/types/i18n";
import { I18nProvider, useTranslations } from "@shared/i18n/I18nProvider";
import { Button } from "@shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/Card";
import { Separator } from "@shared/ui/Separator";
import { CompletionModal } from "./components/CompletionModal";
import { FretboardSVG } from "./components/FretboardSVG";
import { GameControls } from "./components/GameControls";
import { GameSettings } from "./components/GameSettings";
import { KeyboardControls } from "./components/KeyboardControls";
import { PositionTracker } from "./components/PositionTracker";
import { TutorialDialog } from "./components/TutorialDialog";
import { useFretboardGame } from "./hooks/useFretboardGame";
import { buildFretboardTranslations } from "./lib/translations";

function FretboardGame() {
  const t = useTranslations("Fretboard");

  // Build feedback strings up front (used inside the game state hook)
  const feedbackTranslations = useMemo(
    () => ({
      feedback: {
        perfect: t("feedback.perfect"),
        tryAgainAny: t("feedback.tryAgainAny"),
        foundOne: t("feedback.foundOne"),
        tryAgain: t("feedback.tryAgain"),
        excellent: t("feedback.excellent"),
        remainingPositions: (count: number) =>
          t("feedback.remainingPositions", { count }),
        remainingPosition: t("feedback.remainingPosition"),
        tryAgainAll: t("feedback.tryAgainAll"),
        correct: t("feedback.correct"),
      },
    }),
    [t],
  );

  const game = useFretboardGame(feedbackTranslations);

  const tx = useMemo(
    () =>
      buildFretboardTranslations(t, {
        streak: game.gameState.streak,
        points: game.gameState.points,
        targetPoints: game.gameState.targetPoints,
        elapsedTime: game.elapsedTime,
        bestTime: game.bestTime,
      }),
    [
      t,
      game.gameState.streak,
      game.gameState.points,
      game.gameState.targetPoints,
      game.elapsedTime,
      game.bestTime,
    ],
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold">{tx.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => game.setShowTutorial(true)}>
              <HelpCircle className="mr-2 size-4" />
              {tx.tutorialTitle}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <GameSettings
          onTuningChange={game.handleTuningChange}
          targetPoints={game.gameState.targetPoints}
          onTargetPointsChange={game.setTargetPoints}
          gameMode={game.modes.gameMode}
          onGameModeChange={game.modes.setGameMode}
          disabled={game.isGameStarted}
          displayTuning={game.tuningId}
          translations={tx.settings}
        />

        <Separator />

        <GameControls
          points={game.gameState.points}
          targetPoints={game.gameState.targetPoints}
          streak={game.gameState.streak}
          bestTime={game.bestTime}
          timeChallenge={game.modes.isTimeChallenge}
          elapsedTime={game.elapsedTime}
          showNext={game.gameState.showNext}
          currentNote={game.gameState.currentNote}
          isGameStarted={game.isGameStarted}
          feedback={game.gameState.feedback}
          onNextNote={game.handleNextNote}
          onStartGame={game.handleStartGame}
          onReset={game.handleReset}
          translations={tx.controls}
        />

        {game.isGameStarted && (game.modes.isHardMode || game.modes.isFindAllMode) && (
          <PositionTracker
            currentNote={game.gameState.currentNote}
            tuning={game.tuning}
            foundPositions={game.gameState.foundPositions}
            showNext={game.gameState.showNext}
            translations={tx.positions}
          />
        )}

        {game.isGameStarted && (
          <FretboardSVG
            tuning={game.tuning}
            width={900}
            height={300}
            onFretClick={game.handleFretClick}
            showNext={game.gameState.showNext}
            currentNote={game.gameState.currentNote}
            guessedPositions={game.gameState.guessedPositions}
            isEasyMode={game.modes.isEasyMode}
            isNewbieMode={game.modes.isNewbieMode}
            highContrast={false}
            isFlipped
          />
        )}

        <KeyboardControls translations={tx.keyboard} />

        <CompletionModal
          isOpen={game.showCompletionModal}
          onClose={game.handleCompletionClose}
          stats={{
            correctGuesses: game.gameState.points,
            totalGuesses: game.gameState.totalAttempts,
            time: game.elapsedTime,
            streak: game.gameState.streak,
            bestTime: game.bestTime ?? undefined,
          }}
          translations={tx.completion}
        />

        <TutorialDialog
          isOpen={game.showTutorial}
          onClose={() => game.setShowTutorial(false)}
          translations={{
            title: tx.tutorialTitle,
            steps: tx.tutorialSteps,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function FretboardApp({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="container mx-auto max-w-6xl p-4 md:p-8">
        <FretboardGame />
      </div>
    </I18nProvider>
  );
}
