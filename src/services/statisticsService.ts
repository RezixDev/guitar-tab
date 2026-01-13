// app/services/statisticsService.ts
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
  attempts: z.number(),
  correct: z.number(),
  avgTime: z.number(),
});

const StatsSchema = z.record(z.string(), NoteStatSchema);

const GameSessionSchema = z.object({
  // JSON.parse returns dates as strings. We allow string or Date.
  date: z.string().or(z.date()),
  mode: z.string(),
  totalAttempts: z.number(),
  correctAttempts: z.number(),
  timeSpent: z.number(),
  notesPlayed: z.array(z.string()),
});

const GameSessionArraySchema = z.array(GameSessionSchema);

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

  private getStats(): Record<string, z.infer<typeof NoteStatSchema>> {
    if (!this.storage) return {};
    const statsStr = this.storage.getItem('fretboard_stats');
    if (!statsStr) return {};

    try {
      const parsed = JSON.parse(statsStr);
      const result = StatsSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
      console.error('Invalid stats data in localStorage:', result.error);
      return {};
    } catch (e) {
      console.error('Error parsing stats from localStorage:', e);
      return {};
    }
  }

  private getSessions(): GameSession[] {
    if (!this.storage) return [];
    const sessionsStr = this.storage.getItem('fretboard_sessions');
    if (!sessionsStr) return [];

    try {
      const parsed = JSON.parse(sessionsStr);
      const result = GameSessionArraySchema.safeParse(parsed);

      if (result.success) {
        // We need to cast back to GameSession[] because Zod schema allows date as string
        // but the internal logic might expect it to match the type.
        // Note: JSON.parse never returns Date objects, so at runtime 'date' is string.
        // We keep it as is to match previous runtime behavior.
        return result.data as unknown as GameSession[];
      }
      console.error('Invalid session data in localStorage:', result.error);
      return [];
    } catch (e) {
      console.error('Error parsing sessions from localStorage:', e);
      return [];
    }
  }
}
