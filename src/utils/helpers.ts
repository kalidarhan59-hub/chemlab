import { Language, LocalizedField, ChemistryFact } from '../types';
import { STORAGE_KEYS, SUPPORTED_LANGUAGES } from './constants';

/**
 * Detect user's language preference
 * 1. Checks localStorage
 * 2. Checks browser navigator.language (kk -> kk, ru -> ru, else en)
 */
export function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
      return saved as Language;
    }

    const browserLang = (navigator.language || (navigator as { userLanguage?: string }).userLanguage || '').toLowerCase();
    if (browserLang.startsWith('kk') || browserLang.startsWith('kz')) {
      return 'kk';
    }
    if (browserLang.startsWith('ru') || browserLang.startsWith('be') || browserLang.startsWith('uk')) {
      return 'ru';
    }
    return 'en';
  } catch {
    return 'en';
  }
}

/**
 * Helper function for multilingual data objects { kk, ru, en }
 */
export function tData<T = string>(obj?: LocalizedField<T> | null, lang: Language = 'kk'): T | string {
  if (!obj) return '';
  return obj[lang] || obj['kk'] || obj['ru'] || obj['en'] || '';
}

/**
 * Calculates day of the year (1 - 366) to rotate daily facts consistently
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Selects stable fact of the day based on current calendar date
 */
export function getTodayFact(facts: ChemistryFact[], date: Date = new Date()): ChemistryFact {
  if (!facts || facts.length === 0) {
    return {
      id: 0,
      formula: 'H₂O',
      category: { kk: 'Химия', ru: 'Химия', en: 'Chemistry' },
      kk: 'Су — жер бетіндегі барлық тіршіліктің бастауы.',
      ru: 'Вода — основа всех биохимических процессов на Земле.',
      en: 'Water is the chemical matrix of all known life.',
    };
  }
  const day = getDayOfYear(date);
  const index = (day - 1) % facts.length;
  return facts[index];
}

/**
 * Simple email validation helper
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
