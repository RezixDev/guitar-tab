export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  totalLessons: number;
  estimatedHours: number;
  prerequisites?: string[];
};

export type Lesson = {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  content: LessonContent;
  practiceExercises: Exercise[];
};

export type LessonContent = {
  videoUrl?: string;
  theory: string;
  tablature?: string;
  images?: string[];
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tabs?: string;
};

export type UserProgress = {
  userId: string;
  pathId: string;
  completedLessons: string[];
  currentLessonId: string;
  exerciseScores: Record<string, number>;
};