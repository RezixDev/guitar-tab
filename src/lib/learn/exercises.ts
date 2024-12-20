// lib/learn/exercises.ts
import { Exercise } from '@/types/learn';

export const COMMON_EXERCISES: Record<string, Exercise> = {
  posture: {
    id: 'common-posture',
    title: 'Posture Check',
    description: 'Practice maintaining correct posture while holding the guitar',
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  
  tuning: {
    id: 'common-tuning',
    title: 'Basic Tuning',
    description: 'Practice tuning your guitar using the tuner app',
    difficulty: 'beginner',
    estimatedMinutes: 5,
    requiredTools: ['tuner']
  },
  
  fingerPlacement: {
    id: 'common-finger-placement',
    title: 'Finger Placement',
    description: 'Practice placing your fingers correctly on different frets',
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  
  strumming: {
    id: 'common-strumming',
    title: 'Basic Strumming Pattern',
    description: 'Practice the down-up strumming pattern slowly',
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  
  metronome: {
    id: 'common-metronome',
    title: 'Metronome Practice',
    description: 'Practice playing in time with the metronome',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    requiredTools: ['metronome']
  },
  
  chordTransitions: {
    id: 'common-chord-transitions',
    title: 'Chord Transitions',
    description: 'Practice smooth transitions between chords',
    difficulty: 'beginner',
    estimatedMinutes: 15
  },
  
  warmup: {
    id: 'common-warmup',
    title: 'Basic Warm-up',
    description: 'Essential finger and hand warm-up exercises',
    difficulty: 'beginner',
    estimatedMinutes: 5
  },
  
  picking: {
    id: 'common-picking',
    title: 'Basic Picking',
    description: 'Practice basic picking patterns on open strings',
    difficulty: 'beginner',
    estimatedMinutes: 10
  },
  
  singleString: {
    id: 'common-single-string',
    title: 'Single String Practice',
    description: 'Practice playing notes on a single string with proper technique',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    tabs: `
e|--0--1--2--3--|
B|--------------|
G|--------------|
D|--------------|
A|--------------|
E|--------------|
    `
  },
  
  rhythmReading: {
    id: 'common-rhythm-reading',
    title: 'Rhythm Reading',
    description: 'Practice reading and playing basic rhythm patterns',
    difficulty: 'beginner',
    estimatedMinutes: 10,
    requiredTools: ['metronome']
  }
};

// Helper function to get exercise
export const getExercise = (exerciseId: string): Exercise | undefined => {
  return Object.values(COMMON_EXERCISES).find(exercise => exercise.id === exerciseId);
};

// Helper function to combine exercises with custom parameters
export const customizeExercise = (
  baseExercise: Exercise,
  customizations: Partial<Exercise>
): Exercise => {
  return {
    ...baseExercise,
    ...customizations,
    id: `${baseExercise.id}-custom`
  };
};