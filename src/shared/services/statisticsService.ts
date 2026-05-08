import type { GameSession } from "@shared/types/fretboard";

type NoteStat = { attempts: number; correct: number; avgTime: number };
type StatsMap = Record<string, NoteStat>;

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
    const entry = stats[note] ?? { attempts: 0, correct: 0, avgTime: 0 };
    entry.attempts += 1;
    if (correct) entry.correct += 1;
    entry.avgTime =
      (entry.avgTime * (entry.attempts - 1) + time) / entry.attempts;
    stats[note] = entry;
    this.storage.setItem("fretboard_stats", JSON.stringify(stats));
  }

  saveSession(session: GameSession) {
    if (!this.storage) return;
    const sessions = this.getSessions();
    sessions.push(session);
    this.storage.setItem("fretboard_sessions", JSON.stringify(sessions));
  }

  private getStats(): StatsMap {
    if (!this.storage) return {};
    const raw = this.storage.getItem("fretboard_stats");
    return raw ? (JSON.parse(raw) as StatsMap) : {};
  }

  private getSessions(): GameSession[] {
    if (!this.storage) return [];
    const raw = this.storage.getItem("fretboard_sessions");
    return raw ? (JSON.parse(raw) as GameSession[]) : [];
  }
}
