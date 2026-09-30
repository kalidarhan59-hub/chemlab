import { Fraction } from './fraction';
import { parseCompound, ParsedCompound } from './chemicalFormula';

export interface EquationElementRow {
  symbol: string;
  reactantsTotal: number;
  productsTotal: number;
  isBalanced: boolean;
}

export interface BalanceStep {
  titleKey: string;
  descriptionKey?: string;
  details: string[];
}

export interface BalancedEquationResult {
  isSuccess: boolean;
  errorKey?: string;
  errorMessage?: string;
  reactants: ParsedCompound[];
  products: ParsedCompound[];
  reactantCoefficients: number[];
  productCoefficients: number[];
  fullEquationUnicode: string;
  fullEquationHtml: string;
  elementVerification: EquationElementRow[];
  algebraicEquations: string[];
  explanationSteps: BalanceStep[];
  allElements: string[];
}

/**
 * Splits equation string into reactants and products.
 * Handles arrows: ->, →, =, <=>, ⇄, ==
 */
export function splitEquation(equationStr: string): { reactantsRaw: string[]; productsRaw: string[] } {
  const arrowRegex = /(=>|->|→|<=>|⇄|==|=)/;
  const parts = equationStr.split(arrowRegex);

  if (parts.length < 3) {
    throw new Error('MISSING_ARROW');
  }

  const leftSide = parts[0].trim();
  // Find right side by joining remaining parts after the first arrow
  const rightSide = parts.slice(2).join('').trim();

  if (!leftSide || !rightSide) {
    throw new Error('INCOMPLETE_EQUATION');
  }

  const reactantsRaw = leftSide.split('+').map((s) => s.trim()).filter(Boolean);
  const productsRaw = rightSide.split('+').map((s) => s.trim()).filter(Boolean);

  if (reactantsRaw.length === 0 || productsRaw.length === 0) {
    throw new Error('EMPTY_SIDES');
  }

  return { reactantsRaw, productsRaw };
}

/**
 * Solves and balances the chemical equation using exact rational Gaussian elimination.
 */
