import reagentsData from '../../data/reagents.json';
import reactionsData from '../../data/labReactions.json';
import solubilityData from '../../data/solubility.json';
import activitySeriesData from '../../data/activitySeries.json';

export interface LocalizedString {
  kk: string;
  ru: string;
  en: string;
}

export interface Reagent {
  id: string;
  formula: string;
  name: LocalizedString;
  color: string;
  state: 'liquid' | 'solid';
  type: 'acid' | 'base' | 'salt' | 'metal' | 'indicator' | 'water';
  pH: number;
  ions: {
    cations: string[];
    anions: string[];
  };
  hazard: {
    level: 'safe' | 'warning' | 'danger';
    icon: string;
    text: LocalizedString;
  };
  description: LocalizedString;
}

export interface PrecipitateInfo {
  formula: string;
  color: string;
  hex: string;
  name: LocalizedString;
}

export interface GasInfo {
  formula: string;
  intensity: 'low' | 'high' | 'violent';
  name: LocalizedString;
}

export interface LabReaction {
  id: string;
  reactants: string[];
  products: string[];
  type: 'exchange' | 'displacement' | 'decomposition' | 'neutralization' | 'redox' | 'complex' | 'indicator';
  requiresHeating?: boolean;
  effects: {
    solutionColorFrom: string;
    solutionColorTo: string;
    precipitate: PrecipitateInfo | null;
    gas: GasInfo | null;
    temperature: 'exothermic' | 'endothermic' | 'neutral';
  };
  equations: {
    molecular: string;
    fullIonic: string;
    netIonic: string;
  };
  explanation: LocalizedString;
  practicalFact: LocalizedString;
}

export interface AddedReagentEntry {
  reagentId: string;
  amountMl: number;
  timestamp: number;
}

export interface VesselState {
  id: string;
  type: 'test_tube' | 'flask' | 'beaker';
  name: LocalizedString;
  reagentsAdded: AddedReagentEntry[];
  currentSubstances: string[];
  volumeMl: number;
  liquidColor: string;
  precipitate: PrecipitateInfo | null;
  gas: GasInfo | null;
  temperatureC: number;
  isHeating: boolean;
  lastReaction: LabReaction | null;
  impossibleNotice: LocalizedString | null;
  pH: number;
}

export const REAGENTS_MAP: Record<string, Reagent> = (reagentsData as Reagent[]).reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {} as Record<string, Reagent>);

export const REACTIONS_LIST: LabReaction[] = reactionsData as LabReaction[];

/**
 * Creates an empty initial state for a laboratory vessel.
 */
export function createEmptyVessel(id: string, type: 'test_tube' | 'flask' | 'beaker', name: LocalizedString): VesselState {
  return {
    id,
    type,
    name,
    reagentsAdded: [],
    currentSubstances: [],
    volumeMl: 0,
    liquidColor: 'transparent',
    precipitate: null,
    gas: null,
    temperatureC: 22,
    isHeating: false,
    lastReaction: null,
    impossibleNotice: null,
    pH: 7.0,
  };
}

/**
 * Evaluates the full chemical state of a vessel after adding a reagent or heating.
 * Handles sequential multi-substance mixtures, precipitation, gas, indicators, and impossible reactions.
 */
