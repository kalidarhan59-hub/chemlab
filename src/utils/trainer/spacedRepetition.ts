import { SpacedItemState, TrainerTask } from '../../types/trainer';

const DAY_MS = 24 * 60 * 60 * 1000;

// Review intervals in days based on Leitner mastery level (0 to 5)
export const INTERVALS_DAYS: Record<number, number> = {
  0: 0, // Immediately / 1 hour
  1: 1, // 1 day
  2: 3, // 3 days
  3: 7, // 7 days
  4: 14, // 14 days
  5: 30, // 30 days
};

/**
 * Calculates updated spaced repetition state when an answer is submitted.
 */
export function updateTaskSpacedState(
  currentState: SpacedItemState | undefined,
  isCorrect: boolean,
  now: number = Date.now()
): SpacedItemState {
  const current = currentState || {
    level: 0,
    nextReviewDate: now,
    lastAnsweredDate: now,
    correctCount: 0,
    errorCount: 0,
  };

  if (isCorrect) {
    const nextLevel = Math.min(5, current.level + 1);
    const intervalDays = INTERVALS_DAYS[nextLevel] || 30;
    return {
      level: nextLevel,
      nextReviewDate: now + intervalDays * DAY_MS,
      lastAnsweredDate: now,
      correctCount: current.correctCount + 1,
      errorCount: current.errorCount,
    };
  } else {
    // Drop back to Level 0 or 1 on error
    return {
      level: 0,
      nextReviewDate: now + 4 * 60 * 60 * 1000, // 4 hours later
      lastAnsweredDate: now,
      correctCount: current.correctCount,
      errorCount: current.errorCount + 1,
    };
  }
}

/**
 * Filters tasks due for review (where nextReviewDate <= now, or unstudied).
 */
export function getTasksDueForReview(
  allTasks: TrainerTask[],
  tasksState: Record<string, SpacedItemState>,
  now: number = Date.now(),
  limit: number = 5
): TrainerTask[] {
  // Sort tasks by priority:
  // 1. Due tasks with high error count first
  // 2. Unstudied tasks
  // 3. Due tasks
  const due = allTasks.filter((task) => {
    const state = tasksState[task.id];
    if (!state) return true; // never studied -> ready for review
    return state.nextReviewDate <= now;
  });

  due.sort((a, b) => {
    const stateA = tasksState[a.id];
    const stateB = tasksState[b.id];
    const errA = stateA ? stateA.errorCount : 0;
    const errB = stateB ? stateB.errorCount : 0;
    return errB - errA;
  });

  return due.slice(0, limit);
}
