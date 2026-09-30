import { Rational, lcmBigInt, gcdBigInt } from './rational';
import { parseChemicalEquation, formatFormulaToUnicode, ParsedCompound } from './parser';
import { Language } from '../../types';

export interface BalanceStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface AtomBalanceRow {
  element: string;
  leftCountBefore: number;
  rightCountBefore: number;
  leftCountAfter: number;
  rightCountAfter: number;
  isBalanced: boolean;
}

export interface BalanceResultData {
  success: boolean;
  status: 'BALANCED' | 'NO_SOLUTION' | 'UNDERDETERMINED' | 'ERROR';
  errorMessage?: string;
  formattedEquation: string;
  latexEquation: string;
  plainEquation: string;
  reactantCoefficients: number[];
  productCoefficients: number[];
  atomTable: AtomBalanceRow[];
  steps: BalanceStep[];
}

/**
 * Solves a chemical equation using exact rational Gauss-Jordan elimination on the null-space
 */
export function balanceChemicalEquation(equationStr: string, lang: Language = 'kk'): BalanceResultData {
  try {
    const parsed = parseChemicalEquation(equationStr);
    const { reactants, products } = parsed;

    // Collect all unique elements
    const elementSet = new Set<string>();
    reactants.forEach((r) => Object.keys(r.elementCounts).forEach((el) => elementSet.add(el)));
    products.forEach((p) => Object.keys(p.elementCounts).forEach((el) => elementSet.add(el)));

    const elements = Array.from(elementSet);
    const allCompounds = [...reactants, ...products];
    const numCompounds = allCompounds.length;
    const numReactants = reactants.length;

    // Verify each element appears on both sides
    const leftElements = new Set<string>();
    reactants.forEach((r) => Object.keys(r.elementCounts).forEach((el) => leftElements.add(el)));
    const rightElements = new Set<string>();
    products.forEach((p) => Object.keys(p.elementCounts).forEach((el) => rightElements.add(el)));

    for (const el of elements) {
      if (!leftElements.has(el)) {
        return createErrorResult(
          'NO_SOLUTION',
          getLocalizedMsg(lang, {
            kk: `«${el}» элементі тек оң жақта бар, бірақ сол жақтағы реагенттерде жоқ.`,
            ru: `Элемент «${el}» присутствует справа, но отсутствует в реагентах слева.`,
            en: `Element "${el}" is present on the right side, but missing in reactants on the left.`,
          })
        );
      }
      if (!rightElements.has(el)) {
        return createErrorResult(
          'NO_SOLUTION',
          getLocalizedMsg(lang, {
            kk: `«${el}» элементі тек сол жақта бар, бірақ өнімдерде жоқ.`,
            ru: `Элемент «${el}» присутствует слева, но отсутствует в продуктах справа.`,
            en: `Element "${el}" is present on the left side, but missing in products on the right.`,
          })
        );
      }
    }

    // Check if charges are present in any compound
    const hasCharges = allCompounds.some((c) => c.charge !== 0);

    // Build the system matrix: elements rows + optional charge row
    // Each reactant contributes +count, each product contributes -count
    const rowsCount = elements.length + (hasCharges ? 1 : 0);
    const matrix: Rational[][] = [];

    // Element rows
    for (let r = 0; r < elements.length; r++) {
      const el = elements[r];
      const row: Rational[] = [];
      for (let c = 0; c < numCompounds; c++) {
        const count = allCompounds[c].elementCounts[el] || 0;
        const sign = c < numReactants ? 1 : -1;
        row.push(new Rational(sign * count));
      }
      matrix.push(row);
    }

    // Charge row if needed
    if (hasCharges) {
      const chargeRow: Rational[] = [];
      for (let c = 0; c < numCompounds; c++) {
        const q = allCompounds[c].charge;
        const sign = c < numReactants ? 1 : -1;
        chargeRow.push(new Rational(sign * q));
      }
      matrix.push(chargeRow);
    }

    // Perform Gauss-Jordan elimination on rational matrix
    const rref = computeRREF(matrix, rowsCount, numCompounds);

    // Find the null-space basis
    const nullSpace = computeNullSpace(rref, rowsCount, numCompounds);

    if (nullSpace.length === 0) {
      return createErrorResult(
        'NO_SOLUTION',
        getLocalizedMsg(lang, {
          kk: 'Бұл теңдеуді математикалық және химиялық түрде теңдестіру мүмкін емес (шешімі жоқ).',
          ru: 'Данное уравнение невозможно сбалансировать (нет математического решения).',
          en: 'This chemical equation cannot be balanced (no non-trivial solution exists).',
        })
      );
    }

    if (nullSpace.length > 1) {
      // Check if we can find a strictly positive vector, else underdetermined
      const candidate = findPositiveCombination(nullSpace);
      if (!candidate) {
        return createErrorResult(
          'UNDERDETERMINED',
          getLocalizedMsg(lang, {
            kk: 'Теңдеуде бірнеше тәуелсіз реакция қатар жүріп жатыр (бірнеше мүмкін шешім бар).',
            ru: 'Уравнение описывает несколько независимых параллельных реакций (бесконечно много решений).',
            en: 'The equation contains multiple independent parallel reactions (system is underdetermined).',
          })
        );
      }
    }

    // Single null-space vector
    const basis = nullSpace[0];

    // Check that all components have the same sign and non-zero
    let allPos = true;
    let allNeg = true;
    for (let i = 0; i < basis.length; i++) {
      if (basis[i].isZero()) {
        allPos = false;
        allNeg = false;
        break;
      }
      if (basis[i].isNegative()) allPos = false;
      if (basis[i].isPositive()) allNeg = false;
    }

    if (!allPos && !allNeg) {
      return createErrorResult(
        'NO_SOLUTION',
        getLocalizedMsg(lang, {
          kk: 'Реагенттер мен өнімдердің зат алмасу бағыты дұрыс емес (теріс коэффициенттер шығады).',
          ru: 'Невозможно сбалансировать: реагенты и продукты не могут превращаться друг в друга в указанном направлении.',
          en: 'Cannot be balanced: reactants and products cannot transform in the indicated direction.',
        })
      );
    }

    // Normalize so all are positive
    const positiveBasis = allNeg ? basis.map((r) => r.negate()) : basis;

    // Convert rational vector to smallest positive integers
    // 1. Find LCM of all denominators
    let commonDen = 1n;
    for (const r of positiveBasis) {
      commonDen = lcmBigInt(commonDen, r.den);
    }

    // 2. Multiply each numerator by (commonDen / r.den)
    const integerCoeffs: bigint[] = positiveBasis.map((r) => r.num * (commonDen / r.den));

    // 3. Divide all by their GCD
    let commonGcd = integerCoeffs[0];
    for (let i = 1; i < integerCoeffs.length; i++) {
      commonGcd = gcdBigInt(commonGcd, integerCoeffs[i]);
    }

    const finalCoeffs = integerCoeffs.map((n) => Number(n / commonGcd));
    const reactantCoeffs = finalCoeffs.slice(0, numReactants);
    const productCoeffs = finalCoeffs.slice(numReactants);

    // Formatted equations
    const formattedReactants = reactants.map((r, i) => formatFormulaToUnicode(r.raw, reactantCoeffs[i])).join(' + ');
    const formattedProducts = products.map((p, i) => formatFormulaToUnicode(p.raw, productCoeffs[i])).join(' + ');
    const formattedEquation = `${formattedReactants} → ${formattedProducts}`;

    const plainReactants = reactants.map((r, i) => `${reactantCoeffs[i] > 1 ? reactantCoeffs[i] + ' ' : ''}${r.raw}`).join(' + ');
    const plainProducts = products.map((p, i) => `${productCoeffs[i] > 1 ? productCoeffs[i] + ' ' : ''}${p.raw}`).join(' + ');
    const plainEquation = `${plainReactants} -> ${plainProducts}`;

    const latexEquation = generateLatex(reactants, products, reactantCoeffs, productCoeffs);

    // Build Atom Balance Table
    const atomTable: AtomBalanceRow[] = elements.map((el) => {
      let leftBefore = 0;
      let rightBefore = 0;
      let leftAfter = 0;
      let rightAfter = 0;

      reactants.forEach((r, idx) => {
        const c = r.elementCounts[el] || 0;
        leftBefore += c;
        leftAfter += c * reactantCoeffs[idx];
      });

      products.forEach((p, idx) => {
        const c = p.elementCounts[el] || 0;
        rightBefore += c;
        rightAfter += c * productCoeffs[idx];
      });

      return {
        element: el,
        leftCountBefore: leftBefore,
        rightCountBefore: rightBefore,
        leftCountAfter: leftAfter,
        rightCountAfter: rightAfter,
        isBalanced: leftAfter === rightAfter,
      };
    });

    // Generate Step-by-Step Educational Explanation
    const steps = generateStepExplanation(reactants, products, elements, reactantCoeffs, productCoeffs, atomTable, lang);

    return {
      success: true,
      status: 'BALANCED',
      formattedEquation,
      latexEquation,
      plainEquation,
      reactantCoefficients: reactantCoeffs,
      productCoefficients: productCoeffs,
      atomTable,
      steps,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return createErrorResult('ERROR', msg);
  }
}

function computeRREF(matrix: Rational[][], rows: number, cols: number): Rational[][] {
  const m = matrix.map((row) => row.map((val) => new Rational(val.num, val.den)));
  let lead = 0;

  for (let r = 0; r < rows; r++) {
    if (lead >= cols) break;
    let i = r;
    while (m[i][lead].isZero()) {
      i++;
      if (i === rows) {
        i = r;
        lead++;
        if (lead === cols) return m;
      }
    }

    // Swap row i and row r
    const temp = m[i];
    m[i] = m[r];
    m[r] = temp;

    // Normalize row r by its lead element
    const pivot = m[r][lead];
    for (let c = 0; c < cols; c++) {
      m[r][c] = m[r][c].div(pivot);
    }

    // Eliminate other rows
    for (let j = 0; j < rows; j++) {
      if (j !== r) {
        const factor = m[j][lead];
        if (!factor.isZero()) {
          for (let c = 0; c < cols; c++) {
            m[j][c] = m[j][c].sub(factor.mul(m[r][c]));
          }
        }
      }
    }
    lead++;
  }

  return m;
}

function computeNullSpace(rref: Rational[][], rows: number, cols: number): Rational[][] {
  const pivotCols: number[] = [];
  const pivotRowForCol = new Map<number, number>();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!rref[r][c].isZero()) {
        pivotCols.push(c);
        pivotRowForCol.set(c, r);
        break;
      }
    }
  }

  const freeCols: number[] = [];
  const pivotSet = new Set(pivotCols);
  for (let c = 0; c < cols; c++) {
    if (!pivotSet.has(c)) {
      freeCols.push(c);
    }
  }

  const basisVectors: Rational[][] = [];

  for (const freeCol of freeCols) {
    const vector: Rational[] = Array.from({ length: cols }, () => Rational.zero());
    vector[freeCol] = Rational.one();

    for (const pivotCol of pivotCols) {
      const row = pivotRowForCol.get(pivotCol)!;
      vector[pivotCol] = rref[row][freeCol].negate();
    }
    basisVectors.push(vector);
  }

  return basisVectors;
}

