import { TopicId, TopicStat, TrainerStorageSchema } from '../../types/trainer';
import { updateTaskSpacedState } from './spacedRepetition';

export const TRAINER_STORAGE_KEY = 'chemlab:trainer';
const CURRENT_VERSION = 1;

export const INITIAL_TRAINER_SCHEMA: TrainerStorageSchema = {
  version: CURRENT_VERSION,
  tasksState: {},
  examStats: {
    ent: { testsCompleted: 0, bestScore: 0, avgScore: 0 },
  },
  topicStats: {
    atomic_structure: { total: 0, correct: 0 },
    periodic_law: { total: 0, correct: 0 },
    chemical_bond: { total: 0, correct: 0 },
    inorganic_classes: { total: 0, correct: 0 },
    reactions: { total: 0, correct: 0 },
    solutions: { total: 0, correct: 0 },
    redox: { total: 0, correct: 0 },
    metals_nonmetals: { total: 0, correct: 0 },
    organic: { total: 0, correct: 0 },
    calculations: { total: 0, correct: 0 },
  },
  activityHistory: {},
  streak: 0,
  lastDate: null,
  unlockedAchievements: [],
};

export function loadTrainerStats(): TrainerStorageSchema {
  try {
    const raw = localStorage.getItem(TRAINER_STORAGE_KEY);
    if (!raw) return INITIAL_TRAINER_SCHEMA;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return INITIAL_TRAINER_SCHEMA;
    return {
      ...INITIAL_TRAINER_SCHEMA,
      ...parsed,
      topicStats: { ...INITIAL_TRAINER_SCHEMA.topicStats, ...(parsed.topicStats || {}) },
      examStats: { ...INITIAL_TRAINER_SCHEMA.examStats, ...(parsed.examStats || {}) },
    };
  } catch {
    return INITIAL_TRAINER_SCHEMA;
  }
}

export function saveTrainerStats(stats: TrainerStorageSchema): void {
  try {
    localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // quota exceeded or private browsing
  }
}

export function recordTaskResult(
  taskId: string,
  topic: TopicId,
  isCorrect: boolean
): TrainerStorageSchema {
  const current = loadTrainerStats();
  const today = new Date().toISOString().split('T')[0];

  // 1. Update Spaced Repetition state
  const updatedTaskState = updateTaskSpacedState(current.tasksState[taskId], isCorrect);
  current.tasksState[taskId] = updatedTaskState;

  // 2. Update Topic Stats
  const topStat = current.topicStats[topic] || { total: 0, correct: 0 };
  topStat.total += 1;
  if (isCorrect) topStat.correct += 1;
  current.topicStats[topic] = topStat;

  // 3. Update Activity History & Streak
  current.activityHistory[today] = (current.activityHistory[today] || 0) + 1;

  if (current.lastDate !== today) {
    if (current.lastDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (current.lastDate === yesterday) {
        current.streak += 1;
      } else {
        current.streak = 1;
      }
    } else {
      current.streak = 1;
    }
    current.lastDate = today;
  }

  // Check achievements
  const totalSolved = Object.values(current.topicStats).reduce((sum, t) => sum + t.total, 0);
  if (totalSolved >= 10 && !current.unlockedAchievements.includes('first_10')) {
    current.unlockedAchievements.push('first_10');
  }
  if (totalSolved >= 100 && !current.unlockedAchievements.includes('centurion_100')) {
    current.unlockedAchievements.push('centurion_100');
  }

  saveTrainerStats(current);
  return current;
}

export function getWeakestTopics(
  topicStats: Record<TopicId, TopicStat>,
  limit: number = 3
): TopicId[] {
  return (Object.keys(topicStats) as TopicId[])
    .filter((topic) => topicStats[topic].total >= 3)
    .sort((a, b) => {
      const accA = topicStats[a].total > 0 ? topicStats[a].correct / topicStats[a].total : 1;
      const accB = topicStats[b].total > 0 ? topicStats[b].correct / topicStats[b].total : 1;
      return accA - accB;
    })
    .slice(0, limit);
}
