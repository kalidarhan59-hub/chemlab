import { ParsedCompound } from './chemicalFormula';

export type AmountUnit = 'g' | 'kg' | 'mg' | 'mol' | 'mmol' | 'L_stp' | 'mL_stp';

export interface ReactantInput {
  index: number;
  value: number;
  unit: AmountUnit;
}

export interface ProductTheoreticalResult {
  compound: ParsedCompound;
  coefficient: number;
  moles: number;
  massGrams: number;
  volumeLitersStp?: number;
}

export interface ExcessReactantResult {
  compound: ParsedCompound;
  initialMoles: number;
  usedMoles: number;
  remainingMoles: number;
  remainingMassGrams: number;
}

export interface StoichiometryResult {
  limitingIndex: number;
  limitingCompound: ParsedCompound;
  maxReactionMoles: number; // min(n_i / coeff_i)
  excessReactants: ExcessReactantResult[];
  products: ProductTheoreticalResult[];
}

const STP_MOLAR_VOLUME = 22.414; // L/mol at STP (0°C, 101.325 kPa)

/**
 * Converts any chemical amount value with unit into standard moles.
 */
export function convertToMoles(value: number, unit: AmountUnit, molarMass: number): number {
  if (value <= 0 || isNaN(value)) return 0;

  switch (unit) {
    case 'mol':
      return value;
    case 'mmol':
      return value / 1000;
    case 'g':
      return molarMass > 0 ? value / molarMass : 0;
    case 'kg':
      return molarMass > 0 ? (value * 1000) / molarMass : 0;
    case 'mg':
      return molarMass > 0 ? value / (1000 * molarMass) : 0;
    case 'L_stp':
      return value / STP_MOLAR_VOLUME;
    case 'mL_stp':
      return value / (1000 * STP_MOLAR_VOLUME);
    default:
      return 0;
  }
}

/**
 * Converts standard moles into a specified unit.
 */
export function convertFromMoles(moles: number, unit: AmountUnit, molarMass: number): number {
  if (moles <= 0 || isNaN(moles)) return 0;

  switch (unit) {
    case 'mol':
      return moles;
    case 'mmol':
      return moles * 1000;
    case 'g':
      return moles * molarMass;
    case 'kg':
      return (moles * molarMass) / 1000;
    case 'mg':
      return moles * molarMass * 1000;
    case 'L_stp':
      return moles * STP_MOLAR_VOLUME;
    case 'mL_stp':
      return moles * STP_MOLAR_VOLUME * 1000;
    default:
      return 0;
  }
}

/**
 * Performs stoichiometric analysis:
 * - Detects limiting and excess reagents
 * - Computes remaining excess reagents
 * - Computes theoretical yields for all products
 */
export function calculateStoichiometry(
  reactants: ParsedCompound[],
  reactantCoeffs: number[],
  products: ParsedCompound[],
  productCoeffs: number[],
  inputs: ReactantInput[]
): StoichiometryResult | null {
  const validInputs = inputs.filter((inp) => inp.value > 0);
  if (validInputs.length === 0) return null;

  // Convert each entered reactant amount to moles and compute (moles / coeff)
  const reactantMolesMap = new Map<number, number>();
  let minRatio = Infinity;
  let limitingIndex = -1;

  validInputs.forEach((inp) => {
    const comp = reactants[inp.index];
    const coeff = reactantCoeffs[inp.index];
    if (!comp || !coeff) return;

    const moles = convertToMoles(inp.value, inp.unit, comp.molarMass);
    reactantMolesMap.set(inp.index, moles);

    const ratio = moles / coeff;
    if (ratio < minRatio) {
      minRatio = ratio;
      limitingIndex = inp.index;
    }
  });

  if (limitingIndex === -1 || minRatio === Infinity || minRatio <= 0) return null;

  const maxReactionMoles = minRatio;

  // Calculate excess for other reactants
  const excessReactants: ExcessReactantResult[] = [];
  reactants.forEach((comp, idx) => {
    if (idx === limitingIndex) return;

    const coeff = reactantCoeffs[idx];
    const initialMoles = reactantMolesMap.get(idx);

    if (initialMoles !== undefined) {
      const usedMoles = maxReactionMoles * coeff;
      const remainingMoles = Math.max(0, initialMoles - usedMoles);
      const remainingMassGrams = remainingMoles * comp.molarMass;

      excessReactants.push({
        compound: comp,
        initialMoles,
        usedMoles,
        remainingMoles,
        remainingMassGrams,
      });
    }
  });

  // Calculate theoretical yields for each product
  const productResults: ProductTheoreticalResult[] = products.map((comp, idx) => {
    const coeff = productCoeffs[idx];
    const prodMoles = maxReactionMoles * coeff;
    const prodMass = prodMoles * comp.molarMass;

    // Check if compound is typically gas at STP
    const isGas =
      ['H2', 'O2', 'N2', 'Cl2', 'F2', 'CO2', 'CO', 'CH4', 'NH3', 'NO', 'NO2', 'SO2', 'HCl', 'H2S'].includes(
        comp.formula
      );

    return {
      compound: comp,
      coefficient: coeff,
      moles: prodMoles,
      massGrams: prodMass,
      volumeLitersStp: isGas ? prodMoles * STP_MOLAR_VOLUME : undefined,
    };
  });

  return {
    limitingIndex,
    limitingCompound: reactants[limitingIndex],
    maxReactionMoles,
    excessReactants,
    products: productResults,
  };
}

