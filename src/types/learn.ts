export type Module = {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  lessons: Lesson[];
}

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  content: LessonContent;
  practiceExercises: Exercise[];
  prerequisites?: string[]; // IDs of required lessons
}

export type LessonContent = {
  theory: string;
  tablature?: string;
  videoUrl?: string;
  images?: string[];
  quiz?: QuizQuestion[];
  tools?: string[]; // References to tools like "tuner", "metronome"
}

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tabs?: string;
  videoUrl?: string;
  requiredTools?: string[];
}

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalLessons: number;
  estimatedHours: number;
  prerequisites?: string[]; // Added this line to fix the TypeScript error
  modules?: Module[];
}

export type UserProgress = {
  userId: string;
  pathId: string;
  completedLessons: string[];
  currentLessonId: string;
  exerciseScores: Record<string, number>;
}

// Adding QuizQuestion interface since it was referenced but not defined
export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}