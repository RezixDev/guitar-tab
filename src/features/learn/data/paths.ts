import type { LearningPath } from "@shared/types/learn";

type LearningPathsByDifficulty = {
  beginner: LearningPath[];
  intermediate: LearningPath[];
  advanced: LearningPath[];
};

export const LEARNING_PATHS: LearningPathsByDifficulty = {
  beginner: [
    {
      id: "fundamentals",
      title: "paths.fundamentals.title",
      description: "paths.fundamentals.description",
      difficulty: "beginner",
      totalLessons: 18,
      estimatedHours: 20,
      prerequisites: [],
    },
    {
      id: "basic-chords",
      title: "paths.basic-chords.title",
      description: "paths.basic-chords.description",
      difficulty: "beginner",
      totalLessons: 15,
      estimatedHours: 18,
      prerequisites: ["fundamentals"],
    },
  ],
  intermediate: [
    {
      id: "barre-chords",
      title: "paths.barre-chords.title",
      description: "paths.barre-chords.description",
      difficulty: "intermediate",
      totalLessons: 12,
      estimatedHours: 15,
      prerequisites: ["basic-chords"],
    },
  ],
  advanced: [
    {
      id: "advanced-techniques",
      title: "paths.advanced-techniques.title",
      description: "paths.advanced-techniques.description",
      difficulty: "advanced",
      totalLessons: 12,
      estimatedHours: 20,
      prerequisites: ["barre-chords"],
    },
  ],
};
