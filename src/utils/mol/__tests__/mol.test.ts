import { describe, it, expect } from 'vitest';
import { calculateAtomValence, checkValences, addHydrogensToMolecule } from '../valence';
import { generateHillFormula, formatFormulaSubscripts, parseFormula, toSubscript } from '../formula';
import { calculateMolarMass } from '../molarMass';
import { classifyBond, analyzeBonds, getBondCategoryName } from '../bondType';
import { getCanonicalGraphSignature } from '../canonical';
import { identifyMolecule } from '../naming';
import { generate3DLayout } from '../layout3d';
import { MoleculeGraph } from '../../../types/molecule';

describe('Molecule Utilities Test Suite (25+ cases)', () => {
  // 1. Valence tests
  describe('Valence calculations', () => {
    it('calculates single bond valence correctly', () => {
      const bonds = [{ a: 'C1', b: 'H1', order: 1 as const }];
      expect(calculateAtomValence('C1', bonds)).toBe(1);
    });

    it('calculates double and triple bond valence correctly', () => {
      const bonds = [
        { a: 'C1', b: 'C2', order: 2 as const },
        { a: 'C1', b: 'H1', order: 1 as const },
      ];
      expect(calculateAtomValence('C1', bonds)).toBe(3);
    });

    it('detects carbon exceeding maximum valence 4', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 10, y: 0 },
          { id: 'H2', element: 'H', x: -10, y: 0 },
          { id: 'H3', element: 'H', x: 0, y: 10 },
          { id: 'H4', element: 'H', x: 0, y: -10 },
          { id: 'H5', element: 'H', x: 5, y: 5 },
        ],
        bonds: [
          { a: 'C1', b: 'H1', order: 1 },
          { a: 'C1', b: 'H2', order: 1 },
          { a: 'C1', b: 'H3', order: 1 },
          { a: 'C1', b: 'H4', order: 1 },
          { a: 'C1', b: 'H5', order: 1 },
        ],
      };
      const warnings = checkValences(graph);
      expect(warnings.some((w) => w.atomId === 'C1' && w.isExceeded)).toBe(true);
    });

    it('saturates isolated Carbon with 4 Hydrogens automatically', () => {
      const graph: MoleculeGraph = {
        atoms: [{ id: 'C1', element: 'C', x: 100, y: 100 }],
        bonds: [],
      };
      const saturated = addHydrogensToMolecule(graph);
      expect(saturated.atoms.length).toBe(5);
      expect(saturated.bonds.length).toBe(4);
      expect(calculateAtomValence('C1', saturated.bonds)).toBe(4);
    });

    it('saturates Carbon with 1 double bond with 2 Hydrogens', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'O1', element: 'O', x: 50, y: 0 },
        ],
        bonds: [{ a: 'C1', b: 'O1', order: 2 }],
      };
      const saturated = addHydrogensToMolecule(graph);
      // C1 has order 2, needs 2 H. O1 has order 2, needs 0 H. Total atoms = 2 + 2 = 4
      expect(saturated.atoms.length).toBe(4);
      expect(calculateAtomValence('C1', saturated.bonds)).toBe(4);
      expect(calculateAtomValence('O1', saturated.bonds)).toBe(2);
    });
  });

  // 2. Formula & Hill notation tests
  describe('Formula utilities', () => {
    it('Hill system puts Carbon first, then Hydrogen, then alphabetical', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'O1', element: 'O', x: 0, y: 0 },
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 0, y: 0 },
          { id: 'Cl1', element: 'Cl', x: 0, y: 0 },
        ],
        bonds: [],
      };
      expect(generateHillFormula(graph)).toBe('CHClO');
    });

    it('Hill system for inorganic compounds orders alphabetically without carbon', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'O1', element: 'O', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 0, y: 0 },
          { id: 'H2', element: 'H', x: 0, y: 0 },
        ],
        bonds: [],
      };
      expect(generateHillFormula(graph)).toBe('H2O');
    });

    it('formats numbers as unicode subscripts correctly', () => {
      expect(toSubscript(2)).toBe('₂');
      expect(toSubscript(12)).toBe('₁₂');
      expect(toSubscript(1)).toBe('');
    });

    it('formats chemical formula with subscripts', () => {
      expect(formatFormulaSubscripts('C6H12O6')).toBe('C₆H₁₂O₆');
      expect(formatFormulaSubscripts('H2SO4')).toBe('H₂SO₄');
    });

    it('parses chemical formula correctly', () => {
      const counts = parseFormula('C2H5OH');
      expect(counts.get('C')).toBe(2);
      expect(counts.get('H')).toBe(6);
      expect(counts.get('O')).toBe(1);
    });
  });

  // 3. Molar Mass tests
  describe('Molar mass calculations', () => {
    it('calculates molar mass for Water H2O accurately (~18.015 g/mol)', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'O1', element: 'O', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 0, y: 0 },
          { id: 'H2', element: 'H', x: 0, y: 0 },
        ],
        bonds: [],
      };
      const { totalMass, breakdown } = calculateMolarMass(graph);
      expect(totalMass).toBeCloseTo(18.015, 1);
      expect(breakdown.length).toBe(2);
      const oxygenPart = breakdown.find((b) => b.element === 'O');
      expect(oxygenPart?.percentage).toBeGreaterThan(88);
    });

    it('calculates molar mass for Methane CH4 (~16.04 g/mol)', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 0, y: 0 },
          { id: 'H2', element: 'H', x: 0, y: 0 },
          { id: 'H3', element: 'H', x: 0, y: 0 },
          { id: 'H4', element: 'H', x: 0, y: 0 },
        ],
        bonds: [],
      };
      const { totalMass } = calculateMolarMass(graph);
      expect(totalMass).toBeCloseTo(16.04, 1);
    });

    it('handles empty molecule graph gracefully', () => {
      const { totalMass, breakdown } = calculateMolarMass({ atoms: [], bonds: [] });
      expect(totalMass).toBe(0);
      expect(breakdown).toEqual([]);
    });
  });

  // 4. Bond Type & Electronegativity tests
  describe('Bond type classification', () => {
    it('classifies C-C and C-H bonds correctly as nonpolar covalent', () => {
      // C (2.55) - H (2.20) diff = 0.35 < 0.4
      expect(classifyBond(0.35)).toBe('covalent_nonpolar');
      expect(classifyBond(0.0)).toBe('covalent_nonpolar');
    });

    it('classifies O-H bond (diff 1.24) as polar covalent', () => {
      expect(classifyBond(1.24)).toBe('covalent_polar');
    });

    it('classifies Na-Cl bond (diff 2.23) as ionic', () => {
      expect(classifyBond(2.23)).toBe('ionic');
    });

    it('translates bond categories into Kazakh, Russian and English', () => {
      expect(getBondCategoryName('ionic', 'kk')).toBe('Иондық');
      expect(getBondCategoryName('ionic', 'ru')).toBe('Ионная');
      expect(getBondCategoryName('ionic', 'en')).toBe('Ionic');
      expect(getBondCategoryName('covalent_polar', 'kk')).toBe('Ковалентті полярлы');
      expect(getBondCategoryName('covalent_nonpolar', 'kk')).toBe('Ковалентті полярсыз');
    });

    it('analyzes entire molecule bonds properly', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'Na1', element: 'Na', x: 0, y: 0 },
          { id: 'Cl1', element: 'Cl', x: 40, y: 0 },
        ],
        bonds: [{ a: 'Na1', b: 'Cl1', order: 1 }],
      };
      const analysis = analyzeBonds(graph);
      expect(analysis.counts.single).toBe(1);
      expect(analysis.typeCounts.ionic).toBe(1);
      expect(analysis.bonds[0].enDiff).toBeGreaterThan(1.7);
    });
  });

  // 5. Canonical graph signature tests
  describe('Canonical graph representation', () => {
    it('produces identical signature for water regardless of atom IDs or order', () => {
      const graphA: MoleculeGraph = {
        atoms: [
          { id: 'O1', element: 'O', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: -30, y: 30 },
          { id: 'H2', element: 'H', x: 30, y: 30 },
        ],
        bonds: [
          { a: 'O1', b: 'H1', order: 1 },
          { a: 'O1', b: 'H2', order: 1 },
        ],
      };

      const graphB: MoleculeGraph = {
        atoms: [
          { id: 'aH_second', element: 'H', x: 100, y: 200 },
          { id: 'aOxygen', element: 'O', x: 150, y: 150 },
          { id: 'aH_first', element: 'H', x: 200, y: 200 },
        ],
        bonds: [
          { a: 'aH_first', b: 'aOxygen', order: 1 },
          { a: 'aH_second', b: 'aOxygen', order: 1 },
        ],
      };

      expect(getCanonicalGraphSignature(graphA)).toBe(getCanonicalGraphSignature(graphB));
    });

    it('differentiates single vs double bonded carbon', () => {
      const ethane: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'C2', element: 'C', x: 50, y: 0 },
        ],
        bonds: [{ a: 'C1', b: 'C2', order: 1 }],
      };

      const ethene: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'C2', element: 'C', x: 50, y: 0 },
        ],
        bonds: [{ a: 'C1', b: 'C2', order: 2 }],
      };

      expect(getCanonicalGraphSignature(ethane)).not.toBe(getCanonicalGraphSignature(ethene));
    });
  });

  // 6. Naming & Identification tests
  describe('Molecule nomenclature & preset identification', () => {
    it('identifies Water from library presets by exact canonical match', () => {
      const water: MoleculeGraph = {
        atoms: [
          { id: 'O1', element: 'O', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: -55, y: 45 },
          { id: 'H2', element: 'H', x: 55, y: 45 },
        ],
        bonds: [
          { a: 'O1', b: 'H1', order: 1 },
          { a: 'O1', b: 'H2', order: 1 },
        ],
      };
      const info = identifyMolecule(water);
      expect(info.name?.kk).toBe('Су');
      expect(info.name?.ru).toBe('Вода');
      expect(info.name?.en).toBe('Water');
    });

    it('identifies Methane CH4 from library presets', () => {
      const methane: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'H1', element: 'H', x: 0, y: -50 },
          { id: 'H2', element: 'H', x: 50, y: 0 },
          { id: 'H3', element: 'H', x: 0, y: 50 },
          { id: 'H4', element: 'H', x: -50, y: 0 },
        ],
        bonds: [
          { a: 'C1', b: 'H1', order: 1 },
          { a: 'C1', b: 'H2', order: 1 },
          { a: 'C1', b: 'H3', order: 1 },
          { a: 'C1', b: 'H4', order: 1 },
        ],
      };
      const info = identifyMolecule(methane);
      expect(info.name?.kk).toBe('Метан');
      expect(info.name?.ru).toBe('Метан');
      expect(info.hybridization).toBe('sp³');
    });

    it('names simple alkane algorithmically if not in library', () => {
      // 5 Carbons chain with single bonds
      const pentane: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'C2', element: 'C', x: 40, y: 0 },
          { id: 'C3', element: 'C', x: 80, y: 0 },
          { id: 'C4', element: 'C', x: 120, y: 0 },
          { id: 'C5', element: 'C', x: 160, y: 0 },
        ],
        bonds: [
          { a: 'C1', b: 'C2', order: 1 },
          { a: 'C2', b: 'C3', order: 1 },
          { a: 'C3', b: 'C4', order: 1 },
          { a: 'C4', b: 'C5', order: 1 },
        ],
      };
      const info = identifyMolecule(pentane);
      expect(info.name?.kk).toBe('Пентан');
      expect(info.name?.ru).toBe('Пентан');
      expect(info.name?.en).toBe('Pentane');
    });
  });

  // 7. 3D Layout generation tests
  describe('3D Layout generator', () => {
    it('generates 3D coordinates for all atoms in a molecule', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'C1', element: 'C', x: 0, y: 0 },
          { id: 'O1', element: 'O', x: 50, y: 0 },
        ],
        bonds: [{ a: 'C1', b: 'O1', order: 2 }],
      };
      const positions = generate3DLayout(graph);
      expect(positions.size).toBe(2);
      expect(positions.has('C1')).toBe(true);
      expect(positions.has('O1')).toBe(true);
      const c1 = positions.get('C1')!;
      const o1 = positions.get('O1')!;
      const dist = Math.hypot(c1.x - o1.x, c1.y - o1.y, c1.z - o1.z);
      expect(dist).toBeGreaterThan(0.5);
    });

    it('centers 3D coordinates around origin (0,0,0)', () => {
      const graph: MoleculeGraph = {
        atoms: [
          { id: 'A', element: 'C', x: 100, y: 100 },
          { id: 'B', element: 'C', x: 200, y: 100 },
        ],
        bonds: [{ a: 'A', b: 'B', order: 1 }],
      };
      const positions = generate3DLayout(graph);
      let avgX = 0;
      let avgY = 0;
      let avgZ = 0;
      positions.forEach((p) => {
        avgX += p.x;
        avgY += p.y;
        avgZ += p.z;
      });
      expect(Math.abs(avgX)).toBeLessThan(0.01);
      expect(Math.abs(avgY)).toBeLessThan(0.01);
      expect(Math.abs(avgZ)).toBeLessThan(0.01);
    });
  });
});
