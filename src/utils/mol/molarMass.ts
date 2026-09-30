import elementsData from '../../data/elementsBasic.json';
import { ElementData, ElementMassBreakdown, MoleculeGraph } from '../../types/molecule';

const elementsMap = new Map<string, ElementData>(
  (elementsData as ElementData[]).map((el) => [el.symbol, el])
);

/**
 * Calculates total molar mass and breakdown by element for a molecule graph.
 */
export function calculateMolarMass(graph: MoleculeGraph): {
  totalMass: number;
  breakdown: ElementMassBreakdown[];
} {
  if (!graph.atoms || graph.atoms.length === 0) {
    return { totalMass: 0, breakdown: [] };
  }

  const counts = new Map<string, number>();
  for (const a of graph.atoms) {
    counts.set(a.element, (counts.get(a.element) || 0) + 1);
  }

  let totalMass = 0;
  const rawBreakdown: { element: string; count: number; mass: number; color: string }[] = [];

  for (const [symbol, count] of counts.entries()) {
    const el = elementsMap.get(symbol);
    const atomicMass = el?.atomicMass || 12;
    const color = el?.cpkColor || '#64748B';
    const subtotal = atomicMass * count;
    totalMass += subtotal;
    rawBreakdown.push({
      element: symbol,
      count,
      mass: subtotal,
      color,
    });
  }

  const breakdown: ElementMassBreakdown[] = rawBreakdown.map((item) => ({
    element: item.element,
    count: item.count,
    totalMass: Math.round(item.mass * 1000) / 1000,
    percentage: totalMass > 0 ? Math.round((item.mass / totalMass) * 1000) / 10 : 0,
    color: item.color,
  }));

  // Sort breakdown by mass descending
  breakdown.sort((a, b) => b.totalMass - a.totalMass);

  return {
    totalMass: Math.round(totalMass * 1000) / 1000,
    breakdown,
  };
}
