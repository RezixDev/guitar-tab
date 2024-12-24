// lib/learn/paths/intermediate-techniques.ts
import { Lesson } from '@/types/learn';

const ADVANCED_RHYTHM_LESSONS: Lesson[] = [
  {
    id: 'complex-strumming',
    moduleId: 'advanced-rhythm',
    title: 'Complex Strumming Patterns',
    description: 'Master advanced strumming techniques and patterns',
    order: 1,
    content: {
      theory: `
# Advanced Strumming Patterns

1. Sixteenth Note Patterns
- Understanding 16th note timing
- Advanced up-down patterns
- Syncopated strumming
- Rhythm exercises

2. Dynamic Control
- Volume variation techniques
- Accent patterns
- Building intensity
- Dynamic exercises
      `,
      videoUrl: '/videos/complex-strumming.mp4',
      tools: ['metronome']
    },
    practiceExercises: [
      {
        id: 'syncopated-strumming',
        title: 'Syncopated Strumming Practice',
        description: 'Practice complex syncopated patterns',
        difficulty: 'intermediate',
        estimatedMinutes: 20,
        requiredTools: ['metronome']
      }
    ]
  },
  // Add more lessons...
];

const LEAD_GUITAR_LESSONS: Lesson[] = [
  {
    id: 'pentatonic-scales',
    moduleId: 'lead-guitar',
    title: 'Pentatonic Scale Patterns',
    description: 'Learn the essential pentatonic scale patterns',
    order: 1,
    content: {
      theory: `
# Pentatonic Scales

1. Minor Pentatonic Scale
- First position pattern
- Scale construction
- Common licks
- Practice patterns

2. Scale Application
- Using scales in solos
- Connecting positions
- Practice techniques
      `,
      videoUrl: '/videos/pentatonic-scales.mp4',
      tablature: `
Minor Pentatonic:
e|---------------------------
b|---------------------------
G|---------------------------
D|---------------------------
A|---------------------------
E|---------------------------
      `
    },
    practiceExercises: [
      {
        id: 'pentatonic-practice',
        title: 'Pentatonic Scale Practice',
        description: 'Practice the minor pentatonic scale pattern',
        difficulty: 'intermediate',
        estimatedMinutes: 15
      }
    ]
  }
  // Add more lessons...
];

export const INTERMEDIATE_TECHNIQUES = {
  advancedRhythm: ADVANCED_RHYTHM_LESSONS,
  leadGuitar: LEAD_GUITAR_LESSONS,
  // Add more module lessons...
};

