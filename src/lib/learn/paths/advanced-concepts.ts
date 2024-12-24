// lib/learn/paths/advanced-concepts.ts
import { Lesson } from '@/types/learn';

const ADVANCED_TECHNIQUES_LESSONS: Lesson[] = [
  {
    id: 'sweep-picking',
    moduleId: 'advanced-techniques',
    title: 'Sweep Picking Fundamentals',
    description: 'Master the basics of sweep picking technique',
    order: 1,
    content: {
      theory: `
# Sweep Picking Basics

1. Understanding Sweep Picking
- Proper pick angle
- Hand synchronization
- Basic sweep patterns
- Common mistakes

2. Practice Techniques
- Starting slowly
- Building accuracy
- Speed development
- Exercise progression
      `,
      videoUrl: '/videos/sweep-picking.mp4',
      tablature: `
Basic Sweep Pattern:
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
        id: 'basic-sweeps',
        title: 'Basic Sweep Patterns',
        description: 'Practice fundamental sweep picking patterns',
        difficulty: 'advanced',
        estimatedMinutes: 20
      }
    ]
  }
  // Add more lessons...
];

const PROFESSIONAL_HARMONY_LESSONS: Lesson[] = [
  {
    id: 'extended-chords',
    moduleId: 'professional-harmony',
    title: 'Extended Chord Voicings',
    description: 'Learn advanced chord voicings and extensions',
    order: 1,
    content: {
      theory: `
# Extended Chord Voicings

1. Seventh Chords
- Major 7th voicings
- Minor 7th voicings
- Dominant 7th applications
- Voice leading concepts

2. Extended Harmonies
- 9th chords
- 11th chords
- 13th chords
- Altered dominants
      `,
      videoUrl: '/videos/extended-chords.mp4'
    },
    practiceExercises: [
      {
        id: 'seventh-chord-practice',
        title: 'Seventh Chord Practice',
        description: 'Practice various seventh chord voicings',
        difficulty: 'advanced',
        estimatedMinutes: 25
      }
    ]
  }
  // Add more lessons...
];

export const ADVANCED_CONCEPTS = {
  advancedTechniques: ADVANCED_TECHNIQUES_LESSONS,
  professionalHarmony: PROFESSIONAL_HARMONY_LESSONS,
  // Add more module lessons...
};