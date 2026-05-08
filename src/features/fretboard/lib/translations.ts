type Translator = (
  key: string,
  params?: Record<string, string | number>,
) => string;

type TranslationContext = {
  streak: number;
  points: number;
  targetPoints: number;
  elapsedTime: number;
  bestTime: number | null;
};

export type FretboardTranslations = ReturnType<typeof buildFretboardTranslations>;

/**
 * Builds the translation packages consumed by the fretboard sub-components.
 * Pure: every value comes from `t` and the context. Memoize on the call site.
 */
export function buildFretboardTranslations(t: Translator, ctx: TranslationContext) {
  const { streak, points, targetPoints, elapsedTime, bestTime } = ctx;

  return {
    title: t("title"),
    tutorialTitle: t("tutorial.title"),
    tutorialSteps: [t("tutorial.step1"), t("tutorial.step2"), t("tutorial.step3")],

    feedback: {
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
    },

    controls: {
      ready: t("game.ready"),
      startGame: t("game.startGame"),
      findNote: t("game.findNote"),
      pressEnter: t("game.pressEnter"),
      nextNote: t("game.nextNote"),
      resetGame: t("game.resetGame"),
      streak: t("game.streak", { count: streak }),
      score: t("game.score", { current: points, target: targetPoints }),
      time: t("game.time", { seconds: elapsedTime }),
      best: t("game.best", { time: bestTime ?? 0 }),
    },

    completion: {
      title: t("completion.title"),
      subtitle: t("completion.subtitle"),
      correct: t("completion.correct", { count: points }),
      time: t("completion.time", { seconds: elapsedTime }),
      streak: t("completion.streak", { count: streak }),
      bestTime: t("completion.bestTime", { time: bestTime?.toFixed(1) ?? 0 }),
      accuracy: t("completion.accuracy"),
      close: t("completion.close"),
      playAgain: t("completion.playAgain"),
    },

    settings: {
      tuning: t("settings.tuning"),
      targetScore: t("settings.targetScore"),
      gameMode: t("settings.gameMode"),
      gameModes: {
        placeholder: t("gameModes.placeholder"),
        modes: {
          newbie: {
            label: t("gameModes.newbie.label"),
            description: t("gameModes.newbie.description"),
          },
          easy: {
            label: t("gameModes.easy.label"),
            description: t("gameModes.easy.description"),
          },
          hard: {
            label: t("gameModes.hard.label"),
            description: t("gameModes.hard.description"),
          },
          findAll: {
            label: t("gameModes.findAll.label"),
            description: t("gameModes.findAll.description"),
          },
          time: {
            label: t("gameModes.time.label"),
            description: t("gameModes.time.description"),
          },
        },
      },
    },

    keyboard: {
      title: t("keyboard.title"),
      shortcuts: {
        navigate: t("keyboard.shortcuts.navigate"),
        selectNote: t("keyboard.shortcuts.selectNote"),
        nextNote: t("keyboard.shortcuts.nextNote"),
      },
    },

    positions: {
      found: t("positions.found"),
      remaining: (count: number) =>
        count === 1
          ? t("positions.remainingOne")
          : t("positions.remainingMany", { count }),
      allFound: t("positions.allFound"),
    },
  };
}
