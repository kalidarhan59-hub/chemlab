import { MoleculeGraph } from '../../types/molecule';

/**
 * Computes a canonical signature for a molecule graph.
 * Two isomorphic chemical structures will produce identical canonical strings.
 */
export function getCanonicalGraphSignature(graph: MoleculeGraph): string {
  if (!graph.atoms || graph.atoms.length === 0) return '';

  const n = graph.atoms.length;
  const atomMap = new Map<string, number>();
  graph.atoms.forEach((a, idx) => atomMap.set(a.id, idx));

  // Build adjacency list with bond orders
  const adj: { target: number; order: number }[][] = Array.from({ length: n }, () => []);
  for (const b of graph.bonds) {
    const u = atomMap.get(b.a);
    const v = atomMap.get(b.b);
    if (u !== undefined && v !== undefined) {
      adj[u].push({ target: v, order: b.order });
      adj[v].push({ target: u, order: b.order });
    }
  }

  // Initial Morgan invariants: element symbol + degree + bond order sum
  let invariants: string[] = graph.atoms.map((a, i) => {
    const totalOrder = adj[i].reduce((sum, e) => sum + e.order, 0);
    return `${a.element}_deg${adj[i].length}_val${totalOrder}`;
  });

  // Perform 3 iterations of Morgan neighborhood invariant expansion
  for (let round = 0; round < 3; round++) {
    const nextInvariants: string[] = [];
    for (let i = 0; i < n; i++) {
      const neighborCodes = adj[i]
        .map((edge) => `${edge.order}:${invariants[edge.target]}`)
        .sort()
        .join(';');
      nextInvariants.push(`${invariants[i]}[${neighborCodes}]`);
    }
    invariants = nextInvariants;
  }

  // Count atoms by element for formula prefix
  const elementCounts = new Map<string, number>();
  for (const a of graph.atoms) {
    elementCounts.set(a.element, (elementCounts.get(a.element) || 0) + 1);
  }
  const formulaTokens = Array.from(elementCounts.entries())
    .sort(([elA], [elB]) => elA.localeCompare(elB))
    .map(([el, cnt]) => `${el}${cnt}`)
    .join('');

  // Sort canonical invariant multiset
  const sortedInvariants = [...invariants].sort().join('|');

  // Also include summary of bond orders
  const bondSummary = graph.bonds
    .map((b) => {
      const u = atomMap.get(b.a);
      const v = atomMap.get(b.b);
      if (u === undefined || v === undefined) return '';
      const inv1 = invariants[u];
      const inv2 = invariants[v];
      return inv1 < inv2
        ? `${inv1}-(${b.order})-${inv2}`
        : `${inv2}-(${b.order})-${inv1}`;
    })
    .sort()
    .join(';;');

  return `FORMULA:${formulaTokens}#INVARIANTS:${sortedInvariants}#BONDS:${bondSummary}`;
}
