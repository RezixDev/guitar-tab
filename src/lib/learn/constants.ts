// lib/learn/constants.ts
import { LearningPath } from '@/types/learn';

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
    },
    {
      id: 'basic-chords',
      title: 'Basic Chords',
      description: 'Learn essential open chords and transitions',
      difficulty: 'beginner',
      totalLessons: 8,
      estimatedHours: 15,
      prerequisites: ['fundamentals'],
    }
  ],
  intermediate: [
    {
      id: 'barre-chords',
      title: 'Barre Chords',
      description: 'Master barre chord shapes and transitions',
      difficulty: 'intermediate',
      totalLessons: 10,
      estimatedHours: 25,
      prerequisites: ['basic-chords'],
    }
  ],
  advanced: [
    {
      id: 'advanced-techniques',
      title: 'Advanced Techniques',
      description: 'Learn advanced guitar techniques',
      difficulty: 'advanced',
      totalLessons: 15,
      estimatedHours: 30,
      prerequisites: ['barre-chords'],
    }
  ]
};