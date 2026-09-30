import { describe, it, expect } from 'vitest';
import { calculateStateAtTemperature, filterElements, getHeatmapStyle } from '../elementHelpers';
import { ChemicalElement, FilterOptions } from '../../types/element';

const mockHydrogen: ChemicalElement = {
  number: 1,
  symbol: 'H',
  name: { kk: 'Сутек', ru: 'Водород', en: 'Hydrogen' },
  atomicMass: 1.008,
  category: 'reactive-nonmetal',
  group: 1,
  period: 1,
  block: 's',
  state: 'gas',
  meltingPoint: 14.01,
  boilingPoint: 20.28,
  density: 0.08988,
  electronegativity: 2.2,
  oxidationStates: '-1, +1',
  electronConfiguration: '1s¹',
  shells: [1],
  discoveredBy: { kk: 'Кавендиш', ru: 'Кавендиш', en: 'Cavendish' },
  discoveryYear: 1766,
  uses: { kk: 'Отын', ru: 'Топливо', en: 'Fuel' },
  description: { kk: 'Сипаттама', ru: 'Описание', en: 'Desc' },
};

const mockGallium: ChemicalElement = {
  number: 31,
  symbol: 'Ga',
  name: { kk: 'Галлий', ru: 'Галлий', en: 'Gallium' },
  atomicMass: 69.723,
  category: 'post-transition-metal',
  group: 13,
  period: 4,
  block: 'p',
  state: 'solid',
  meltingPoint: 302.91, // 29.76 °C
  boilingPoint: 2477,
  density: 5.91,
  electronegativity: 1.81,
  oxidationStates: '+3',
  electronConfiguration: '[Ar] 3d¹⁰ 4s² 4p¹',
  shells: [2, 8, 18, 3],
  discoveredBy: { kk: 'Буабодран', ru: 'Буабодран', en: 'Boisbaudran' },
  discoveryYear: 1875,
  uses: { kk: 'Жартылай өткізгіш', ru: 'Полупроводники', en: 'Semiconductors' },
  description: { kk: 'Сипаттама', ru: 'Описание', en: 'Desc' },
};

const mockOganesson: ChemicalElement = {
  number: 118,
  symbol: 'Og',
  name: { kk: 'Оганесон', ru: 'Оганесон', en: 'Oganesson' },
  atomicMass: 294,
  category: 'noble-gas',
  group: 18,
  period: 7,
  block: 'p',
  state: 'solid',
  meltingPoint: 325,
  boilingPoint: 350,
  density: 5.0,
  electronegativity: null,
  oxidationStates: '0',
  electronConfiguration: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',
  shells: [2, 8, 18, 32, 32, 18, 8],
  discoveredBy: { kk: 'Оганесян', ru: 'Оганесян', en: 'Oganessian' },
  discoveryYear: 2002,
  uses: { kk: 'Зерттеу', ru: 'Исследования', en: 'Research' },
  description: { kk: 'Сипаттама', ru: 'Описание', en: 'Desc' },
};

describe('calculateStateAtTemperature', () => {
  it('correctly calculates Gallium phase changes', () => {
    // Below 302.91 K -> solid
    expect(calculateStateAtTemperature(mockGallium, 280)).toBe('solid');
    // In human hand ~ 310 K -> liquid
    expect(calculateStateAtTemperature(mockGallium, 310)).toBe('liquid');
    // Above 2477 K -> gas
    expect(calculateStateAtTemperature(mockGallium, 2600)).toBe('gas');
  });

  it('correctly calculates Hydrogen phase changes', () => {
    expect(calculateStateAtTemperature(mockHydrogen, 10)).toBe('solid');
    expect(calculateStateAtTemperature(mockHydrogen, 16)).toBe('liquid');
    expect(calculateStateAtTemperature(mockHydrogen, 298.15)).toBe('gas');
  });
});

describe('filterElements', () => {
  const elements = [mockHydrogen, mockGallium, mockOganesson];

  const defaultFilters: FilterOptions = {
    search: '',
    category: 'all',
    state: 'all',
    block: 'all',
    temperature: 298.15,
    heatmap: 'none',
    discoveryYearRange: [-5000, 2026],
  };

  it('searches simultaneously across Kazakh, Russian, and English names and symbol', () => {
    // Kazakh search "Сутек"
    let result = filterElements(elements, { ...defaultFilters, search: 'Сутек' });
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('H');

    // Russian search "Галлий"
    result = filterElements(elements, { ...defaultFilters, search: 'Галлий' });
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('Ga');

    // English search "Hydrogen"
    result = filterElements(elements, { ...defaultFilters, search: 'Hydrogen' });
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('H');

    // Symbol / substring search "Ga" matches Gallium ("Ga") and Oganesson ("oGAnesson")
    result = filterElements(elements, { ...defaultFilters, search: 'Ga' });
    expect(result.some((e) => e.symbol === 'Ga')).toBe(true);

    // Atomic number search "118"
    result = filterElements(elements, { ...defaultFilters, search: '118' });
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('Og');
  });

  it('filters by category', () => {
    const result = filterElements(elements, { ...defaultFilters, category: 'noble-gas' });
    expect(result).toHaveLength(1);
    expect(result[0].symbol).toBe('Og');
  });

  it('filters by dynamic temperature state', () => {
    // At 298.15 K, Hydrogen is gas, Gallium is solid, Oganesson is solid
    const gases = filterElements(elements, { ...defaultFilters, state: 'gas', temperature: 298.15 });
    expect(gases).toHaveLength(1);
    expect(gases[0].symbol).toBe('H');
  });
});

describe('getHeatmapStyle', () => {
  it('handles null values gracefully', () => {
    const style = getHeatmapStyle(mockOganesson, 'electronegativity');
    expect(style.ratio).toBeNull();
    expect(style.text).toBe('#94a3b8');
  });

  it('computes valid ratio and hsl color for numeric property', () => {
    const style = getHeatmapStyle(mockHydrogen, 'electronegativity');
    expect(style.ratio).toBeGreaterThan(0);
    expect(style.bg).toContain('hsl(');
  });
});