export function processVesselState(
  vessel: VesselState,
  newReagentId?: string,
  newAmountMl = 5,
  toggleHeating?: boolean
): VesselState {
  // Clone state
  const updated: VesselState = {
    ...vessel,
    reagentsAdded: [...vessel.reagentsAdded],
    currentSubstances: [...vessel.currentSubstances],
    isHeating: toggleHeating !== undefined ? toggleHeating : vessel.isHeating,
    impossibleNotice: null,
  };

  // Add reagent if provided
  if (newReagentId && REAGENTS_MAP[newReagentId]) {
    updated.reagentsAdded.push({
      reagentId: newReagentId,
      amountMl: newAmountMl,
      timestamp: Date.now(),
    });
    updated.currentSubstances.push(newReagentId);
    updated.volumeMl = Math.min(60, updated.volumeMl + newAmountMl);
  }

  // If empty
  if (updated.currentSubstances.length === 0) {
    return createEmptyVessel(updated.id, updated.type, updated.name);
  }

  // Base solution color from the latest added solvent/liquid
  const latestReagentId = updated.reagentsAdded[updated.reagentsAdded.length - 1]?.reagentId;
  const latestReagent = REAGENTS_MAP[latestReagentId];

  // Set default initial color if first reagent
  if (updated.reagentsAdded.length === 1 && latestReagent) {
    updated.liquidColor = latestReagent.color;
    updated.pH = latestReagent.pH;
  }

  // If only 1 reagent and not heated, no reaction yet
  if (updated.reagentsAdded.length === 1 && !updated.isHeating) {
    return updated;
  }

  // Check reactions in the pool of substances present
  let matchedReaction: LabReaction | null = null;
  const currentSet = new Set(updated.currentSubstances);

  // Check heating decomposition reactions first if heating is active
  if (updated.isHeating) {
    // Copper hydroxide decomposition
    if (updated.precipitate?.formula === 'Cu(OH)2' || (currentSet.has('CuSO4') && currentSet.has('NaOH'))) {
      const heatReaction = REACTIONS_LIST.find((r) => r.id === 'heat_cuoh2_cuo');
      if (heatReaction) {
        matchedReaction = heatReaction;
      }
    } else if (currentSet.has('NH3')) {
      const heatAmmonia = REACTIONS_LIST.find((r) => r.id === 'heat_nh3_gas');
      if (heatAmmonia) {
        matchedReaction = heatAmmonia;
      }
    }
  }

  // Multi-step complex reactions check:
  // e.g. Phenolphthalein + NaOH + HCl -> neutralized colorless
  if (!matchedReaction && currentSet.has('Phenolphthalein') && currentSet.has('NaOH') && currentSet.has('HCl')) {
    matchedReaction = REACTIONS_LIST.find((r) => r.id === 'neutralize_pink_phenolphthalein') || null;
  }

  // e.g. CuSO4 + NaOH + excess NH3 -> soluble sapphire blue complex
  if (!matchedReaction && currentSet.has('CuSO4') && currentSet.has('NH3')) {
    matchedReaction = REACTIONS_LIST.find((r) => r.id === 'cux_nh3_complex') || null;
  }

  // Check standard reactions between any pair/subset of reagents
  if (!matchedReaction) {
    for (const rxn of REACTIONS_LIST) {
      if (rxn.requiresHeating && !updated.isHeating) continue;

      // Check if all reactants of this reaction are in currentSubstances
      const allPresent = rxn.reactants.every((r) => currentSet.has(r));
      if (allPresent) {
        matchedReaction = rxn;
        break;
      }
    }
  }

  // Apply matched reaction effects
  if (matchedReaction) {
    updated.lastReaction = matchedReaction;

    // Apply visual effects
    if (matchedReaction.effects.solutionColorTo) {
      updated.liquidColor = matchedReaction.effects.solutionColorTo;
    }

    if (matchedReaction.effects.precipitate) {
      updated.precipitate = matchedReaction.effects.precipitate;
    } else if (matchedReaction.id === 'neutralize_pink_phenolphthalein' || matchedReaction.id === 'cux_nh3_complex') {
      // Precipitate dissolved
      updated.precipitate = null;
    }

    if (matchedReaction.effects.gas) {
      updated.gas = matchedReaction.effects.gas;
    }

    // Temperature change
    if (matchedReaction.effects.temperature === 'exothermic') {
      updated.temperatureC = Math.min(85, updated.temperatureC + 25);
    } else if (matchedReaction.effects.temperature === 'endothermic') {
      updated.temperatureC = Math.max(12, updated.temperatureC - 8);
    }

    // Update pH
    if (matchedReaction.type === 'neutralization') {
      updated.pH = 7.0;
    }
  } else {
    // No reaction occurred between the substances!
    // Construct an educational impossible explanation
    if (updated.currentSubstances.length >= 2) {
      updated.impossibleNotice = getImpossibleReason(updated.currentSubstances);
    }
  }

  // Heating temperature effect
  if (updated.isHeating) {
    updated.temperatureC = Math.min(100, updated.temperatureC + 35);
  } else if (updated.temperatureC > 25) {
    // Normal cooling
    updated.temperatureC = Math.max(22, updated.temperatureC - 5);
  }

  return updated;
}

