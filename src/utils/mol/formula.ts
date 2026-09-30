import { MoleculeGraph } from '../../types/molecule';

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

/**
 * Converts a number to unicode subscript string.
 */
export function toSubscript(num: number): string {
  if (num <= 1) return '';
  return String(num)
    .split('')
    .map((c) => SUBSCRIPTS[c] || c)
    .join('');
}

/**
 * Generates Hill notation formula string for a molecule graph.
 * If C is present: C count, then H count, then remaining elements alphabetically.
 * If C is not present: all elements alphabetically.
 */
export function generateHillFormula(graph: MoleculeGraph): string {
  if (!graph.atoms || graph.atoms.length === 0) return '';

  const elementCounts = new Map<string, number>();
  for (const atom of graph.atoms) {
    const el = atom.element;
    elementCounts.set(el, (elementCounts.get(el) || 0) + 1);
  }

  const hasCarbon = elementCounts.has('C');
  let result = '';

  if (hasCarbon) {
    const cCount = elementCounts.get('C')!;
    result += `C${cCount > 1 ? cCount : ''}`;
    elementCounts.delete('C');

    if (elementCounts.has('H')) {
      const hCount = elementCounts.get('H')!;
      result += `H${hCount > 1 ? hCount : ''}`;
      elementCounts.delete('H');
    }
  }

  // Sort remaining elements alphabetically
  const remainingElements = Array.from(elementCounts.keys()).sort();
  for (const el of remainingElements) {
    const count = elementCounts.get(el)!;
    result += `${el}${count > 1 ? count : ''}`;
  }

  return result;
}

/**
 * Formats a formula string (like C2H6O or H2O) with unicode subscripts (C₂H₆O, H₂O).
 */
export function formatFormulaSubscripts(formula: string): string {
  if (!formula) return '';
  return formula.replace(/([A-Z][a-z]*)(\d+)/g, (_, el, count) => {
    return `${el}${toSubscript(parseInt(count, 10))}`;
  });
}

/**
 * Parses element counts from a chemical formula.
 */
export function parseFormula(formula: string): Map<string, number> {
  const counts = new Map<string, number>();
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(formula)) !== null) {
    if (match[0] === '') break;
    const el = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    counts.set(el, (counts.get(el) || 0) + count);
  }

  return counts;
}
