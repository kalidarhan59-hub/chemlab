import elementsData from '../../data/elementsBasic.json';
import { BondAnalysisItem, BondCategory, ElementData, MoleculeGraph } from '../../types/molecule';

const elementsMap = new Map<string, ElementData>(
  (elementsData as ElementData[]).map((el) => [el.symbol, el])
);

export function classifyBond(enDiff: number): BondCategory {
  if (enDiff > 1.7) {
    return 'ionic';
  }
  if (enDiff >= 0.4) {
    return 'covalent_polar';
  }
  return 'covalent_nonpolar';
}

export function getBondCategoryName(type: BondCategory, lang: 'kk' | 'ru' | 'en'): string {
  switch (type) {
    case 'covalent_nonpolar':
      return lang === 'kk'
        ? 'Ковалентті полярсыз'
        : lang === 'ru'
        ? 'Ковалентная неполярная'
        : 'Nonpolar covalent';
    case 'covalent_polar':
      return lang === 'kk'
        ? 'Ковалентті полярлы'
        : lang === 'ru'
        ? 'Ковалентная полярная'
        : 'Polar covalent';
    case 'ionic':
      return lang === 'kk' ? 'Иондық' : lang === 'ru' ? 'Ионная' : 'Ionic';
  }
}

export function getBondCategoryColor(type: BondCategory): string {
  switch (type) {
    case 'covalent_nonpolar':
      return '#10B981'; // green
    case 'covalent_polar':
      return '#3B82F6'; // blue
    case 'ionic':
      return '#8B5CF6'; // purple
  }
}

export function analyzeBonds(graph: MoleculeGraph): {
  bonds: BondAnalysisItem[];
  counts: {
    single: number;
    double: number;
    triple: number;
    total: number;
  };
  typeCounts: {
    nonpolar: number;
    polar: number;
    ionic: number;
  };
} {
  const atomMap = new Map(graph.atoms.map((a) => [a.id, a]));
  const bonds: BondAnalysisItem[] = [];

  let single = 0;
  let double = 0;
  let triple = 0;

  let nonpolar = 0;
  let polar = 0;
  let ionic = 0;

  for (const b of graph.bonds) {
    const a1 = atomMap.get(b.a);
    const a2 = atomMap.get(b.b);
    if (!a1 || !a2) continue;

    const el1 = elementsMap.get(a1.element);
    const el2 = elementsMap.get(a2.element);
    const en1 = el1?.electronegativity ?? 2.5;
    const en2 = el2?.electronegativity ?? 2.5;
    const enDiff = Math.round(Math.abs(en1 - en2) * 100) / 100;
    const category = classifyBond(enDiff);

    if (b.order === 1) single++;
    else if (b.order === 2) double++;
    else if (b.order === 3) triple++;

    if (category === 'covalent_nonpolar') nonpolar++;
    else if (category === 'covalent_polar') polar++;
    else if (category === 'ionic') ionic++;

    bonds.push({
      atomA: b.a,
      atomB: b.b,
      elementA: a1.element,
      elementB: a2.element,
      order: b.order,
      enDiff,
      type: category,
    });
  }

  return {
    bonds,
    counts: {
      single,
      double,
      triple,
      total: bonds.length,
    },
    typeCounts: {
      nonpolar,
      polar,
      ionic,
    },
  };
}
