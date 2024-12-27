// lib/learn/constants.ts
import type { LearningPath } from '@/types/learn';

type LearningPathsByDifficulty = {
  beginner: LearningPath[];
  intermediate: LearningPath[];
  advanced: LearningPath[];
};

export const LEARNING_PATHS: LearningPathsByDifficulty = {
  beginner: [
    {
      id: 'fundamentals',
      title: 'paths.fundamentals.title',
      description: 'paths.fundamentals.description',
      difficulty: 'beginner',
      totalLessons: 18,
      estimatedHours: 20,
      prerequisites: [],
      modules: [
        {
          id: 'guitar-basics',
          pathId: 'fundamentals',
          title: 'Guitar Setup Basics',
          description: 'Learn proper guitar setup and positioning',
          order: 1,
          estimatedWeeks: 1,
          lessons: []
        }
      ]
    },
    {
      id: 'basic-chords',
      title: 'paths.basic-chords.title',
      description: 'paths.basic-chords.description',
      difficulty: 'beginner',
      totalLessons: 15,
      estimatedHours: 18,
      prerequisites: ['fundamentals'],
      modules: [
        {
          id: 'open-chords',
          pathId: 'basic-chords',
          title: 'Open Chords',
          description: 'Master all essential open chords',
          order: 1,
          estimatedWeeks: 4,
          lessons: []
        }
      ]
    }
  ],
  intermediate: [
    {
      id: 'barre-chords',
      title: 'paths.barre-chords.title',
      description: 'paths.barre-chords.description',
      difficulty: 'intermediate',
      totalLessons: 12,
      estimatedHours: 15,
      prerequisites: ['basic-chords'],
      modules: [
        {
          id: 'barre-fundamentals',
          pathId: 'barre-chords',
          title: 'Barre Chord Fundamentals',
          description: 'Learn essential barre chord techniques',
          order: 1,
          estimatedWeeks: 4,
          lessons: []
        }
      ]
    }
  ],
  advanced: [
    {
      id: 'advanced-techniques',
      title: 'paths.advanced-techniques.title',
      description: 'paths.advanced-techniques.description',
      difficulty: 'advanced',
      totalLessons: 12,
      estimatedHours: 20,
      prerequisites: ['barre-chords'],
      modules: [
        {
          id: 'advanced-lead',
          pathId: 'advanced-techniques',
          title: 'Advanced Lead Techniques',
          description: 'Master complex lead guitar techniques',
          order: 1,
          estimatedWeeks: 4,
          lessons: []
        }
      ]
    }
  ]
};