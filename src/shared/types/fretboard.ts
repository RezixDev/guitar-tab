export const POINTS_OPTIONS = [5, 10, 20, 30, 40, 50] as const;
export type Points = (typeof POINTS_OPTIONS)[number];

export type GameMode = "newbie" | "easy" | "hard" | "findAll" | "time";

export type TutorialStep = {
  title: string;
  content: string;
  image?: string;
};

export type GameSession = {
  date: Date;
  mode: string;
  totalAttempts: number;
  correctAttempts: number;
  timeSpent: number;
  notesPlayed: string[];
};
