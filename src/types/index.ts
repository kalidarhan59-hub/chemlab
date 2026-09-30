export type Language = 'kk' | 'ru' | 'en';

export type Theme = 'light' | 'dark';

export interface LocalizedField<T = string> {
  kk: T;
  ru: T;
  en: T;
}

export interface ChemistryFact {
  id: number;
  formula: string;
  category: LocalizedField<string>;
  kk: string;
  ru: string;
  en: string;
}

export interface UserProgress {
  points: number;
  streak: number;
  lastDate: string | null;
  solvedCount: number;
  level: number;
  unlockedBadges: string[];
}

export type ModuleKey =
  | 'periodicTable'
  | 'balancer'
  | 'lab'
  | 'molecules'
  | 'articles'
  | 'trainer';

export interface ModuleInfo {
  key: ModuleKey;
  path: string;
  iconName: string;
  color: string;
  gradient: string;
  isReady: boolean;
}

export interface ElementCategoryColor {
  name: LocalizedField<string>;
  bg: string;
  text: string;
  border: string;
  glow: string;
}
