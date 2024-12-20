import { LearningPath, UserProgress } from '@/types/learn';

export const LEARNING_PATHS: Record<string, LearningPath[]> = {
  beginner: [
    {
      id: 'fundamentals',
      title: 'Beginner Fundamentals',
      description: 'Master the basics of guitar playing, including proper posture, holding the guitar, and basic finger exercises',
      difficulty: 'beginner',
      totalLessons: 12,
      estimatedHours: 20,
      prerequisites: [],
    },
    {
      id: 'basic-chords',
      title: 'Basic Chords',
      description: 'Learn essential open chords, chord transitions, and basic strumming patterns',
      difficulty: 'beginner',
      totalLessons: 8,
      estimatedHours: 15,
      prerequisites: ['fundamentals'],
    },
    {
      id: 'rhythm-basics',
      title: 'Rhythm Foundations',
      description: 'Develop your sense of timing, learn basic rhythmic patterns, and master simple songs',
      difficulty: 'beginner',
      totalLessons: 10,
      estimatedHours: 18,
      prerequisites: ['fundamentals'],
    }
  ],
  intermediate: [
    {
      id: 'barre-chords',
      title: 'Barre Chords',
      description: 'Master barre chord shapes, transitions, and common progressions using barre chords',
      difficulty: 'intermediate',
      totalLessons: 10,
      estimatedHours: 25,
      prerequisites: ['basic-chords'],
    },
    {
      id: 'fingerpicking',
      title: 'Fingerpicking Patterns',
      description: 'Learn essential fingerpicking patterns and techniques for folk and classical styles',
      difficulty: 'intermediate',
      totalLessons: 12,
      estimatedHours: 22,
      prerequisites: ['basic-chords', 'rhythm-basics'],
    },
    {
      id: 'scales-theory',
      title: 'Scales & Music Theory',
      description: 'Understanding scales, modes, and basic music theory for guitarists',
      difficulty: 'intermediate',
      totalLessons: 15,
      estimatedHours: 28,
      prerequisites: ['basic-chords'],
    }
  ],
  advanced: [
    {
      id: 'advanced-techniques',
      title: 'Advanced Techniques',
      description: 'Master advanced techniques like tapping, sweep picking, and harmonics',
      difficulty: 'advanced',
      totalLessons: 15,
      estimatedHours: 30,
      prerequisites: ['barre-chords', 'scales-theory'],
    },
    {
      id: 'improvisation',
      title: 'Improvisation Mastery',
      description: 'Learn to create expressive solos and improvise over different styles and progressions',
      difficulty: 'advanced',
      totalLessons: 12,
      estimatedHours: 35,
      prerequisites: ['scales-theory'],
    },
    {
      id: 'composition',
      title: 'Songwriting & Composition',
      description: 'Learn to write your own songs and develop your unique style',
      difficulty: 'advanced',
      totalLessons: 10,
      estimatedHours: 32,
      prerequisites: ['scales-theory', 'advanced-techniques'],
    }
  ]
};

// Mock user progress data - in a real app, this would come from a database
const MOCK_USER_PROGRESS: Record<string, UserProgress> = {
  'user-1': {
    userId: 'user-1',
    pathId: 'fundamentals',
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    currentLessonId: 'lesson-4',
    exerciseScores: {
      'exercise-1': 85,
      'exercise-2': 90,
      'exercise-3': 75
    }
  }
};

export const getUserProgress = (pathId: string): number => {
  // In a real application, you would:
  // 1. Get the current user's ID from authentication
  // 2. Fetch their progress from the database
  // 3. Calculate the percentage based on completed lessons
  
  // For demo purposes, we'll use mock data
  const userId = 'user-1'; // This would come from auth
  const userProgress = MOCK_USER_PROGRESS[userId];
  
  if (!userProgress || userProgress.pathId !== pathId) {
    return 0;
  }

  // Find the total lessons for this path
  const path = Object.values(LEARNING_PATHS)
    .flat()
    .find(p => p.id === pathId);

  if (!path) {
    return 0;
  }

  return Math.round((userProgress.completedLessons.length / path.totalLessons) * 100);
};

export const markLessonComplete = async (
  userId: string,
  pathId: string,
  lessonId: string
): Promise<void> => {
  // In a real application, you would:
  // 1. Validate the user has access to this path
  // 2. Verify the lesson exists in the path
  // 3. Update the database with the completed lesson
  // 4. Update any related achievements or progress metrics
  
  console.log(`Marking lesson ${lessonId} complete for user ${userId} in path ${pathId}`);
  
  // This is where you'd make your database call
  // await db.userProgress.update({
  //   where: { userId_pathId: { userId, pathId } },
  //   data: {
  //     completedLessons: { push: lessonId }
  //   }
  // });
};

export const checkPrerequisites = (
  pathId: string,
  userProgress: UserProgress[]
): { completed: boolean; missing: string[] } => {
  const path = Object.values(LEARNING_PATHS)
    .flat()
    .find(p => p.id === pathId);

  if (!path || !path.prerequisites?.length) {
    return { completed: true, missing: [] };
  }

  const missingPrerequisites = path.prerequisites.filter(prereqId => {
    const prereqProgress = userProgress.find(p => p.pathId === prereqId);
    return !prereqProgress || getUserProgress(prereqId) < 100;
  });

  return {
    completed: missingPrerequisites.length === 0,
    missing: missingPrerequisites
  };
};