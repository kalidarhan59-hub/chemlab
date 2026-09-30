import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProgress } from '../types';
import { STORAGE_KEYS, DEFAULT_USER_PROGRESS } from '../utils/constants';

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgress>(
    STORAGE_KEYS.TRAINER,
    DEFAULT_USER_PROGRESS
  );

  const addPoints = useCallback(
    (pointsToAdd: number) => {
      setProgress((prev) => {
        const newPoints = (prev.points || 0) + pointsToAdd;
        const newLevel = Math.floor(newPoints / 100) + 1;
        return {
          ...prev,
          points: newPoints,
          level: newLevel,
        };
      });
    },
    [setProgress]
  );

  const recordSolvedTask = useCallback(
    (pointsEarned: number = 10) => {
      const todayStr = new Date().toISOString().slice(0, 10);
      setProgress((prev) => {
        let newStreak = prev.streak || 0;
        if (prev.lastDate) {
          const last = new Date(prev.lastDate);
          const now = new Date(todayStr);
          const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        const newPoints = (prev.points || 0) + pointsEarned;
        const newSolvedCount = (prev.solvedCount || 0) + 1;
        const newLevel = Math.floor(newPoints / 100) + 1;

        return {
          ...prev,
          points: newPoints,
          solvedCount: newSolvedCount,
          streak: newStreak,
          lastDate: todayStr,
          level: newLevel,
        };
      });
    },
    [setProgress]
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_USER_PROGRESS);
  }, [setProgress]);

  return {
    progress,
    addPoints,
    recordSolvedTask,
    resetProgress,
  };
}
