// app/services/statisticsService.ts
export type GameSession = {
  date: Date;
  mode: string;
  totalAttempts: number;
  correctAttempts: number;
  timeSpent: number;
  notesPlayed: string[];
};

export class StatisticsManager {
  private storage: Storage | null = null;

  constructor() {
    if (typeof window !== "undefined") {
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
    stats[note].avgTime =
      (stats[note].avgTime * (stats[note].attempts - 1) + time) /
      stats[note].attempts;

    this.storage.setItem("fretboard_stats", JSON.stringify(stats));
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;

    const sessions = this.getSessions();
    sessions.push(session);
    this.storage.setItem("fretboard_sessions", JSON.stringify(sessions));
  }

  private getStats() {
    if (!this.storage) return {};
    const stats = this.storage.getItem("fretboard_stats");
    if (!stats) return {};
    try {
      return JSON.parse(stats);
    } catch (error) {
      console.warn("Error parsing fretboard_stats:", error);
      return {};
    }
  }

  private getSessions() {
    if (!this.storage) return [];
    const sessions = this.storage.getItem("fretboard_sessions");
    if (!sessions) return [];
    try {
      const parsed = JSON.parse(sessions);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Error parsing fretboard_sessions:", error);
      return [];
    }
  }
}
