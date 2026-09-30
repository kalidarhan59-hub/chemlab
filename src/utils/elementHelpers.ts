import { ChemicalElement, ElementCategory, ElementState, FilterOptions, HeatmapProperty } from '../types/element';
import { Language } from '../types';

export interface CategoryVisual {
  key: ElementCategory;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
  borderLight: string;
  borderDark: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_COLORS: Record<ElementCategory, CategoryVisual> = {
  'alkali-metal': {
    key: 'alkali-metal',
    bgLight: 'bg-red-500/10 hover:bg-red-500/20',
    bgDark: 'dark:bg-red-500/15 dark:hover:bg-red-500/25',
    textLight: 'text-red-700',
    textDark: 'dark:text-red-300',
    borderLight: 'border-red-300',
    borderDark: 'dark:border-red-500/40',
    badgeBg: 'bg-red-500/15 border-red-500/30',
    badgeText: 'text-red-700 dark:text-red-300',
  },
  'alkaline-earth': {
    key: 'alkaline-earth',
    bgLight: 'bg-orange-500/10 hover:bg-orange-500/20',
    bgDark: 'dark:bg-orange-500/15 dark:hover:bg-orange-500/25',
    textLight: 'text-orange-700',
    textDark: 'dark:text-orange-300',
    borderLight: 'border-orange-300',
    borderDark: 'dark:border-orange-500/40',
    badgeBg: 'bg-orange-500/15 border-orange-500/30',
    badgeText: 'text-orange-700 dark:text-orange-300',
  },
  'transition-metal': {
    key: 'transition-metal',
    bgLight: 'bg-amber-500/10 hover:bg-amber-500/20',
    bgDark: 'dark:bg-amber-500/15 dark:hover:bg-amber-500/25',
    textLight: 'text-amber-800',
    textDark: 'dark:text-amber-300',
    borderLight: 'border-amber-300',
    borderDark: 'dark:border-amber-500/40',
    badgeBg: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-800 dark:text-amber-300',
  },
  'post-transition-metal': {
    key: 'post-transition-metal',
    bgLight: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    bgDark: 'dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25',
    textLight: 'text-emerald-700',
    textDark: 'dark:text-emerald-300',
    borderLight: 'border-emerald-300',
    borderDark: 'dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  'metalloid': {
    key: 'metalloid',
    bgLight: 'bg-teal-500/10 hover:bg-teal-500/20',
    bgDark: 'dark:bg-teal-500/15 dark:hover:bg-teal-500/25',
    textLight: 'text-teal-700',
    textDark: 'dark:text-teal-300',
    borderLight: 'border-teal-300',
    borderDark: 'dark:border-teal-500/40',
    badgeBg: 'bg-teal-500/15 border-teal-500/30',
    badgeText: 'text-teal-700 dark:text-teal-300',
  },
  'reactive-nonmetal': {
    key: 'reactive-nonmetal',
    bgLight: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    bgDark: 'dark:bg-cyan-500/15 dark:hover:bg-cyan-500/25',
    textLight: 'text-cyan-700',
    textDark: 'dark:text-cyan-300',
    borderLight: 'border-cyan-300',
    borderDark: 'dark:border-cyan-500/40',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
  },
  'halogen': {
    key: 'halogen',
    bgLight: 'bg-blue-500/10 hover:bg-blue-500/20',
    bgDark: 'dark:bg-blue-500/15 dark:hover:bg-blue-500/25',
    textLight: 'text-blue-700',
    textDark: 'dark:text-blue-300',
    borderLight: 'border-blue-300',
    borderDark: 'dark:border-blue-500/40',
    badgeBg: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  'noble-gas': {
    key: 'noble-gas',
    bgLight: 'bg-purple-500/10 hover:bg-purple-500/20',
    bgDark: 'dark:bg-purple-500/15 dark:hover:bg-purple-500/25',
    textLight: 'text-purple-700',
    textDark: 'dark:text-purple-300',
    borderLight: 'border-purple-300',
    borderDark: 'dark:border-purple-500/40',
    badgeBg: 'bg-purple-500/15 border-purple-500/30',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  'lanthanide': {
    key: 'lanthanide',
    bgLight: 'bg-pink-500/10 hover:bg-pink-500/20',
    bgDark: 'dark:bg-pink-500/15 dark:hover:bg-pink-500/25',
    textLight: 'text-pink-700',
    textDark: 'dark:text-pink-300',
    borderLight: 'border-pink-300',
    borderDark: 'dark:border-pink-500/40',
    badgeBg: 'bg-pink-500/15 border-pink-500/30',
    badgeText: 'text-pink-700 dark:text-pink-300',
  },
  'actinide': {
    key: 'actinide',
    bgLight: 'bg-fuchsia-500/10 hover:bg-fuchsia-500/20',
    bgDark: 'dark:bg-fuchsia-500/15 dark:hover:bg-fuchsia-500/25',
    textLight: 'text-fuchsia-700',
    textDark: 'dark:text-fuchsia-300',
    borderLight: 'border-fuchsia-300',
    borderDark: 'dark:border-fuchsia-500/40',
    badgeBg: 'bg-fuchsia-500/15 border-fuchsia-500/30',
    badgeText: 'text-fuchsia-700 dark:text-fuchsia-300',
  },
  'unknown': {
    key: 'unknown',
    bgLight: 'bg-slate-500/10 hover:bg-slate-500/20',
    bgDark: 'dark:bg-slate-500/15 dark:hover:bg-slate-500/25',
    textLight: 'text-slate-700',
    textDark: 'dark:text-slate-300',
    borderLight: 'border-slate-300',
    borderDark: 'dark:border-slate-500/40',
    badgeBg: 'bg-slate-500/15 border-slate-500/30',
    badgeText: 'text-slate-700 dark:text-slate-300',
  },
};

/**
 * Calculates chemical element physical state given a temperature in Kelvin
 */
export function calculateStateAtTemperature(el: ChemicalElement, tempK: number): ElementState {
  if (el.meltingPoint === null || el.boilingPoint === null) {
    if (el.meltingPoint !== null && tempK < el.meltingPoint) return 'solid';
    return el.state || 'unknown';
  }

  if (tempK < el.meltingPoint) {
    return 'solid';
  }
  if (tempK < el.boilingPoint) {
    return 'liquid';
  }
  return 'gas';
}

/**
 * Normalizes property min/max for heatmap calculations
 */
export const HEATMAP_RANGES: Record<Exclude<HeatmapProperty, 'none'>, { min: number; max: number; unit: string }> = {
  electronegativity: { min: 0.7, max: 4.0, unit: '' },
  atomicMass: { min: 1.0, max: 294.0, unit: 'u' },
  density: { min: 0.08, max: 22.6, unit: 'g/cm³' },
  meltingPoint: { min: 0.95, max: 3700, unit: 'K' },
  boilingPoint: { min: 4.2, max: 6200, unit: 'K' },
};

/**
 * Computes CSS color and ratio (0 to 1) for an element property in Heatmap mode
 */
export function getHeatmapStyle(el: ChemicalElement, property: HeatmapProperty): { bg: string; text: string; ratio: number | null } {
  if (property === 'none') {
    return { bg: '', text: '', ratio: null };
  }

  const rawVal = el[property];
  if (rawVal === null || typeof rawVal !== 'number') {
    return {
      bg: 'rgba(100, 116, 139, 0.15)',
      text: '#94a3b8',
      ratio: null,
    };
  }

  const range = HEATMAP_RANGES[property];
  const clamped = Math.max(range.min, Math.min(range.max, rawVal));
  const ratio = (clamped - range.min) / (range.max - range.min);

  // Gradient: Indigo (low) -> Teal (mid) -> Amber (high) -> Red (extreme)
  const hue = 220 - ratio * 200; // 220 (blue) down to 20 (orange/red)
  const saturation = 85;
  const lightness = 48;

  return {
    bg: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    text: '#ffffff',
    ratio,
  };
}

/**
 * Filters the element list by search string, category, state, block, and discovery year
 */
export function filterElements(
  elements: ChemicalElement[],
  filters: FilterOptions,
  lang: Language = 'kk'
): ChemicalElement[] {
  const query = filters.search.trim().toLowerCase();

  return elements.filter((el) => {
    // 1. Text Search across symbol, atomic number, and all 3 localized names!
    if (query) {
      const matchNum = el.number.toString() === query;
      const matchSymbol = el.symbol.toLowerCase().startsWith(query);
      const matchKk = el.name.kk.toLowerCase().includes(query);
      const matchRu = el.name.ru.toLowerCase().includes(query);
      const matchEn = el.name.en.toLowerCase().includes(query);

      if (!matchNum && !matchSymbol && !matchKk && !matchRu && !matchEn) {
        return false;
      }
    }

    // 2. Category Filter
    if (filters.category !== 'all' && el.category !== filters.category) {
      return false;
    }

    // 3. Dynamic State Filter at the selected temperature
    if (filters.state !== 'all') {
      const currentState = calculateStateAtTemperature(el, filters.temperature);
      if (currentState !== filters.state) {
        return false;
      }
    }

    // 4. Block Filter
    if (filters.block !== 'all' && el.block !== filters.block) {
      return false;
    }

    // 5. Discovery Year Slider Filter
    if (typeof el.discoveryYear === 'number') {
      if (
        el.discoveryYear < filters.discoveryYearRange[0] ||
        el.discoveryYear > filters.discoveryYearRange[1]
      ) {
        return false;
      }
    } else if (el.discoveryYear === 'Ancient') {
      // Ancient elements count as discovery year <= 0
      if (filters.discoveryYearRange[0] > 0) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Returns grid column and row for periodic table cell rendering
 * Returns row: 1-10, col: 1-18
 */
export function getElementGridPosition(el: ChemicalElement): { row: number; col: number } {
  // Lanthanides (57-71) in row 9, cols 4-18
  if (el.number >= 57 && el.number <= 71) {
    return { row: 9, col: el.number - 57 + 4 };
  }
  // Actinides (89-103) in row 10, cols 4-18
  if (el.number >= 89 && el.number <= 103) {
    return { row: 10, col: el.number - 89 + 4 };
  }

  // Standard elements in rows 1 to 7
  return {
    row: el.period,
    col: el.group || 3,
  };
}
