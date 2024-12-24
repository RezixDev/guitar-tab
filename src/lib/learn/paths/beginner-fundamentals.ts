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
    description: 'Learn your first two-finger chords: Em and Am',
    order: 1,
    content: {
      theory: `
# Your First Chords

1. Em and Am Chords
- The Em chord uses two fingers on the second fret
- Finger 2: Second fret of the A string (5th string)
- Finger 3: Second fret of the D string (4th string)
- All strings should ring clearly when strummed
- The Am chord also uses two fingers
- Finger 1: First fret of the B string (2nd string)
- Finger 2: Second fret of the G string (3rd string)
- Strum from the A string (5th string) down

2. Clean Transitions
- Keep fingers close to the fretboard
- Practice lifting all fingers together
- Land all fingers together for cleaner changes
- Start slowly and build speed gradually
- Use minimal finger movement when switching

3. Common Problems to Avoid
- Muted strings or buzzing sounds
- Fingers too far from frets
- Pressing too hard or too softly
- Poor thumb position behind neck
- Strumming wrong strings
      `,
      videoUrl: '/videos/first-chords.mp4',
      images: ['/images/em-chord.png', '/images/am-chord.png']
    },
    practiceExercises: [
      {
        id: 'em-practice',
        title: 'Em Chord Practice',
        description: 'Practice forming and strumming the Em chord cleanly',
        difficulty: 'beginner',
        estimatedMinutes: 10
      },
      {
        id: 'am-practice',
        title: 'Am Chord Practice',
        description: 'Practice forming and strumming the Am chord cleanly',
        difficulty: 'beginner',
        estimatedMinutes: 10
      },
      {
        id: 'two-chord-songs',
        title: '2-Chord Song Practice',
        description: 'Practice switching between Em and Am chords with a metronome',
        difficulty: 'beginner',
        estimatedMinutes: 15,
        requiredTools: ['metronome']
      }
    ]
  },
  {
    id: 'major-chords',
    moduleId: 'essential-chords',
    title: 'Major Chords',
    description: 'Master essential major chords: A, D, G, and C',
    order: 2,
    content: {
      theory: `
# Major Chord Basics

1. A, D, and G Major
- A Major: Three fingers on 2nd fret (strings 4, 3, and 2)
- D Major: Three fingers in a triangle shape (strings 1, 2, and 3)
- G Major: Fingers 1, 2, and 3 form a diagonal line
- Pay attention to which strings to strum for each chord
- Check that each string rings clearly

2. C Major Introduction
- C Major is slightly harder due to finger stretch
- First finger on 1st fret of B string
- Second finger on 2nd fret of D string
- Third finger on 3rd fret of A string
- Practice rolling your fingers for clean sound

3. Reading Chord Diagrams
- Vertical lines represent strings (E A D G B E)
- Horizontal lines represent frets
- Black dots show where to place fingers
- O above string means play open
- X above string means don't play

4. Common Progressions
- G-C-D (I-IV-V in G)
- A-D-E (I-IV-V in A)
- Em-C-G (vi-IV-I in G)
- Practice these progressions slowly
      `,
      videoUrl: '/videos/major-chords.mp4',
      images: [
        '/images/a-major.png',
        '/images/d-major.png',
        '/images/g-major.png',
        '/images/c-major.png'
      ]
    },
    practiceExercises: [
      {
        id: 'major-chord-practice',
        title: 'Individual Chord Practice',
        description: 'Practice forming each major chord and checking string clarity',
        difficulty: 'beginner',
        estimatedMinutes: 15
      },
      {
        id: 'chord-progressions',
        title: 'Basic Chord Progressions',
        description: 'Practice G-C-D and A-D-E progressions slowly',
        difficulty: 'beginner',
        estimatedMinutes: 20,
        requiredTools: ['metronome']
      }
    ]
  },
  {
    id: 'strumming-basics',
    moduleId: 'essential-chords',
    title: 'Strumming Basics',
    description: 'Learn fundamental strumming patterns and timing',
    order: 3,
    content: {
      theory: `
# Basic Strumming

1. Down Strums
- Hold pick with firm but relaxed grip
- Strum from elbow, not just wrist
- Keep consistent downward pressure
- Practice with single chords first
- Count "1-2-3-4" while strumming

2. Down-Up Patterns
- Start with "Down Down Down Down"
- Progress to "Down-Up-Down-Up"
- Focus on steady, even timing
- Keep arm moving constantly
- Don't stop between strums

3. Basic Timing
- Quarter notes: Down strums on 1-2-3-4
- Eighth notes: Down-Up on each beat
- Use metronome starting at 60 BPM
- Gradually increase speed
- Practice transitions while strumming
      `,
      videoUrl: '/videos/strumming-basics.mp4',
      tools: ['metronome'],
      tablature: `
Basic Patterns:
Quarter Notes:    ↓     ↓     ↓     ↓
                 1     2     3     4

Eighth Notes:     ↓  ↑  ↓  ↑  ↓  ↑  ↓  ↑
                 1  +  2  +  3  +  4  +
      `
    },
    practiceExercises: [
      {
        id: 'down-strums',
        title: 'Down Strum Practice',
        description: 'Practice quarter note down strums with the metronome',
        difficulty: 'beginner',
        estimatedMinutes: 10,
        requiredTools: ['metronome']
      },
      {
        id: 'down-up-pattern',
        title: 'Down-Up Pattern Practice',
        description: 'Practice eighth note down-up patterns',
        difficulty: 'beginner',
        estimatedMinutes: 15,
        requiredTools: ['metronome']
      },
      {
        id: 'metronome-practice',
        title: 'Strumming with Chord Changes',
        description: 'Practice strumming patterns while changing chords',
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