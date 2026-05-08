export type Difficulty = "beginner" | "intermediate" | "advanced";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

export type LessonContent = {
  theory: string;
  tablature?: string;
  videoUrl?: string;
  images?: string[];
  quiz?: QuizQuestion[];
  tools?: string[];
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tabs?: string;
  videoUrl?: string;
  requiredTools?: string[];
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  content: LessonContent;
  practiceExercises: Exercise[];
  prerequisites?: string[];
};

export type Module = {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  lessons: Lesson[];
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  totalLessons: number;
  estimatedHours: number;
  prerequisites?: string[];
  modules?: Module[];
};

export type UserProgress = {
  userId: string;
  pathId: string;
  completedLessons: string[];
  currentLessonId: string;
  exerciseScores: Record<string, number>;
};