/**
 * Calculates reaction yield percentage (шығым / практический выход):
 * Yield (%) = (Actual Mass / Theoretical Mass) * 100
 */
export function calculateYieldPercentage(actualMass: number, theoreticalMass: number): number {
  if (theoreticalMass <= 0 || actualMass <= 0) return 0;
  const percentage = (actualMass / theoreticalMass) * 100;
  return Number(percentage.toFixed(2));
}

/**
 * Solutions calculations: Mass Fraction (ω), Molarity (C_M), and Dilution
 */
export function calculateMassFraction(soluteMass: number, solutionMass: number): number {
  if (solutionMass <= 0 || soluteMass < 0) return 0;
  return Number(((soluteMass / solutionMass) * 100).toFixed(2));
}

export function calculateMolarity(soluteMass: number, molarMass: number, volumeLiters: number): number {
  if (volumeLiters <= 0 || molarMass <= 0 || soluteMass <= 0) return 0;
  const moles = soluteMass / molarMass;
  return Number((moles / volumeLiters).toFixed(4));
}

export function calculateDilution(c1: number, v1: number, c2?: number, v2?: number): { c2?: number; v2?: number } {
  // If v2 is missing: v2 = (c1 * v1) / c2
  if (c2 && c2 > 0) {
    const calcV2 = (c1 * v1) / c2;
    return { v2: Number(calcV2.toFixed(3)) };
  }
  // If c2 is missing: c2 = (c1 * v1) / v2
  if (v2 && v2 > 0) {
    const calcC2 = (c1 * v1) / v2;
    return { c2: Number(calcC2.toFixed(4)) };
  }
  return {};
}

/**
 * Ideal Gas Law: P * V = n * R * T
 * Units:
 * P: kPa (1 atm = 101.325 kPa)
 * V: Liters (L)
 * n: moles
 * T: Kelvin (K) (T_K = T_C + 273.15)
 * R = 8.314 J/(mol*K) = 8.314 kPa*L/(mol*K)
 */
const R_KPA_L = 8.31446;

export function solveIdealGas(
  p_kpa?: number,
  v_liters?: number,
  n_moles?: number,
  t_kelvin?: number
): { p?: number; v?: number; n?: number; t?: number } {
  if (t_kelvin !== undefined && t_kelvin <= 0) return {};

  // Solve for V = (n * R * T) / P
  if (v_liters === undefined && p_kpa && n_moles && t_kelvin) {
    return { v: Number(((n_moles * R_KPA_L * t_kelvin) / p_kpa).toFixed(3)) };
  }

  // Solve for P = (n * R * T) / V
  if (p_kpa === undefined && v_liters && n_moles && t_kelvin) {
    return { p: Number(((n_moles * R_KPA_L * t_kelvin) / v_liters).toFixed(3)) };
  }

  // Solve for n = (P * V) / (R * T)
  if (n_moles === undefined && p_kpa && v_liters && t_kelvin) {
    return { n: Number(((p_kpa * v_liters) / (R_KPA_L * t_kelvin)).toFixed(4)) };
  }

  // Solve for T = (P * V) / (n * R)
  if (t_kelvin === undefined && p_kpa && v_liters && n_moles) {
    return { t: Number(((p_kpa * v_liters) / (n_moles * R_KPA_L)).toFixed(2)) };
  }

  return {};
}
