import moleculesData from '../../data/molecules.json';
import { MoleculeGraph, PresetMolecule } from '../../types/molecule';
import { getCanonicalGraphSignature } from './canonical';
import { generateHillFormula } from './formula';

const presets = moleculesData as PresetMolecule[];

// Pre-compute canonical signatures for all presets in the library
const presetSignatures = new Map<string, PresetMolecule>();

for (const p of presets) {
  const sig = getCanonicalGraphSignature({ atoms: p.atoms, bonds: p.bonds });
  presetSignatures.set(sig, p);
}

const ALKANE_ROOTS: Record<number, { kk: string; ru: string; en: string }> = {
  1: { kk: 'Метан', ru: 'Метан', en: 'Methane' },
  2: { kk: 'Этан', ru: 'Этан', en: 'Ethane' },
  3: { kk: 'Пропан', ru: 'Пропан', en: 'Propane' },
  4: { kk: 'Бутан', ru: 'Бутан', en: 'Butane' },
  5: { kk: 'Пентан', ru: 'Пентан', en: 'Pentane' },
  6: { kk: 'Гексан', ru: 'Гексан', en: 'Hexane' },
  7: { kk: 'Гептан', ru: 'Гептан', en: 'Heptane' },
  8: { kk: 'Октан', ru: 'Октан', en: 'Octane' },
};

const ALKENE_ROOTS: Record<number, { kk: string; ru: string; en: string }> = {
  2: { kk: 'Этен (этилен)', ru: 'Этен (этилен)', en: 'Ethene (ethylene)' },
  3: { kk: 'Пропен (пропилен)', ru: 'Пропен (пропилен)', en: 'Propene (propylene)' },
  4: { kk: 'Бутен', ru: 'Бутен', en: 'Butene' },
  5: { kk: 'Пентен', ru: 'Пентен', en: 'Pentene' },
  6: { kk: 'Гексен', ru: 'Гексен', en: 'Hexene' },
  7: { kk: 'Гептен', ru: 'Гептен', en: 'Heptene' },
  8: { kk: 'Октен', ru: 'Октен', en: 'Octene' },
};

const ALKYNE_ROOTS: Record<number, { kk: string; ru: string; en: string }> = {
  2: { kk: 'Этин (ацетилен)', ru: 'Этин (ацетилен)', en: 'Ethyne (acetylene)' },
  3: { kk: 'Пропин', ru: 'Пропин', en: 'Propyne' },
  4: { kk: 'Бутин', ru: 'Бутин', en: 'Butyne' },
  5: { kk: 'Пентин', ru: 'Пентин', en: 'Pentyne' },
  6: { kk: 'Гексин', ru: 'Гексин', en: 'Hexyne' },
  7: { kk: 'Гептин', ru: 'Гептин', en: 'Heptyne' },
  8: { kk: 'Октин', ru: 'Октин', en: 'Octyne' },
};

const ALCOHOL_ROOTS: Record<number, { kk: string; ru: string; en: string }> = {
  1: { kk: 'Метанол (метил спирті)', ru: 'Метанол (метиловый спирт)', en: 'Methanol' },
  2: { kk: 'Этанол (этил спирті)', ru: 'Этанол (этиловый спирт)', en: 'Ethanol' },
  3: { kk: 'Пропанол (пропил спирті)', ru: 'Пропанол (пропиловый спирт)', en: 'Propanol' },
  4: { kk: 'Бутанол', ru: 'Бутанол', en: 'Butanol' },
  5: { kk: 'Пентанол', ru: 'Пентанол', en: 'Pentanol' },
  6: { kk: 'Гексанол', ru: 'Гексанол', en: 'Hexanol' },
  7: { kk: 'Гептанол', ru: 'Гептанол', en: 'Heptanol' },
  8: { kk: 'Октанол', ru: 'Октанол', en: 'Octanol' },
};

const ACID_ROOTS: Record<number, { kk: string; ru: string; en: string }> = {
  1: { kk: 'Метан қышқылы (құмырсқа қышқылы)', ru: 'Метановая кислота (муравьиная)', en: 'Methanoic acid (formic acid)' },
  2: { kk: 'Этан қышқылы (сірке қышқылы)', ru: 'Этановая кислота (уксусная)', en: 'Ethanoic acid (acetic acid)' },
  3: { kk: 'Пропан қышқылы (пропион қышқылы)', ru: 'Пропановая кислота (пропионовая)', en: 'Propanoic acid' },
  4: { kk: 'Бутан қышқылы (май қышқылы)', ru: 'Бутановая кислота (масляная)', en: 'Butanoic acid' },
  5: { kk: 'Пентан қышқылы (валериан қышқылы)', ru: 'Пентановая кислота', en: 'Pentanoic acid' },
  6: { kk: 'Гексан қышқылы', ru: 'Гексановая кислота', en: 'Hexanoic acid' },
  7: { kk: 'Гептан қышқылы', ru: 'Гептановая кислота', en: 'Heptanoic acid' },
  8: { kk: 'Октан қышқылы', ru: 'Октановая кислота', en: 'Octanoic acid' },
};

/**
 * Recognizes molecule name:
 * 1. Checks library presets by exact canonical graph isomorphism.
 * 2. If unknown organic compound, attempts rule-based IUPAC classification.
 */
