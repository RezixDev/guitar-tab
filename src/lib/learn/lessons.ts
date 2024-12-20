import { Lesson, Exercise } from '@/types/learn';

// Common exercises that can be reused across lessons
const COMMON_EXERCISES: Record<string, Exercise> = {
  fingerPlacement: {
    id: 'ex-finger-placement',
    title: 'Finger Placement Practice',
    description: 'Practice placing your fingers correctly on different frets',
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  strumming: {
    id: 'ex-strumming',
    title: 'Basic Strumming Pattern',
    description: 'Practice the down-up strumming pattern slowly',
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  posture: {
    id: 'ex-posture',
    title: 'Posture Check',
    description: 'Practice maintaining correct posture while holding the guitar',
    difficulty: 'beginner',
    estimatedMinutes: 5
  }
};

export const FUNDAMENTALS_LESSONS: Lesson[] = [
  // Previous lessons 1-4 remain the same...

  {
    id: 'fundamentals-5',
    pathId: 'fundamentals',
    title: 'Introduction to Reading Music',
    description: 'Learn the basics of reading music notation and tablature',
    order: 5,
    content: {
      theory: `
Understanding how to read music will open up a world of possibilities:

1. Music Notation Basics
- The staff and clef
- Note values and timing
- Reading tablature effectively

2. Practice Reading
- Simple exercises
- Combining tab and standard notation
      `,
      images: ['/images/music-notation.png'],
      videoUrl: '/videos/reading-music.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-note-reading',
        title: 'Note Reading Practice',
        description: 'Practice identifying notes on the staff and matching them to your guitar',
        difficulty: 'beginner',
        estimatedMinutes: 15
      }
    ]
  },
  {
    id: 'fundamentals-6',
    pathId: 'fundamentals',
    title: 'Your First Open String Notes',
    description: 'Learn to play and identify open string notes',
    order: 6,
    content: {
      theory: `
Let's start playing actual notes:

1. Open Strings
- Understanding pitch
- String names (E, A, D, G, B, E)
- Tuning by ear

2. Simple Exercises
- String skipping
- Alternating strings
- Basic picking patterns
      `,
      videoUrl: '/videos/open-strings.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-string-skipping',
        title: 'String Skipping Exercise',
        description: 'Practice playing alternating open strings with proper technique',
        difficulty: 'beginner',
        estimatedMinutes: 10
      }
    ]
  },
  {
    id: 'fundamentals-7',
    pathId: 'fundamentals',
    title: 'Introduction to Single Notes',
    description: 'Learn to play individual notes on different strings and frets',
    order: 7,
    content: {
      theory: `
Moving beyond open strings to fretted notes:

1. First Position Notes
- Understanding the fretboard
- Notes on the first three frets
- Proper finger placement

2. Simple Melodies
- Single string melodies
- Two-string combinations
- Basic songs
      `,
      tablature: `
Simple Exercise:
e|--0--1--2--3--|
B|--0--1--2--3--|
G|--------------|
D|--------------|
A|--------------|
E|--------------|
      `,
      videoUrl: '/videos/single-notes.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-single-notes',
        title: 'Single Note Practice',
        description: 'Practice playing individual notes clearly and in rhythm',
        difficulty: 'beginner',
        estimatedMinutes: 20,
        tabs: `
Practice Pattern:
e|--0--1--2--3--|
B|--0--1--2--3--|
        `
      }
    ]
  },
  {
    id: 'fundamentals-8',
    pathId: 'fundamentals',
    title: 'Basic Picking Techniques',
    description: 'Learn fundamental picking patterns and exercises',
    order: 8,
    content: {
      theory: `
Develop your picking technique:

1. Pick Grip and Movement
- Proper pick holding
- Pick angle and attack
- Alternate picking basics

2. Picking Exercises
- Single string exercises
- String crossing
- Speed building
      `,
      videoUrl: '/videos/picking-basics.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-alternate-picking',
        title: 'Alternate Picking Exercise',
        description: 'Practice alternate picking on single strings',
        difficulty: 'beginner',
        estimatedMinutes: 15
      }
    ]
  },
  {
    id: 'fundamentals-9',
    pathId: 'fundamentals',
    title: 'Reading Rhythms',
    description: 'Develop your understanding of rhythm and timing',
    order: 9,
    content: {
      theory: `
Master the basics of rhythm:

1. Note Values
- Whole notes
- Half notes
- Quarter notes
- Eighth notes

2. Time Signatures
- 4/4 time
- Basic counting
- Using a metronome
      `,
      videoUrl: '/videos/rhythm-reading.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-rhythm-reading',
        title: 'Rhythm Reading Exercise',
        description: 'Practice reading and playing different note values with a metronome',
        difficulty: 'beginner',
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: 'fundamentals-10',
    pathId: 'fundamentals',
    title: 'Basic Scale Patterns',
    description: 'Learn your first scale patterns',
    order: 10,
    content: {
      theory: `
Introduction to scales:

1. Chromatic Scale
- Understanding half steps
- First position pattern
- Building finger strength

2. Major Scale Pattern
- C major scale pattern
- Scale degree numbers
- Practice techniques
      `,
      tablature: `
C Major Scale:
e|--0--1--3--|
B|--0--1--3--|
G|--0--2--|
D|--0--2--|
A|--0--2--|
E|--0--3--|
      `,
      videoUrl: '/videos/basic-scales.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-major-scale',
        title: 'C Major Scale Practice',
        description: 'Practice playing the C major scale ascending and descending',
        difficulty: 'beginner',
        estimatedMinutes: 20,
        tabs: `
C Major Scale:
e|--0--1--3--|
B|--0--1--3--|
G|--0--2--|
        `
      }
    ]
  },
  {
    id: 'fundamentals-11',
    pathId: 'fundamentals',
    title: 'Simple Melodies',
    description: 'Put everything together with simple songs',
    order: 11,
    content: {
      theory: `
Apply your skills to real music:

1. Simple Songs
- "Ode to Joy"
- "Amazing Grace"
- "Happy Birthday"

2. Practice Tips
- Breaking down the melody
- Combining skills
- Building speed
      `,
      tablature: `
Ode to Joy (simplified):
e|--0--0--1--2--2--1--0--|
B|------------------------|
      `,
      videoUrl: '/videos/simple-melodies.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-melody-practice',
        title: 'Melody Practice',
        description: 'Practice playing simple melodies with proper timing',
        difficulty: 'beginner',
        estimatedMinutes: 25,
        tabs: `
Ode to Joy:
e|--0--0--1--2--2--1--0--|
        `
      }
    ]
  },
  {
    id: 'fundamentals-12',
    pathId: 'fundamentals',
    title: 'Fundamentals Review and Next Steps',
    description: 'Review key concepts and prepare for basic chords',
    order: 12,
    content: {
      theory: `
Let's review and look ahead:

1. Review
- Posture and technique
- Reading music and tab
- Scales and melodies
- Picking and rhythm

2. Next Steps
- Preview of basic chords
- Practice routine
- Goal setting
      `,
      videoUrl: '/videos/review-next-steps.mp4'
    },
    practiceExercises: [
      {
        id: 'ex-comprehensive-review',
        title: 'Comprehensive Review',
        description: 'Practice exercises from throughout the course',
        difficulty: 'beginner',
        estimatedMinutes: 30
      }
    ]
  }
];

// Helper functions remain the same...

export const getLesson = (lessonId: string): Lesson | undefined => {
  return FUNDAMENTALS_LESSONS.find(lesson => lesson.id === lessonId);
};

export const getNextLesson = (currentLessonId: string): Lesson | undefined => {
  const currentLesson = getLesson(currentLessonId);
  if (!currentLesson) return undefined;
  
  return FUNDAMENTALS_LESSONS.find(lesson => lesson.order === currentLesson.order + 1);
};

export const isLessonAccessible = (
  lessonId: string,
  completedLessons: string[]
): boolean => {
  const lesson = getLesson(lessonId);
  if (!lesson) return false;
  
  // First lesson is always accessible
  if (lesson.order === 1) return true;
  
  // Check if previous lesson is completed
  const previousLesson = FUNDAMENTALS_LESSONS.find(l => l.order === lesson.order - 1);
  return previousLesson ? completedLessons.includes(previousLesson.id) : false;
};