export interface MoleculeAtom {
  id: string;
  element: string;
  x: number;
  y: number;
  z?: number;
}

export interface MoleculeBond {
  a: string; // atom id 1
  b: string; // atom id 2
  order: 1 | 2 | 3;
}

export interface MoleculeGraph {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export interface ElementData {
  symbol: string;
  number: number;
  name: {
    kk: string;
    ru: string;
    en: string;
  };
  valences: number[];
  electronegativity: number;
  atomicMass: number;
  cpkColor: string;
  covalentRadius: number;
  vdwRadius: number;
  maxBonds: number;
}

export type BondCategory = 'covalent_nonpolar' | 'covalent_polar' | 'ionic';

export interface BondAnalysisItem {
  atomA: string;
  atomB: string;
  elementA: string;
  elementB: string;
  order: 1 | 2 | 3;
  enDiff: number;
  type: BondCategory;
}

export interface ElementMassBreakdown {
  element: string;
  count: number;
  totalMass: number;
  percentage: number;
  color: string;
}

export interface ValenceWarning {
  atomId: string;
  element: string;
  currentValence: number;
  allowedValences: number[];
  isExceeded: boolean;
}

export interface MoleculeAnalysisResult {
  formula: string;
  formattedFormula: string;
  molarMass: number;
  massBreakdown: ElementMassBreakdown[];
  bondsAnalysis: BondAnalysisItem[];
  bondCounts: {
    single: number;
    double: number;
    triple: number;
    total: number;
  };
  bondTypeCounts: {
    nonpolar: number;
    polar: number;
    ionic: number;
  };
  name: {
    kk: string;
    ru: string;
    en: string;
  } | null;
  hybridization: string;
  geometry: {
    kk: string;
    ru: string;
    en: string;
  };
  polarity: 'nonpolar' | 'polar';
  valenceWarnings: ValenceWarning[];
  hasValenceError: boolean;
}

export interface PresetMolecule {
  id: string;
  name: {
    kk: string;
    ru: string;
    en: string;
  };
  formula: string;
  category: string;
  description: {
    kk: string;
    ru: string;
    en: string;
  };
  fact: {
    kk: string;
    ru: string;
    en: string;
  };
  hybridization?: string;
  geometry?: {
    kk: string;
    ru: string;
    en: string;
  };
  polarity?: 'nonpolar' | 'polar';
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}
