import { z } from 'zod';

export type GameSession = {
  date: Date;
  mode: string;
  totalAttempts: number;
  correctAttempts: number;
  timeSpent: number;
  notesPlayed: string[];
}

const NoteStatSchema = z.object({
  attempts: z.number().default(0),
  correct: z.number().default(0),
  avgTime: z.number().default(0),
});

const StatsSchema = z.record(z.string(), NoteStatSchema);

const GameSessionSchema = z.object({
  date: z.coerce.date(),
  mode: z.string().default('unknown'),
  totalAttempts: z.number().default(0),
  correctAttempts: z.number().default(0),
  timeSpent: z.number().default(0),
  notesPlayed: z.array(z.string()).default([]),
});

const SessionsSchema = z.array(GameSessionSchema);

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

    this.storage.setItem('fretboard_stats', JSON.stringify(stats));
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;

    const sessions = this.getSessions();
    sessions.push(session);
    this.storage.setItem('fretboard_sessions', JSON.stringify(sessions));
  }

  private getStats(): z.infer<typeof StatsSchema> {
    if (!this.storage) return {};
    try {
      const stats = this.storage.getItem('fretboard_stats');
      if (!stats) return {};
      // Use safeParse to handle potential schema mismatches without throwing
      const result = StatsSchema.safeParse(JSON.parse(stats));
      if (!result.success) {
        console.warn('Invalid stats data found, resetting or partial load:', result.error);
        return {};
      }
      return result.data;
    } catch (error) {
      console.error('Error loading stats:', error);
      return {};
    }
  }

  private getSessions(): z.infer<typeof SessionsSchema> {
    if (!this.storage) return [];
    try {
      const sessions = this.storage.getItem('fretboard_sessions');
      if (!sessions) return [];
      const result = SessionsSchema.safeParse(JSON.parse(sessions));
      if (!result.success) {
        console.warn('Invalid sessions data found:', result.error);
        return [];
      }
      return result.data;
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }
}
