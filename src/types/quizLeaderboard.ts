export interface QuizLeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  total: number;
  percentage: number;
  streak: number;
  xp: number;
  category: 'all' | 'elements' | 'reactions' | 'precipitates';
  timestamp: number;
  date: string;
}

export const QUIZ_LEADERBOARD_STORAGE_KEY = 'chemlab:quiz-leaderboard';

export const DEFAULT_LEADERBOARD: QuizLeaderboardEntry[] = [
  {
    id: 'lead_01',
    userName: 'Алихан Н. (Akbobek School)',
    score: 6,
    total: 6,
    percentage: 100,
    streak: 6,
    xp: 195,
    category: 'all',
    timestamp: Date.now() - 86400000 * 2,
    date: '2026-09-27',
  },
  {
    id: 'lead_02',
    userName: 'Аружан Қ. (NIS)',
    score: 6,
    total: 6,
    percentage: 100,
    streak: 6,
    xp: 180,
    category: 'reactions',
    timestamp: Date.now() - 86400000 * 4,
    date: '2026-09-25',
  },
  {
    id: 'lead_03',
    userName: 'Дмитрий С. (11-сынып)',
    score: 5,
    total: 6,
    percentage: 83,
    streak: 5,
    xp: 145,
    category: 'elements',
    timestamp: Date.now() - 86400000 * 5,
    date: '2026-09-24',
  },
  {
    id: 'lead_04',
    userName: 'Әмина Б. (ChemLab Star)',
    score: 5,
    total: 6,
    percentage: 83,
    streak: 4,
    xp: 130,
    category: 'all',
    timestamp: Date.now() - 86400000 * 7,
    date: '2026-09-22',
  },
  {
    id: 'lead_05',
    userName: 'Ербол Т. (ҰБТ 140)',
    score: 4,
    total: 6,
    percentage: 67,
    streak: 3,
    xp: 95,
    category: 'precipitates',
    timestamp: Date.now() - 86400000 * 9,
    date: '2026-09-20',
  },
];

export function getQuizLeaderboard(): QuizLeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(QUIZ_LEADERBOARD_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUIZ_LEADERBOARD_STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD));
      return DEFAULT_LEADERBOARD;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_LEADERBOARD;
    }
    return parsed.sort((a, b) => b.xp - a.xp || b.percentage - a.percentage || b.score - a.score).slice(0, 5);
  } catch {
    return DEFAULT_LEADERBOARD;
  }
}

export function saveQuizLeaderboard(entries: QuizLeaderboardEntry[]): void {
  try {
    const top5 = entries
      .sort((a, b) => b.xp - a.xp || b.percentage - a.percentage || b.score - a.score)
      .slice(0, 5);
    localStorage.setItem(QUIZ_LEADERBOARD_STORAGE_KEY, JSON.stringify(top5));
    window.dispatchEvent(new Event('local-storage'));
  } catch (err) {
    console.warn('Failed to save quiz leaderboard:', err);
  }
}

export function addQuizLeaderboardScore(entry: Omit<QuizLeaderboardEntry, 'id' | 'timestamp' | 'date'> & { userName?: string }): {
  isTop5: boolean;
  rank: number;
  updatedLeaderboard: QuizLeaderboardEntry[];
} {
  const current = getQuizLeaderboard();
  const dateStr = new Date().toISOString().split('T')[0];
  const newEntry: QuizLeaderboardEntry = {
    id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    userName: entry.userName?.trim() || 'Жас химик / Young Chemist',
    score: entry.score,
    total: entry.total,
    percentage: entry.percentage,
    streak: entry.streak,
    xp: entry.xp,
    category: entry.category,
    timestamp: Date.now(),
    date: dateStr,
  };

  const combined = [...current, newEntry].sort(
    (a, b) => b.xp - a.xp || b.percentage - a.percentage || b.score - a.score
  );
  const rank = combined.findIndex((e) => e.id === newEntry.id) + 1;
  const isTop5 = rank <= 5;
  const top5 = combined.slice(0, 5);

  saveQuizLeaderboard(top5);

  return {
    isTop5,
    rank,
    updatedLeaderboard: top5,
  };
}