export function balanceChemicalEquation(equationStr: string): BalancedEquationResult {
  try {
    const { reactantsRaw, productsRaw } = splitEquation(equationStr);

    const reactants = reactantsRaw.map((r) => parseCompound(r));
    const products = productsRaw.map((p) => parseCompound(p));

    // Gather all distinct elements
    const elementSet = new Set<string>();
    reactants.forEach((c) => Object.keys(c.elementCounts).forEach((el) => elementSet.add(el)));
    products.forEach((c) => Object.keys(c.elementCounts).forEach((el) => elementSet.add(el)));

    const allElements = Array.from(elementSet);

    // Check for elements that appear only on one side
    const reactantElements = new Set<string>();
    reactants.forEach((c) => Object.keys(c.elementCounts).forEach((el) => reactantElements.add(el)));

    const productElements = new Set<string>();
    products.forEach((c) => Object.keys(c.elementCounts).forEach((el) => productElements.add(el)));

    for (const el of allElements) {
      if (!reactantElements.has(el) || !productElements.has(el)) {
        return {
          isSuccess: false,
          errorKey: 'UNBALANCED_ELEMENT_SIDES',
          errorMessage: `Element "${el}" is present on one side only. Chemical reactions must conserve all elements.`,
          reactants,
          products,
          reactantCoefficients: [],
          productCoefficients: [],
          fullEquationUnicode: '',
          fullEquationHtml: '',
          elementVerification: [],
          algebraicEquations: [],
          explanationSteps: [],
          allElements,
        };
      }
    }

    const checkCharges = reactants.some((c) => c.charge !== 0) || products.some((c) => c.charge !== 0);

    // Number of variables m = total compounds
    const allCompounds = [...reactants, ...products];
    const m = allCompounds.length;
    const pCount = reactants.length;

    // Rows: elements + (1 row for charge if ionic)
    const rowKeys: string[] = [...allElements];
    if (checkCharges) {
      rowKeys.push('__CHARGE__');
    }
    const numRows = rowKeys.length;

    // Build conservation matrix A (size numRows x m)
    // For reactants (0 .. pCount-1): positive count
    // For products (pCount .. m-1): negative count
    const A: Fraction[][] = [];
    for (let r = 0; r < numRows; r++) {
      const rowKey = rowKeys[r];
      const row: Fraction[] = [];
      for (let c = 0; c < m; c++) {
        const comp = allCompounds[c];
        const isReactant = c < pCount;
        const sign = isReactant ? 1 : -1;

        if (rowKey === '__CHARGE__') {
          row.push(new Fraction(comp.charge * sign));
        } else {
          const count = comp.elementCounts[rowKey] || 0;
          row.push(new Fraction(count * sign));
        }
      }
      A.push(row);
    }

    // Generate readable algebraic equations for educational display
    // e.g. Variable names: a, b, c, d, e, f, ...
    const varNames = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const algebraicEquations: string[] = [];

    rowKeys.forEach((key) => {
      const leftParts: string[] = [];
      const rightParts: string[] = [];

      reactants.forEach((comp, idx) => {
        const cnt = key === '__CHARGE__' ? comp.charge : comp.elementCounts[key] || 0;
        if (cnt !== 0) {
          const varName = varNames[idx] || `x${idx + 1}`;
          leftParts.push(cnt === 1 ? varName : `${cnt}${varName}`);
        }
      });

      products.forEach((comp, idx) => {
        const cnt = key === '__CHARGE__' ? comp.charge : comp.elementCounts[key] || 0;
        if (cnt !== 0) {
          const varName = varNames[pCount + idx] || `x${pCount + idx + 1}`;
          rightParts.push(cnt === 1 ? varName : `${cnt}${varName}`);
        }
      });

      const label = key === '__CHARGE__' ? 'Charge' : key;
      algebraicEquations.push(`${label}: ${leftParts.join(' + ') || '0'} = ${rightParts.join(' + ') || '0'}`);
    });

    // Solve for nullspace using Gaussian Elimination over Q
    const coefficients = solveNullspace(A, numRows, m);

    if (!coefficients || coefficients.some((c) => c <= 0n)) {
      return {
        isSuccess: false,
        errorKey: 'NO_POSITIVE_SOLUTION',
        errorMessage: 'Unable to balance equation: no positive integer coefficients exist for this reaction.',
        reactants,
        products,
        reactantCoefficients: [],
        productCoefficients: [],
        fullEquationUnicode: '',
        fullEquationHtml: '',
        elementVerification: [],
        algebraicEquations,
        explanationSteps: [],
        allElements,
      };
    }

    const numCoeffs = coefficients.map((c) => Number(c));
    const reactantCoefficients = numCoeffs.slice(0, pCount);
    const productCoefficients = numCoeffs.slice(pCount);

    // Format full equation
    const fullReactantsUnicode = reactants
      .map((r, i) => `${reactantCoefficients[i] > 1 ? reactantCoefficients[i] : ''}${r.formattedUnicode}`)
      .join(' + ');

    const fullProductsUnicode = products
      .map((p, i) => `${productCoefficients[i] > 1 ? productCoefficients[i] : ''}${p.formattedUnicode}`)
      .join(' + ');

    const fullEquationUnicode = `${fullReactantsUnicode} → ${fullProductsUnicode}`;

    const fullReactantsHtml = reactants
      .map((r, i) => `${reactantCoefficients[i] > 1 ? `<b>${reactantCoefficients[i]}</b>` : ''}${r.formattedHtml}`)
      .join(' + ');

    const fullProductsHtml = products
      .map((p, i) => `${productCoefficients[i] > 1 ? `<b>${productCoefficients[i]}</b>` : ''}${p.formattedHtml}`)
      .join(' + ');

    const fullEquationHtml = `${fullReactantsHtml} &rarr; ${fullProductsHtml}`;

    // Element verification table
    const elementVerification: EquationElementRow[] = allElements.map((el) => {
      let rTotal = 0;
      reactants.forEach((c, idx) => {
        rTotal += (c.elementCounts[el] || 0) * reactantCoefficients[idx];
      });

      let pTotal = 0;
      products.forEach((c, idx) => {
        pTotal += (c.elementCounts[el] || 0) * productCoefficients[idx];
      });

      return {
        symbol: el,
        reactantsTotal: rTotal,
        productsTotal: pTotal,
        isBalanced: rTotal === pTotal,
      };
    });

    // Charge verification if ionic
    if (checkCharges) {
      let rCharge = 0;
      reactants.forEach((c, idx) => {
        rCharge += c.charge * reactantCoefficients[idx];
      });
      let pCharge = 0;
      products.forEach((c, idx) => {
        pCharge += c.charge * productCoefficients[idx];
      });
      elementVerification.push({
        symbol: 'Charge',
        reactantsTotal: rCharge,
        productsTotal: pCharge,
        isBalanced: rCharge === pCharge,
      });
    }

    // Step-by-step explanation
    const explanationSteps: BalanceStep[] = [
      {
        titleKey: 'balancer.steps.identifyCompounds',
        descriptionKey: 'balancer.steps.identifyCompoundsDesc',
        details: [
          `Reactants: ${reactants.map((r, i) => `${varNames[i] || `x${i + 1}`} = ${r.formula}`).join(', ')}`,
          `Products: ${products.map((p, i) => `${varNames[pCount + i] || `x${pCount + i + 1}`} = ${p.formula}`).join(', ')}`,
        ],
      },
      {
        titleKey: 'balancer.steps.conservationSystem',
        descriptionKey: 'balancer.steps.conservationSystemDesc',
        details: algebraicEquations,
      },
      {
        titleKey: 'balancer.steps.solveMatrix',
        descriptionKey: 'balancer.steps.solveMatrixDesc',
        details: [
          `Derived stoichiometric ratio: (${reactantCoefficients.join(' : ')} | ${productCoefficients.join(' : ')})`,
          `Smallest integer solution obtained via Gaussian elimination over rational numbers.`,
        ],
      },
      {
        titleKey: 'balancer.steps.verifyConservation',
        descriptionKey: 'balancer.steps.verifyConservationDesc',
        details: elementVerification.map((v) => `${v.symbol}: ${v.reactantsTotal} = ${v.productsTotal} ✓`),
      },
    ];

    return {
      isSuccess: true,
      reactants,
      products,
      reactantCoefficients,
      productCoefficients,
      fullEquationUnicode,
      fullEquationHtml,
      elementVerification,
      algebraicEquations,
      explanationSteps,
      allElements,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      isSuccess: false,
      errorKey: msg.startsWith('MISSING_') || msg.startsWith('EMPTY_') ? `balancer.errors.${msg}` : undefined,
      errorMessage: msg,
      reactants: [],
      products: [],
      reactantCoefficients: [],
      productCoefficients: [],
      fullEquationUnicode: '',
      fullEquationHtml: '',
      elementVerification: [],
      algebraicEquations: [],
      explanationSteps: [],
      allElements: [],
    };
  }
}

