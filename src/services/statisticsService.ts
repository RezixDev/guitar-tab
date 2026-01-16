// app/services/statisticsService.ts
import { z } from 'zod';

const NoteStatSchema = z.object({
  attempts: z.number(),
  correct: z.number(),
  avgTime: z.number(),
});

const StatsSchema = z.record(z.string(), NoteStatSchema);

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

    this.storage.setItem('fretboard_stats', JSON.stringify(stats));
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;

    const sessions = this.getSessions();
    sessions.push(session);
    this.storage.setItem('fretboard_sessions', JSON.stringify(sessions));
  }

  private getStats() {
    if (!this.storage) return {};
    try {
      const stats = this.storage.getItem('fretboard_stats');
      if (!stats) return {};

      const parsed = JSON.parse(stats);
      const result = StatsSchema.safeParse(parsed);

      if (!result.success) {
        console.error('Failed to parse stats:', result.error);
        return {};
      }

      return result.data;
    } catch (error) {
      console.error('Error reading stats from storage:', error);
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

      if (!result.success) {
        console.error('Failed to parse sessions:', result.error);
        return [];
      }

      return result.data;
    } catch (error) {
      console.error('Error reading sessions from storage:', error);
      return [];
    }
  }
}
