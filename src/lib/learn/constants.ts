// lib/learn/constants.ts
import { LearningPath, Module } from '@/types/learn';
import { BEGINNER_FUNDAMENTALS } from './paths/beginner-fundamentals';

export const LEARNING_PATHS: Record<string, LearningPath[]> = {
  beginner: [
    {
      id: 'fundamentals',
      title: 'Beginner Fundamentals',
      description: 'Master the basics of guitar playing',
      difficulty: 'beginner',
      totalLessons: 12,
      estimatedHours: 20,
      prerequisites: [],
      modules: [
        {
          id: 'guitar-foundations',
          pathId: 'fundamentals',
          title: 'Guitar Foundations',
          description: 'Learn the essential basics of guitar',
          order: 1,
          estimatedWeeks: 3,
          lessons: BEGINNER_FUNDAMENTALS.foundations
        },
        {
          id: 'essential-chords',
          pathId: 'fundamentals',
          title: 'Essential Chords',
          description: 'Master your first basic chords',
          order: 2,
          estimatedWeeks: 6,
          lessons: BEGINNER_FUNDAMENTALS.essentialChords
        },
        {
          id: 'first-songs',
          pathId: 'fundamentals',
          title: 'First Songs',
          description: 'Put everything together with simple songs',
          order: 3,
          estimatedWeeks: 6,
          lessons: BEGINNER_FUNDAMENTALS.firstSongs
        }
      ]
    }
  ]
};

// Helper functions to get path and module information
export const getPath = (pathId: string): LearningPath | undefined => {
  return Object.values(LEARNING_PATHS)
    .flat()
    .find(path => path.id === pathId);
};

export const getModule = (pathId: string, moduleId: string): Module | undefined => {
  const path = getPath(pathId);
  return path?.modules.find(module => module.id === moduleId);
};

// Calculate total progress for a path
export const calculatePathProgress = (
  pathId: string,
  completedLessons: string[]
): number => {
  const path = getPath(pathId);
  if (!path) return 0;

  const totalLessons = path.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const completedPathLessons = completedLessons.filter(lessonId =>
    path.modules.some(module =>
      module.lessons.some(lesson => lesson.id === lessonId)
    )
  );

  return Math.round((completedPathLessons.length / totalLessons) * 100);
};

// Calculate module progress
export const calculateModuleProgress = (
  pathId: string,
  moduleId: string,
  completedLessons: string[]
): number => {
  const module = getModule(pathId, moduleId);
  if (!module) return 0;

  const completedModuleLessons = completedLessons.filter(lessonId =>
    module.lessons.some(lesson => lesson.id === lessonId)
  );

  return Math.round((completedModuleLessons.length / module.lessons.length) * 100);
};