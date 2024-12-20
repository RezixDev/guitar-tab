// lib/learn/paths/beginner-fundamentals.ts

import { Module, Lesson } from '@/types/learn';

const GUITAR_FOUNDATIONS_LESSONS: Lesson[] = [
  {
    id: 'understanding-instrument',
    moduleId: 'guitar-foundations',
    title: 'Understanding Your Instrument',
    description: 'Learn about guitar anatomy and proper positioning',
    order: 1,
    content: {
      theory: `
# Understanding Your Guitar

1. Guitar Anatomy
- Learn the parts: headstock, neck, body, bridge, and tuning machines
- Understand frets and strings
- Get familiar with your instrument's controls and features

2. Proper Posture
- Classical sitting position
- Casual sitting position
- Standing with a strap
- Common posture mistakes to avoid

3. Hand Positioning
- Fretting hand position and thumb placement
- Picking hand positioning
- Wrist alignment for both hands
- Common hand position mistakes to avoid
      `,
      videoUrl: '/videos/guitar-anatomy.mp4',
      images: ['/images/guitar-parts.png', '/images/proper-posture.png'],
      tools: []
    },
    practiceExercises: [
      {
        id: 'posture-check',
        title: 'Posture Check Routine',
        description: 'Practice proper sitting and standing positions with your guitar',
        difficulty: 'beginner',
        estimatedMinutes: 10
      },
      {
        id: 'finger-stretches',
        title: 'Basic Finger Stretches',
        description: 'Essential warm-up exercises for your hands',
        difficulty: 'beginner',
        estimatedMinutes: 5
      }
    ]
  },
  {
    id: 'tuning-maintenance',
    moduleId: 'guitar-foundations',
    title: 'Tuning & Maintenance',
    description: 'Learn how to tune your guitar and basic maintenance',
    order: 2,
    content: {
      theory: `
# Tuning Your Guitar

1. Using the Tuner App
- Understanding the tuner interface
- How to read tuner feedback
- Getting the perfect pitch

2. String Names and Mnemonics
- The six strings: E A D G B E
- Popular mnemonics to remember string names
- Understanding string thickness and pitch

3. Basic Guitar Care
- String cleaning and changing
- Neck and fretboard maintenance
- Body and hardware care
- When to seek professional setup
      `,
      videoUrl: '/videos/tuning-basics.mp4',
      tools: ['tuner']
    },
    practiceExercises: [
      {
        id: 'daily-tuning',
        title: 'Daily Tuning Routine',
        description: 'Practice tuning your guitar using the tuner app',
        difficulty: 'beginner',
        estimatedMinutes: 5,
        requiredTools: ['tuner']
      }
    ]
  },
  {
    id: 'first-notes',
    moduleId: 'guitar-foundations',
    title: 'First Notes',
    description: 'Learn to play your first notes on the guitar',
    order: 3,
    content: {
      theory: `
# Playing Your First Notes

1. Pick Technique
- How to hold the pick
- Pick angle and attack
- Common picking mistakes
- Alternative picking introduction

2. Single String Exercises
- Open string exercises
- First fret exercises
- Moving between frets
- Basic finger independence

3. Basic Finger Placement
- Finger numbering system
- Proper finger placement behind frets
- Avoiding common beginner mistakes
      `,
      tablature: `
Simple Exercise:
e|--0--1--2--3--|
B|--------------|
G|--------------|
D|--------------|
A|--------------|
E|--------------|
      `,
      videoUrl: '/videos/first-notes.mp4'
    },
    practiceExercises: [
      {
        id: 'single-string-melody',
        title: 'One-String Melodies',
        description: 'Practice playing simple melodies on a single string',
        difficulty: 'beginner',
        estimatedMinutes: 10,
        tabs: `
Practice Pattern:
e|--0--1--2--3--2--1--0--|
        `
      }
    ]
  }
];

const ESSENTIAL_CHORDS_LESSONS: Lesson[] = [
  {
    id: 'first-chords',
    moduleId: 'essential-chords',
    title: 'First Chords',
    description: 'Learn your first two-finger chords',
    order: 1,
    content: {
      theory: `
# Your First Chords

1. Em and Am Chords
- Finger placement for Em
- Finger placement for Am
- Common challenges and solutions
- Checking each string rings clearly

2. Clean Transitions
- Lifting and placing fingers efficiently
- Maintaining hand position
- Practice techniques for smooth changes
      `,
      videoUrl: '/videos/first-chords.mp4',
      images: ['/images/em-chord.png', '/images/am-chord.png']
    },
    practiceExercises: [
      {
        id: 'two-chord-songs',
        title: '2-Chord Song Practice',
        description: 'Practice switching between Em and Am chords',
        difficulty: 'beginner',
        estimatedMinutes: 15
      }
    ]
  },
  {
    id: 'major-chords',
    moduleId: 'essential-chords',
    title: 'Major Chords',
    description: 'Master essential major chords',
    order: 2,
    content: {
      theory: `
# Major Chord Basics

1. A, D, and G Major
- Finger placement for each chord
- Common fingering patterns
- Troubleshooting muted strings

2. C Major Introduction
- The C major shape
- Common challenges
- Practice tips

3. Reading Chord Diagrams
- Understanding chord diagrams
- Finger numbering system
- Reading chord charts
      `,
      videoUrl: '/videos/major-chords.mp4'
    },
    practiceExercises: [
      {
        id: 'chord-progressions',
        title: 'Basic Chord Progressions',
        description: 'Practice common chord progressions',
        difficulty: 'beginner',
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: 'strumming-basics',
    moduleId: 'essential-chords',
    title: 'Strumming Basics',
    description: 'Learn fundamental strumming patterns',
    order: 3,
    content: {
      theory: `
# Basic Strumming

1. Down Strums
- Basic down strum technique
- Rhythm and timing
- Using a metronome

2. Down-Up Patterns
- Adding upstrums
- Common patterns
- Building speed and consistency

3. Basic Timing
- Quarter note strumming
- Eighth note patterns
- Common timing mistakes
      `,
      videoUrl: '/videos/strumming-basics.mp4',
      tools: ['metronome']
    },
    practiceExercises: [
      {
        id: 'metronome-practice',
        title: 'Strumming with Metronome',
        description: 'Practice basic strumming patterns with a metronome',
        difficulty: 'beginner',
        estimatedMinutes: 15,
        requiredTools: ['metronome']
      }
    ]
  }
];

const FIRST_SONGS_LESSONS: Lesson[] = [
  {
    id: 'three-chord-songs',
    moduleId: 'first-songs',
    title: 'Three Chord Songs',
    description: 'Learn to play simple songs with three chords',
    order: 1,
    content: {
      theory: `
# Playing Your First Songs

1. Three-Chord Song Structure
- Common chord progressions
- Song form (verse, chorus)
- Practice strategies

2. Basic Rhythm Patterns
- Essential strumming patterns
- Counting while playing
- Building muscle memory

3. Song Structure
- Understanding verses and choruses
- Simple song arrangements
- Practice tips for complete songs
      `,
      videoUrl: '/videos/first-songs.mp4'
    },
    practiceExercises: [
      {
        id: 'simple-songs',
        title: 'Simple Song Practice',
        description: 'Practice playing complete songs with three chords',
        difficulty: 'beginner',
        estimatedMinutes: 20
      }
    ]
  }
];

export const BEGINNER_FUNDAMENTALS = {
  foundations: GUITAR_FOUNDATIONS_LESSONS,
  essentialChords: ESSENTIAL_CHORDS_LESSONS,
  firstSongs: FIRST_SONGS_LESSONS
};