import elementsData from '../../data/elementsBasic.json';
import { MoleculeAtom, MoleculeBond, MoleculeGraph, ValenceWarning, ElementData } from '../../types/molecule';

const elementsMap = new Map<string, ElementData>(
  (elementsData as ElementData[]).map((el) => [el.symbol, el])
);

export function getElementInfo(symbol: string): ElementData | undefined {
  return elementsMap.get(symbol);
}

/**
 * Calculates current bonded order sum (valence) for an atom.
 */
export function calculateAtomValence(atomId: string, bonds: MoleculeBond[]): number {
  let val = 0;
  for (const b of bonds) {
    if (b.a === atomId || b.b === atomId) {
      val += b.order;
    }
  }
  return val;
}

/**
 * Checks valences of all atoms against allowed valences.
 */
export function checkValences(graph: MoleculeGraph): ValenceWarning[] {
  const warnings: ValenceWarning[] = [];

  for (const atom of graph.atoms) {
    const el = elementsMap.get(atom.element);
    const maxValence = el ? Math.max(...el.valences, el.maxBonds || 1) : 4;
    const allowed = el?.valences || [1];
    const current = calculateAtomValence(atom.id, graph.bonds);

    if (current > maxValence) {
      warnings.push({
        atomId: atom.id,
        element: atom.element,
        currentValence: current,
        allowedValences: allowed,
        isExceeded: true,
      });
    } else if (current > 0 && !allowed.includes(current) && current > Math.min(...allowed)) {
      // If current is between valid states but not exceeding maximum
      warnings.push({
        atomId: atom.id,
        element: atom.element,
        currentValence: current,
        allowedValences: allowed,
        isExceeded: current > maxValence,
      });
    }
  }

  return warnings;
}

/**
 * Automatically saturates remaining atom valences with Hydrogen atoms radially.
 */
export function addHydrogensToMolecule(graph: MoleculeGraph): MoleculeGraph {
  const newAtoms: MoleculeAtom[] = [...graph.atoms];
  const newBonds: MoleculeBond[] = [...graph.bonds];
  let hCounter = 1;

  // Find max existing H index
  for (const a of graph.atoms) {
    if (a.element === 'H') {
      const match = a.id.match(/^H(\d+)$/);
      if (match) {
        hCounter = Math.max(hCounter, parseInt(match[1], 10) + 1);
      }
    }
  }

  const bondDistance = 45; // pixels in 2D

  for (const atom of graph.atoms) {
    if (atom.element === 'H') continue; // Don't add hydrogens to hydrogen
    const el = elementsMap.get(atom.element);
    if (!el) continue;

    // Target standard valence (e.g. 4 for C, 3 for N, 2 for O, 1 for halogens)
    const targetValence = el.valences[0] || el.maxBonds || 1;
    const currentValence = calculateAtomValence(atom.id, newBonds);
    const needed = Math.max(0, targetValence - currentValence);

    if (needed <= 0) continue;

    // Find existing neighbors to place new H away from them
    const existingNeighbors: MoleculeAtom[] = [];
    for (const b of newBonds) {
      if (b.a === atom.id) {
        const neighbor = newAtoms.find((na) => na.id === b.b);
        if (neighbor) existingNeighbors.push(neighbor);
      } else if (b.b === atom.id) {
        const neighbor = newAtoms.find((na) => na.id === b.a);
        if (neighbor) existingNeighbors.push(neighbor);
      }
    }

    const occupiedAngles: number[] = existingNeighbors.map((n) =>
      Math.atan2(n.y - atom.y, n.x - atom.x)
    );

    // Pick evenly spaced angles around the atom avoiding existing bonds
    const step = (Math.PI * 2) / (existingNeighbors.length + needed || 4);
    let startAngle = 0;
    if (occupiedAngles.length === 1) {
      startAngle = occupiedAngles[0] + Math.PI; // opposite side
    } else if (occupiedAngles.length > 0) {
      startAngle = occupiedAngles[0] + step;
    }

    for (let i = 0; i < needed; i++) {
      const angle = startAngle + (i - (needed - 1) / 2) * (Math.PI / 2.5);
      const hId = `H_auto_${hCounter++}`;
      const hAtom: MoleculeAtom = {
        id: hId,
        element: 'H',
        x: Math.round(atom.x + Math.cos(angle) * bondDistance),
        y: Math.round(atom.y + Math.sin(angle) * bondDistance),
        z: 0,
      };

      newAtoms.push(hAtom);
      newBonds.push({
        a: atom.id,
        b: hId,
        order: 1,
      });
    }
  }

  return { atoms: newAtoms, bonds: newBonds };
}
