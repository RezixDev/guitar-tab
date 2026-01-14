// app/services/statisticsService.ts
import { z } from 'zod';

const NoteStatsSchema = z.object({
  attempts: z.number(),
  correct: z.number(),
  avgTime: z.number(),
});

const StatsSchema = z.record(z.string(), NoteStatsSchema);

const GameSessionSchema = z.object({
  date: z.coerce.date(),
  mode: z.string(),
  totalAttempts: z.number(),
  correctAttempts: z.number(),
  timeSpent: z.number(),
  notesPlayed: z.array(z.string()),
});

export type GameSession = z.infer<typeof GameSessionSchema>;

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
    } catch (e) {
      console.error('Failed to save stats', e);
    }
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;

    const sessions = this.getSessions();
    sessions.push(session);
    try {
      this.storage.setItem('fretboard_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }

  private getStats() {
    if (!this.storage) return {};
    try {
      const stats = this.storage.getItem('fretboard_stats');
      if (!stats) return {};

      const parsed = JSON.parse(stats);
      const result = StatsSchema.safeParse(parsed);

      if (result.success) {
        return result.data;
      } else {
        console.warn('Invalid stats data in localStorage, resetting.', result.error);
        return {};
      }
    } catch (e) {
      console.error('Failed to parse stats from localStorage', e);
      return {};
    }
  }

  private getSessions() {
    if (!this.storage) return [];
    try {
      const sessions = this.storage.getItem('fretboard_sessions');
      if (!sessions) return [];

      const parsed = JSON.parse(sessions);
      const result = z.array(GameSessionSchema).safeParse(parsed);

      if (result.success) {
        return result.data;
      } else {
        console.warn('Invalid sessions data in localStorage, resetting.', result.error);
        return [];
      }
    } catch (e) {
      console.error('Failed to parse sessions from localStorage', e);
      return [];
    }
  }
}
