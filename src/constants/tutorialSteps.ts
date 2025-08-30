// constants/tutorialSteps.ts
export type TutorialStep = {
    title: string;
    content: string;
    image?: string;
}

export const tutorialSteps: TutorialStep[] = [
    {
        title: "Welcome to Fretboard Master!",
        content: "Learn to master the guitar fretboard through fun, interactive exercises. This tutorial will guide you through the basics.",
    },
    {
        title: "Game Modes",
        content: "Choose from three game modes:\n\n• Show All Notes: Perfect for beginners, shows all possible positions\n• Guess One Position: Find any correct position of the note\n• Guess All Positions: Challenge yourself to find every position of the note",
    },
    {
        title: "Tuning Options",
        content: "Select from different tunings:\n\n• Standard (EADGBE)\n• Half Step Down (Eb Ab Db Gb Bb Eb)\n• Drop D (DADGBE)\n\nThe fretboard will update automatically when you change tunings.",
    },
    {
        title: "Time Challenge",
        content: "Enable Time Challenge mode to track your speed. Try to beat your best time while maintaining accuracy. Your best times are saved for each difficulty level.",
    },
    {
        title: "Keyboard Controls",
        content: "Use your keyboard for faster navigation:\n\n• Arrow keys (←↑↓→): Navigate the fretboard\n• Space: Select note\n• Enter: Next note when available",
    },
    {
        title: "Ready to Play!",
        content: "Start with 'Show All Notes' mode to learn the fretboard, then challenge yourself with the other modes as you improve. Good luck!",
    }
];