export function identifyMolecule(graph: MoleculeGraph): {
  preset: PresetMolecule | null;
  name: { kk: string; ru: string; en: string } | null;
  hybridization: string;
  geometry: { kk: string; ru: string; en: string };
  polarity: 'nonpolar' | 'polar';
} {
  if (!graph.atoms || graph.atoms.length === 0) {
    return {
      preset: null,
      name: null,
      hybridization: '—',
      geometry: { kk: 'Анықталмаған', ru: 'Не определена', en: 'Undefined' },
      polarity: 'nonpolar',
    };
  }

  // 1. Exact canonical matching with preset database
  const sig = getCanonicalGraphSignature(graph);
  const matched = presetSignatures.get(sig);

  if (matched) {
    return {
      preset: matched,
      name: matched.name,
      hybridization: matched.hybridization || 'sp³',
      geometry: matched.geometry || { kk: 'Тетраэдрлік', ru: 'Тетраэдрическая', en: 'Tetrahedral' },
      polarity: matched.polarity || 'polar',
    };
  }

  // 2. Also check if only hydrogens differ or simple isomer match by formula in presets
  const formula = generateHillFormula(graph);

  // 3. Algorithmic IUPAC identification for simple organic families
  const elementCounts = new Map<string, number>();
  for (const a of graph.atoms) {
    elementCounts.set(a.element, (elementCounts.get(a.element) || 0) + 1);
  }

  const C = elementCounts.get('C') || 0;
  const H = elementCounts.get('H') || 0;
  const O = elementCounts.get('O') || 0;
  const totalAtoms = graph.atoms.length;

  const doubleBondsCount = graph.bonds.filter((b) => b.order === 2).length;
  const tripleBondsCount = graph.bonds.filter((b) => b.order === 3).length;

  let identifiedName: { kk: string; ru: string; en: string } | null = null;
  let hybridization = 'sp³';
  let geometry = { kk: 'Тетраэдрлік', ru: 'Тетраэдрическая', en: 'Tetrahedral' };
  let polarity: 'nonpolar' | 'polar' = 'nonpolar';

  // Check if purely Hydrocarbon (C + H)
  if (C > 0 && C + H === totalAtoms) {
    if (tripleBondsCount >= 1 && ALKYNE_ROOTS[C]) {
      identifiedName = ALKYNE_ROOTS[C];
      hybridization = 'sp';
      geometry = { kk: 'Сызықтық', ru: 'Линейная', en: 'Linear' };
      polarity = 'nonpolar';
    } else if (doubleBondsCount >= 1 && ALKENE_ROOTS[C]) {
      identifiedName = ALKENE_ROOTS[C];
      hybridization = 'sp²';
      geometry = { kk: 'Тригональды жазық', ru: 'Тригонально-плоская', en: 'Trigonal planar' };
      polarity = 'nonpolar';
    } else if (ALKANE_ROOTS[C]) {
      identifiedName = ALKANE_ROOTS[C];
      hybridization = 'sp³';
      geometry = { kk: 'Тетраэдрлік', ru: 'Тетраэдрическая', en: 'Tetrahedral' };
      polarity = 'nonpolar';
    }
  } else if (C > 0 && O === 1 && C + H + O === totalAtoms) {
    // Alcohols or Aldehydes/Ketones
    if (doubleBondsCount === 1) {
      identifiedName = {
        kk: `${ALKANE_ROOTS[C]?.kk || 'Альдегид'}аль`,
        ru: `${ALKANE_ROOTS[C]?.ru || 'Альдегид'}аль / кетон`,
        en: `${ALKANE_ROOTS[C]?.en || 'Alcanal'} (carbonyl)`,
      };
      hybridization = 'sp²';
      geometry = { kk: 'Тригональды жазық', ru: 'Тригонально-плоская', en: 'Trigonal planar' };
      polarity = 'polar';
    } else if (ALCOHOL_ROOTS[C]) {
      identifiedName = ALCOHOL_ROOTS[C];
      hybridization = 'sp³';
      geometry = { kk: 'Бұрыштық / Тетраэдрлік', ru: 'Угловая / Тетраэдрическая', en: 'Bent / Tetrahedral' };
      polarity = 'polar';
    }
  } else if (C > 0 && O === 2 && doubleBondsCount >= 1 && ACID_ROOTS[C]) {
    // Carboxylic acids
    identifiedName = ACID_ROOTS[C];
    hybridization = 'sp²';
    geometry = { kk: 'Тригональды жазық', ru: 'Тригонально-плоская', en: 'Trigonal planar' };
    polarity = 'polar';
  }

  // Deduce central atom geometry if not determined
  if (C === 1) {
    if (tripleBondsCount > 0 || doubleBondsCount === 2) {
      hybridization = 'sp';
      geometry = { kk: 'Сызықтық (180°)', ru: 'Линейная (180°)', en: 'Linear (180°)' };
    } else if (doubleBondsCount === 1) {
      hybridization = 'sp²';
      geometry = { kk: 'Тригональды жазық (120°)', ru: 'Тригональная (120°)', en: 'Trigonal planar (120°)' };
    }
  }

  return {
    preset: null,
    name: identifiedName,
    hybridization,
    geometry,
    polarity,
  };
}
