import { Language, ModuleInfo, ElementCategoryColor, UserProgress } from '../types';

export const STORAGE_KEYS = {
  LANGUAGE: 'chemlab:language',
  THEME: 'chemlab:theme',
  TRAINER: 'chemlab:trainer',
  FAVORITES: 'chemlab:favorites',
  NOTIFICATIONS: 'chemlab:notifications',
} as const;

export const SUPPORTED_LANGUAGES: Language[] = ['kk', 'ru', 'en'];

export const DEFAULT_USER_PROGRESS: UserProgress = {
  points: 0,
  streak: 0,
  lastDate: null,
  solvedCount: 0,
  level: 1,
  unlockedBadges: [],
};

export const MODULES_CONFIG: ModuleInfo[] = [
  {
    key: 'periodicTable',
    path: 'periodic-table',
    iconName: 'Table2',
    color: '#0D9488',
    gradient: 'from-teal-500 to-emerald-500',
    isReady: false,
  },
  {
    key: 'balancer',
    path: 'balancer',
    iconName: 'Scale',
    color: '#7C3AED',
    gradient: 'from-purple-500 to-indigo-600',
    isReady: false,
  },
  {
    key: 'lab',
    path: 'lab',
    iconName: 'FlaskConical',
    color: '#2563EB',
    gradient: 'from-blue-500 to-cyan-500',
    isReady: false,
  },
  {
    key: 'molecules',
    path: 'molecules',
    iconName: 'Atom',
    color: '#EA580C',
    gradient: 'from-amber-500 to-orange-600',
    isReady: false,
  },
  {
    key: 'articles',
    path: 'articles',
    iconName: 'BookOpen',
    color: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    isReady: false,
  },
  {
    key: 'trainer',
    path: 'trainer',
    iconName: 'Trophy',
    color: '#DC2626',
    gradient: 'from-rose-500 to-purple-600',
    isReady: false,
  },
];

/**
 * Standard colors for chemical element categories with high contrast & colorblind support
 */
export const ELEMENT_CATEGORIES: Record<string, ElementCategoryColor> = {
  alkaliMetals: {
    name: { kk: 'Сілтілік металдар', ru: 'Щелочные металлы', en: 'Alkali metals' },
    bg: 'rgba(239, 68, 68, 0.15)',
    text: '#EF4444',
    border: 'rgba(239, 68, 68, 0.4)',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
  alkalineEarth: {
    name: { kk: 'Сілтілік-жер металдар', ru: 'Щёлочноземельные', en: 'Alkaline earth metals' },
    bg: 'rgba(249, 115, 22, 0.15)',
    text: '#F97316',
    border: 'rgba(249, 115, 22, 0.4)',
    glow: 'rgba(249, 115, 22, 0.3)',
  },
  transitionMetals: {
    name: { kk: 'Ауыспалы металдар', ru: 'Переходные металлы', en: 'Transition metals' },
    bg: 'rgba(234, 179, 8, 0.15)',
    text: '#EAB308',
    border: 'rgba(234, 179, 8, 0.4)',
    glow: 'rgba(234, 179, 8, 0.3)',
  },
  postTransition: {
    name: { kk: 'Ауысудан кейінгі металдар', ru: 'Постпереходные металлы', en: 'Post-transition metals' },
    bg: 'rgba(16, 185, 129, 0.15)',
    text: '#10B981',
    border: 'rgba(16, 185, 129, 0.4)',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  metalloids: {
    name: { kk: 'Жартылай металдар', ru: 'Полуметаллы', en: 'Metalloids' },
    bg: 'rgba(6, 182, 212, 0.15)',
    text: '#06B6D4',
    border: 'rgba(6, 182, 212, 0.4)',
    glow: 'rgba(6, 182, 212, 0.3)',
  },
  reactiveNonmetals: {
    name: { kk: 'Белсенді бейметалдар', ru: 'Реактивные неметаллы', en: 'Reactive non-metals' },
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#3B82F6',
    border: 'rgba(59, 130, 246, 0.4)',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  nobleGases: {
    name: { kk: 'Асыл газдар', ru: 'Благородные газы', en: 'Noble gases' },
    bg: 'rgba(139, 92, 246, 0.15)',
    text: '#8B5CF6',
    border: 'rgba(139, 92, 246, 0.4)',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  lanthanides: {
    name: { kk: 'Лантаноидтар', ru: 'Лантаноиды', en: 'Lanthanides' },
    bg: 'rgba(236, 72, 153, 0.15)',
    text: '#EC4899',
    border: 'rgba(236, 72, 153, 0.4)',
    glow: 'rgba(236, 72, 153, 0.3)',
  },
  actinides: {
    name: { kk: 'Актиноидтар', ru: 'Актиноиды', en: 'Actinides' },
    bg: 'rgba(217, 70, 239, 0.15)',
    text: '#D946EF',
    border: 'rgba(217, 70, 239, 0.4)',
    glow: 'rgba(217, 70, 239, 0.3)',
  },
};
