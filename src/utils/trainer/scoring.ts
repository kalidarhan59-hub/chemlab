import { ExamType } from '../../types/trainer';

export interface ScoreGradeResult {
  score: number;
  maxScore: number;
  percentage: number;
  gradeLabel: {
    kk: string;
    ru: string;
    en: string;
  };
  passed: boolean;
}

export function calculateExamGrade(
  exam: ExamType = 'ent',
  score: number,
  maxScore: number = 40
): ScoreGradeResult {
  const safeScore = Math.max(0, Math.min(score, maxScore));
  const percentage = maxScore > 0 ? Math.round((safeScore / maxScore) * 100) : 0;

  // Kazakhstan UNT ҰБТ scale (out of 40 points max)
  let gradeLabel = {
    kk: 'Шекті балл жиналмады (<15)',
    ru: 'Не набран пороговый балл (<15)',
    en: 'Below threshold (<15)',
  };
  let passed = false;

  if (safeScore >= 35) {
    gradeLabel = { kk: 'Үздік нәтиже (Грант деңгейі)', ru: 'Отличный результат (Уровень Гранта)', en: 'Excellent (Grant level)' };
    passed = true;
  } else if (safeScore >= 25) {
    gradeLabel = { kk: 'Жақсы нәтиже', ru: 'Хороший результат', en: 'Good score' };
    passed = true;
  } else if (safeScore >= 15) {
    gradeLabel = { kk: 'Шекті балл жиналды (Шек асылды)', ru: 'Порог пройден', en: 'Threshold passed' };
    passed = true;
  }

  return {
    score: safeScore,
    maxScore,
    percentage,
    gradeLabel,
    passed,
  };
}