function findPositiveCombination(nullSpace: Rational[][]): Rational[] | null {
  // If only 1 vector, check directly
  if (nullSpace.length === 1) return nullSpace[0];
  // Simple check if sum is all positive
  const cols = nullSpace[0].length;
  const sum: Rational[] = Array.from({ length: cols }, () => Rational.zero());
  for (const vec of nullSpace) {
    for (let i = 0; i < cols; i++) {
      sum[i] = sum[i].add(vec[i]);
    }
  }
  if (sum.every((v) => v.isPositive())) return sum;
  return null;
}

function generateLatex(
  reactants: ParsedCompound[],
  products: ParsedCompound[],
  rCoeffs: number[],
  pCoeffs: number[]
): string {
  const formatComp = (c: ParsedCompound, coef: number) => {
    const prefix = coef > 1 ? `${coef} ` : '';
    let form = c.formula.replace(/([0-9]+)/g, '_{$1}');
    if (c.charge !== 0) {
      const q = c.charge > 0 ? (c.charge === 1 ? '+' : `${c.charge}+`) : (c.charge === -1 ? '-' : `${-c.charge}-`);
      form = `{${form}}^{${q}}`;
    }
    const state = c.state ? `\\text{ (${c.state})}` : '';
    return `${prefix}\\text{${form}}${state}`;
  };

  const left = reactants.map((r, i) => formatComp(r, rCoeffs[i])).join(' + ');
  const right = products.map((p, i) => formatComp(p, pCoeffs[i])).join(' + ');
  return `${left} \\rightarrow ${right}`;
}

