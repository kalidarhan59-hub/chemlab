import { LocalizedField } from './index';

export type ExamType = 'ent';

export type TopicId =
  | 'atomic_structure'
  | 'periodic_law'
  | 'chemical_bond'
  | 'inorganic_classes'
  | 'reactions'
  | 'solutions'
  | 'redox'
  | 'metals_nonmetals'
  | 'organic'
  | 'calculations';

export type TaskType =
  | 'single_choice'
  | 'multi_choice'
  | 'matching'
  | 'numeric_input'
  | 'formula_input';

export interface MatchingPair {
  id: string;
  left: LocalizedField<string>;
  right: LocalizedField<string>;
}

export interface TrainerTask {
  id: string;
  exams: ExamType[];
  topic: TopicId;
  difficulty: 'easy' | 'medium' | 'hard';
  type: TaskType;
  condition: LocalizedField<string>;
  options?: LocalizedField<string[]>;
  matchingPairs?: MatchingPair[];
  correctAnswer: any; // number | number[] | Record<string, string> | string
  tolerance?: number;
  unit?: LocalizedField<string>;
  hint: LocalizedField<string>;
  solutionSteps: LocalizedField<string[]>;
  relatedSection?: string;
}

export interface SpacedItemState {
  level: number; // 0 to 5 (Leitner boxes)
  nextReviewDate: number; // timestamp
  lastAnsweredDate: number;
  correctCount: number;
  errorCount: number;
}

export interface TopicStat {
  total: number;
  correct: number;
}

export interface ExamStat {
  testsCompleted: number;
  bestScore: number;
  avgScore: number;
}

export interface TrainerStorageSchema {
  version: number;
  tasksState: Record<string, SpacedItemState>;
  examStats: Record<ExamType, ExamStat>;
  topicStats: Record<TopicId, TopicStat>;
  activityHistory: Record<string, number>; // "YYYY-MM-DD" -> count
  streak: number;
  lastDate: string | null;
  unlockedAchievements: string[];
}