/**
 * Generates an educational explanation for why two or more substances do not react.
 */
export function getImpossibleReason(substances: string[]): LocalizedString {
  const set = new Set(substances);

  // Metal + acid where metal is less active than hydrogen (e.g. Cu + HCl)
  if (set.has('Cu') && (set.has('HCl') || set.has('H2SO4'))) {
    return {
      kk: 'Реакция жүрмейді: Мыс (Cu) металдардың белсенділік қатарында сутектен кейін орналасқан, сондықтан тұз немесе сұйылтылған күкірт қышқылынан сутекті ығыстыра алмайды.',
      ru: 'Реакция не идёт: Медь (Cu) в электрохимическом ряду напряжений стоит правее водорода, поэтому не может вытеснить водород из неокисляющих кислот.',
      en: 'No reaction: Copper is below hydrogen in the metal activity series and cannot displace hydrogen from non-oxidizing acids.',
    };
  }

  // Insoluble salt + acid where salt doesn't dissolve (e.g. BaSO4 + HCl)
  if (set.has('BaCl2') && set.has('NaCl')) {
    return {
      kk: 'Реакция жүрмейді: Екі тұз да ерімді және олардың иондары (Ba²⁺, Na⁺, Cl⁻) арасында тұнба немесе газ түзетін жаңа қосылыс пайда болмайды.',
      ru: 'Реакция не идёт: Обе соли растворимы, между их ионами не образуется осадок, газ или вода (условия ионного обмена не соблюдены).',
      en: 'No reaction: Both salts are soluble and no precipitate, gas, or weak electrolyte forms between their ions.',
    };
  }

  // Acid + Acid
  const acids = ['HCl', 'H2SO4', 'HNO3', 'CH3COOH'];
  const presentAcids = acids.filter((a) => set.has(a));
  if (presentAcids.length >= 2) {
    return {
      kk: 'Реакция жүрмейді: Екі қышқыл бір-бірімен әрекеттеспейді, себебі олардың құрамында бірдей H⁺ катиондары бар.',
      ru: 'Реакция не идёт: Кислоты не реагируют друг с другом в обычных условиях, так как содержат одинаковые катионы H⁺.',
      en: 'No reaction: Mineral acids do not react with one another under standard conditions as they share H+ cations.',
    };
  }

  // Base + Base
  const bases = ['NaOH', 'KOH', 'Ca(OH)2'];
  const presentBases = bases.filter((b) => set.has(b));
  if (presentBases.length >= 2) {
    return {
      kk: 'Реакция жүрмейді: Сілтілер бір-бірімен әрекеттеспейді (екі қосылыста да OH⁻ гидроксид-иондары бар).',
      ru: 'Реакция не идёт: Щёлочи не взаимодействуют между собой, так как имеют одинаковую щелочную природу.',
      en: 'No reaction: Strong alkalis do not react with each other.',
    };
  }

  // Generic explanation based on Exchange rules
  return {
    kk: 'Реакция жүрмейді: Ион алмасу реакциясының соңына дейін жүру шарттары орындалмады (тұнба, газ немесе әлсіз электролит — су түзілмейді).',
    ru: 'Реакция не идёт: Не соблюдены условия протекания реакций ионного обмена (не образуется осадок, газ или слабый электролит — вода).',
    en: 'No reaction: Conditions for double displacement are not met (no precipitate, gas, or weak electrolyte is produced).',
  };
}