/**
 * Solves A * x = 0 for minimal non-zero positive integer vector x.
 */
function solveNullspace(matrix: Fraction[][], rows: number, cols: number): bigint[] | null {
  // Deep clone matrix
  const A: Fraction[][] = matrix.map((row) => row.map((f) => new Fraction(f.num, f.den)));

  let lead = 0;
  const pivotCols: number[] = [];

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;
    let i = r;

    while (A[i][lead].isZero()) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) break;
      }
    }
    if (lead === cols) break;

    // Swap row i and row r
    const temp = A[i];
    A[i] = A[r];
    A[r] = temp;

    // Divide row r by pivot
    const lv = A[r][lead];
    for (let j = 0; j < cols; j++) {
      A[r][j] = A[r][j].div(lv);
    }

    // Eliminate other rows
    for (let k = 0; k < rows; k++) {
      if (k !== r) {
        const factor = A[k][lead];
        if (!factor.isZero()) {
          for (let j = 0; j < cols; j++) {
            A[k][j] = A[k][j].sub(factor.mul(A[r][j]));
          }
        }
      }
    }

    pivotCols.push(lead);
    lead++;
  }

  // Find free variables
  const isPivotCol = new Array(cols).fill(false);
  pivotCols.forEach((col) => {
    isPivotCol[col] = true;
  });

  const freeCols: number[] = [];
  for (let c = 0; c < cols; c++) {
    if (!isPivotCol[c]) {
      freeCols.push(c);
    }
  }

  // If no free columns, only trivial solution x=0
  if (freeCols.length === 0) {
    return null;
  }

  // Try standard nullspace basis vectors
  // For each free variable, construct nullspace vector:
  // x[freeCol] = 1, other free cols = 0
  // For pivot rows r with pivot col c: x[c] = - sum_{free} A[r][free] * x[free]
  for (const targetFree of freeCols) {
    const solutionFractions: Fraction[] = new Array(cols).fill(new Fraction(0n));
    solutionFractions[targetFree] = new Fraction(1n);

    for (let r = 0; r < pivotCols.length; r++) {
      const pCol = pivotCols[r];
      let sum = new Fraction(0n);
      for (const fCol of freeCols) {
        sum = sum.add(A[r][fCol].mul(solutionFractions[fCol]));
      }
      solutionFractions[pCol] = sum.neg();
    }

    // Check if all fractions have the same sign (or can be inverted)
    const isAllPositive = solutionFractions.every((f) => f.isPositive());
    const isAllNegative = solutionFractions.every((f) => f.isNegative());

    if (isAllPositive || isAllNegative) {
      const adjusted = isAllNegative ? solutionFractions.map((f) => f.neg()) : solutionFractions;
      return fractionsToMinimalIntegers(adjusted);
    }
  }

  // If simple free column basis didn't give all-positive, try combining free columns
  if (freeCols.length > 1) {
    // Search small positive integer weights for free columns (e.g. 1 to 5)
    for (let w1 = 1; w1 <= 5; w1++) {
      for (let w2 = 1; w2 <= 5; w2++) {
        const solutionFractions: Fraction[] = new Array(cols).fill(new Fraction(0n));
        solutionFractions[freeCols[0]] = new Fraction(w1);
        solutionFractions[freeCols[1]] = new Fraction(w2);

        for (let r = 0; r < pivotCols.length; r++) {
          const pCol = pivotCols[r];
          let sum = new Fraction(0n);
          for (const fCol of freeCols) {
            sum = sum.add(A[r][fCol].mul(solutionFractions[fCol]));
          }
          solutionFractions[pCol] = sum.neg();
        }

        if (solutionFractions.every((f) => f.isPositive())) {
          return fractionsToMinimalIntegers(solutionFractions);
        }
      }
    }
  }

  return null;
}

/**
 * Converts array of positive rational fractions into minimal whole positive integers.
 */
function fractionsToMinimalIntegers(fractions: Fraction[]): bigint[] {
  // Find LCM of all denominators
  let totalLcm = 1n;
  fractions.forEach((f) => {
    totalLcm = Fraction.lcm(totalLcm, f.den);
  });

  // Multiply each by LCM to get integers
  const integers: bigint[] = fractions.map((f) => {
    return (f.num * totalLcm) / f.den;
  });

  // Find GCD of all integers
  let totalGcd = integers[0];
  for (let i = 1; i < integers.length; i++) {
    totalGcd = Fraction.gcd(totalGcd, integers[i]);
  }

  if (totalGcd <= 0n) totalGcd = 1n;

  // Reduce
  return integers.map((val) => val / totalGcd);
}
