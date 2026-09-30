import { LocalizedField } from './index';

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export type ElementState = 'solid' | 'liquid' | 'gas' | 'unknown';

export type ElementBlock = 's' | 'p' | 'd' | 'f';

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: LocalizedField<string>;
  atomicMass: number;
  category: ElementCategory;
  group: number | null;
  period: number;
  block: ElementBlock;
  state: ElementState;
  meltingPoint: number | null; // Kelvin
  boilingPoint: number | null; // Kelvin
  density: number | null; // g/cm³ or g/L for gases
  electronegativity: number | null; // Pauling scale
  oxidationStates: string;
  electronConfiguration: string;
  shells: number[];
  discoveredBy: LocalizedField<string>;
  discoveryYear: number | string;
  uses: LocalizedField<string>;
  description: LocalizedField<string>;
}

export type HeatmapProperty =
  | 'none'
  | 'electronegativity'
  | 'atomicMass'
  | 'density'
  | 'meltingPoint'
  | 'boilingPoint';

export type TableViewMode = 'table' | 'list' | 'quiz';

export interface FilterOptions {
  search: string;
  category: ElementCategory | 'all';
  state: ElementState | 'all';
  block: ElementBlock | 'all';
  temperature: number; // in Kelvin (0 to 6000)
  heatmap: HeatmapProperty;
  discoveryYearRange: [number, number]; // e.g. [-5000, 2026]
}

export interface QuizProgress {
  score: number;
  totalAsked: number;
  streak: number;
  bestStreak: number;
  history: { number: number; correct: boolean }[];
}
