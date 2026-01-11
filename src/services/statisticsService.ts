// app/services/statisticsService.ts
export type GameSession = {
  date: Date;
  mode: string;
  totalAttempts: number;
  correctAttempts: number;
  timeSpent: number;
  notesPlayed: string[];
}

export class StatisticsManager {
  private storage: Storage | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.storage = window.localStorage;
    }
  }

  updateNoteStats(note: string, correct: boolean, time: number) {
    if (!this.storage) return;

    const stats = this.getStats();
    if (!stats[note]) {
      stats[note] = { attempts: 0, correct: 0, avgTime: 0 };
    }

    stats[note].attempts++;
    if (correct) stats[note].correct++;
    stats[note].avgTime = (stats[note].avgTime * (stats[note].attempts - 1) + time) / stats[note].attempts;

    try {
        this.storage.setItem('fretboard_stats', JSON.stringify(stats));
    } catch (error) {
        console.warn('Failed to save fretboard_stats to localStorage:', error);
    }
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;

    const sessions = this.getSessions();
    sessions.push(session);
    try {
        this.storage.setItem('fretboard_sessions', JSON.stringify(sessions));
    } catch (error) {
        console.warn('Failed to save fretboard_sessions to localStorage:', error);
    }
  }

  private safeParse<T>(key: string, fallback: T, validator?: (data: any) => boolean): T {
      if (!this.storage) return fallback;

      const item = this.storage.getItem(key);
      if (!item) return fallback;

      try {
          const parsed = JSON.parse(item);
          if (validator && !validator(parsed)) {
              console.warn(`Invalid data structure for key "${key}", resetting to default.`);
              // Optional: Clear invalid data to self-heal
              this.storage.removeItem(key);
              return fallback;
          }
          return parsed;
      } catch (error) {
          console.warn(`Failed to parse localStorage key "${key}":`, error);
          // Self-healing: if we can't parse it, it's garbage. remove it so we don't crash next time.
          // Or just return fallback and let the next write overwrite it.
          return fallback;
      }
  }

  private getStats(): Record<string, { attempts: number; correct: number; avgTime: number }> {
    return this.safeParse('fretboard_stats', {}, (data) => typeof data === 'object' && data !== null && !Array.isArray(data));
  }

  private getSessions(): GameSession[] {
    return this.safeParse('fretboard_sessions', [], (data) => Array.isArray(data));
  }
}
