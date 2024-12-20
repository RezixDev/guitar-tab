// types/learn.ts

export interface Module {
  id: string;
  pathId: string;
  title: string;
  description: string;
  order: number;
  estimatedWeeks: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  content: LessonContent;
  practiceExercises: Exercise[];
  prerequisites?: string[]; // IDs of required lessons
}

export interface LessonContent {
  theory: string;
  tablature?: string;
  videoUrl?: string;
  images?: string[];
  quiz?: QuizQuestion[];
  tools?: string[]; // References to tools like "tuner", "metronome"
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  tabs?: string;
  videoUrl?: string;
  requiredTools?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  totalLessons: number;
  modules: Module[];
}