function generateStepExplanation(
  reactants: ParsedCompound[],
  products: ParsedCompound[],
  elements: string[],
  rCoeffs: number[],
  pCoeffs: number[],
  atomTable: AtomBalanceRow[],
  lang: Language
): BalanceStep[] {
  const steps: BalanceStep[] = [];

  // Step 1: Decomposition of equation
  steps.push({
    stepNumber: 1,
    title: getLocalizedMsg(lang, {
      kk: '1-қадам: Қосылыстар мен химиялық элементтерді анықтау',
      ru: 'Шаг 1: Определение исходных веществ, продуктов и элементов',
      en: 'Step 1: Identifying reactants, products, and constituent elements',
    }),
    description: getLocalizedMsg(lang, {
      kk: `Реакцияға түскен бастапқы заттар: ${reactants.map((r) => r.formula).join(', ')}. Түзілген өнімдер: ${products.map((p) => p.formula).join(', ')}. Қатысатын бірегей элементтер саны: ${elements.length} (${elements.join(', ')}).`,
      ru: `Исходные вещества (реагенты): ${reactants.map((r) => r.formula).join(', ')}. Продукты реакции: ${products.map((p) => p.formula).join(', ')}. Уникальные химические элементы: ${elements.join(', ')}.`,
      en: `Reactants: ${reactants.map((r) => r.formula).join(', ')}. Products: ${products.map((p) => p.formula).join(', ')}. Unique chemical elements: ${elements.join(', ')}.`,
    }),
  });

  // Step 2: Counting atoms before balance
  const imbalanceElements = atomTable.filter((row) => row.leftCountBefore !== row.rightCountBefore);
  steps.push({
    stepNumber: 2,
    title: getLocalizedMsg(lang, {
      kk: '2-қадам: Бастапқы атомдар санын салыстыру',
      ru: 'Шаг 2: Анализ баланса атомов до расстановки коэффициентов',
      en: 'Step 2: Counting atom quantities before balancing',
    }),
    description: getLocalizedMsg(lang, {
      kk: imbalanceElements.length === 0
        ? 'Теңдеудегі барлық атомдар бастапқыда-ақ тең түскен.'
        : `Теңгерілмеген элементтер: ${imbalanceElements.map((e) => `${e.element} (Сол жақта: ${e.leftCountBefore}, Оң жақта: ${e.rightCountBefore})`).join('; ')}. Зат массасының сақталу заңы бойынша екі жақтағы атомдар саны бірдей болуы шарт.`,
      ru: imbalanceElements.length === 0
        ? 'Уравнение уже изначально сбалансировано.'
        : `Несбалансированные элементы: ${imbalanceElements.map((e) => `${e.element} (слева: ${e.leftCountBefore}, справа: ${e.rightCountBefore})`).join('; ')}. По закону сохранения массы количества атомов каждого элемента слева и справа должны совпадать.`,
      en: imbalanceElements.length === 0
        ? 'The equation is already balanced as written.'
        : `Imbalanced elements: ${imbalanceElements.map((e) => `${e.element} (left: ${e.leftCountBefore}, right: ${e.rightCountBefore})`).join('; ')}. The law of conservation of mass mandates identical atom totals on both sides.`,
    }),
  });

  // Step 3: Coefficient deduction
  steps.push({
    stepNumber: 3,
    title: getLocalizedMsg(lang, {
      kk: '3-қадам: Стехиометриялық коэффициенттерді матрицалық әдіспен есептеу',
      ru: 'Шаг 3: Математический расчёт минимальных целых коэффициентов',
      en: 'Step 3: Calculating stoichiometric coefficients using linear algebra',
    }),
    description: getLocalizedMsg(lang, {
      kk: `Гаусс-Жордан алгоритмі арқылы бөлшектерден құтылып, ең кіші бүтін оң сандар таңдалды: Реагенттер үшін: [${rCoeffs.join(', ')}], Өнімдер үшін: [${pCoeffs.join(', ')}].`,
      ru: `Методом Гаусса-Жордана на рациональных дробях найдено точное решение однородной системы с наименьшими натуральными коэффициентами: реагенты — [${rCoeffs.join(', ')}], продукты — [${pCoeffs.join(', ')}].`,
      en: `Applying Gauss-Jordan elimination on rational numbers yields the minimal positive integer coefficients: reactants — [${rCoeffs.join(', ')}], products — [${pCoeffs.join(', ')}].`,
    }),
  });

  // Step 4: Final verification
  steps.push({
    stepNumber: 4,
    title: getLocalizedMsg(lang, {
      kk: '4-қадам: Түпкілікті тексеру және масса сақталу заңы',
      ru: 'Шаг 4: Итоговая верификация и подтверждение баланса',
      en: 'Step 4: Final verification and confirmation',
    }),
    description: getLocalizedMsg(lang, {
      kk: `Барлық ${elements.length} элементтің атомдар саны екі жақта да толық сәйкес келді (${atomTable.map((e) => `${e.element}: ${e.leftCountAfter}=${e.rightCountAfter}`).join(', ')}). Теңдеу дұрыс теңестірілді!`,
      ru: `Количество атомов всех ${elements.length} элементов строго совпадает слева и справа (${atomTable.map((e) => `${e.element}: ${e.leftCountAfter}=${e.rightCountAfter}`).join(', ')}). Уравнение полностью сбалансировано!`,
      en: `Atom counts for all ${elements.length} elements match precisely (${atomTable.map((e) => `${e.element}: ${e.leftCountAfter}=${e.rightCountAfter}`).join(', ')}). The equation is fully balanced!`,
    }),
  });

  return steps;
}

function getLocalizedMsg(lang: Language, msgs: Record<Language, string>): string {
  return msgs[lang] || msgs.ru;
}

function createErrorResult(status: BalanceResultData['status'], errorMessage: string): BalanceResultData {
  return {
    success: false,
    status,
    errorMessage,
    formattedEquation: '',
    latexEquation: '',
    plainEquation: '',
    reactantCoefficients: [],
    productCoefficients: [],
    atomTable: [],
    steps: [],
  };
}
