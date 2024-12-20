// lib/learn/helpers.ts

export const getModule = (moduleId: string, pathId: string): Module | undefined => {
    const path = [BEGINNER_PATH, INTERMEDIATE_PATH, ADVANCED_PATH]
      .find(p => p.id === pathId);
    return path?.modules.find(m => m.id === moduleId);
  };
  
  export const getLesson = (lessonId: string, moduleId: string): Lesson | undefined => {
    const module = Object.values(LEARNING_PATHS)
      .flatMap(path => path.modules)
      .find(m => m.id === moduleId);
    return module?.lessons.find(lesson => lesson.id === lessonId);
  };
  
  export const isLessonAccessible = (
    lessonId: string,
    moduleId: string,
    completedLessons: string[]
  ): boolean => {
    const lesson = getLesson(lessonId, moduleId);
    if (!lesson) return false;
    
    if (!lesson.prerequisites?.length) return true;
    
    return lesson.prerequisites.every(preReqId => 
      completedLessons.includes(preReqId)
    );
  };