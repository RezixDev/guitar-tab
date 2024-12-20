// lib/learn/beginner-path.ts

import { LearningPath, Module, Lesson } from '@/types/learn';
import { COMMON_EXERCISES } from './exercises';

const MODULE_1_FOUNDATIONS: Module = {
  id: 'foundations',
  pathId: 'beginner',
  title: 'Guitar Foundations',
  description: 'Master the fundamental basics of guitar playing',
  order: 1,
  estimatedWeeks: 3,
  lessons: [
    {
      id: 'understanding-instrument',
      moduleId: 'foundations',
      title: 'Understanding Your Instrument',
      description: 'Learn about guitar anatomy and proper positioning',
      order: 1,
      content: {
        theory: `
# Understanding Your Guitar

1. Guitar Anatomy
- Headstock, neck, and body
- Frets and strings
- Tuning pegs and bridge

2. Proper Positioning
- Sitting position
- Standing with a strap
- Hand positioning
- Basic ergonomics
        `,
        videoUrl: '/videos/guitar-anatomy.mp4',
        images: ['/images/guitar-parts.png'],
        tools: ['tuner']
      },
      practiceExercises: [
        COMMON_EXERCISES.posture,
        {
          id: 'parts-identification',
          title: 'Guitar Parts Identification',
          description: 'Practice identifying different parts of the guitar',
          difficulty: 'beginner',
          estimatedMinutes: 10
        }
      ]
    },
    // Additional lessons...
  ]
};

const MODULE_2_CHORDS: Module = {
  id: 'essential-chords',
  pathId: 'beginner',
  title: 'Essential Chords',
  description: 'Learn your first chords and transitions',
  order: 2,
  estimatedWeeks: 6,
  lessons: [
    // Lessons implementation...
  ]
};

const MODULE_3_SONGS: Module = {
  id: 'first-songs',
  pathId: 'beginner',
  title: 'First Songs',
  description: 'Put everything together with your first songs',
  order: 3,
  estimatedWeeks: 6,
  lessons: [
    // Lessons implementation...
  ]
};

export const BEGINNER_PATH: LearningPath = {
  id: 'beginner',
  title: 'Beginner Fundamentals',
  description: 'Master the basics of guitar playing',
  difficulty: 'beginner',
  estimatedHours: 20,
  totalLessons: 12,
  modules: [
    MODULE_1_FOUNDATIONS,
    MODULE_2_CHORDS,
    MODULE_3_SONGS
  ]
};