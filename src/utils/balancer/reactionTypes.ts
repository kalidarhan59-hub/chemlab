import { ParsedCompound } from './chemicalFormula';

export type ReactionTypeKey =
  | 'synthesis'
  | 'decomposition'
  | 'singleReplacement'
  | 'doubleReplacement'
  | 'neutralization'
  | 'combustion'
  | 'redox';

export interface ReactionClassification {
  typeKey: ReactionTypeKey;
  isRedox: boolean;
  characteristics: string[];
}

/**
 * Classifies a chemical reaction based on reactants and products.
 */
export function classifyReaction(
  reactants: ParsedCompound[],
  products: ParsedCompound[]
): ReactionClassification {
  const rCount = reactants.length;
  const pCount = products.length;

  // Check if any reactant/product is pure element (only 1 element in formula and charge 0)
  const isPureElement = (c: ParsedCompound) => Object.keys(c.elementCounts).length === 1 && c.charge === 0;

  const hasReactantElement = reactants.some(isPureElement);
  const hasProductElement = products.some(isPureElement);

  // Check for Oxygen combustion: reactant is O2, products include CO2, H2O or oxides
  const hasO2Reactant = reactants.some((r) => r.formula === 'O2' || r.formula === 'O');
  const isCombustion = hasO2Reactant && pCount >= 1 && reactants.length >= 2;

  // Check for Neutralization: Acid (starts with H or has H+anion) + Base (ends with OH) -> Salt + H2O
  const hasWaterProduct = products.some((p) => p.formula === 'H2O');
  const hasBaseReactant = reactants.some((r) => r.formula.includes('OH'));
  const hasAcidReactant = reactants.some((r) => (r.formula.startsWith('H') && r.formula !== 'H2O' && r.formula !== 'H2') || r.formula.includes('COOH'));
  const isNeutralization = hasWaterProduct && hasBaseReactant && hasAcidReactant;

  // Synthesis: 2 or more reactants -> 1 product
  if (rCount >= 2 && pCount === 1) {
    return {
      typeKey: 'synthesis',
      isRedox: hasReactantElement,
      characteristics: ['multiple_to_single'],
    };
  }

  // Decomposition: 1 reactant -> 2 or more products
  if (rCount === 1 && pCount >= 2) {
    return {
      typeKey: 'decomposition',
      isRedox: hasProductElement,
      characteristics: ['single_to_multiple'],
    };
  }

  // Combustion
  if (isCombustion) {
    return {
      typeKey: 'combustion',
      isRedox: true,
      characteristics: ['exothermic_oxygen_reaction'],
    };
  }

  // Neutralization
  if (isNeutralization) {
    return {
      typeKey: 'neutralization',
      isRedox: false,
      characteristics: ['acid_base_salt_water'],
    };
  }

  // Single replacement: A + BC -> B + AC
  if (rCount === 2 && pCount === 2 && (hasReactantElement || hasProductElement)) {
    return {
      typeKey: 'singleReplacement',
      isRedox: true,
      characteristics: ['element_displaces_element'],
    };
  }

  // Double replacement: AB + CD -> AD + CB
  if (rCount >= 2 && pCount >= 2 && !hasReactantElement && !hasProductElement) {
    return {
      typeKey: 'doubleReplacement',
      isRedox: false,
      characteristics: ['ion_exchange'],
    };
  }

  // Default to redox or general
  return {
    typeKey: hasReactantElement || hasProductElement ? 'redox' : 'doubleReplacement',
    isRedox: true,
    characteristics: ['general_chemical_reaction'],
  };
}
