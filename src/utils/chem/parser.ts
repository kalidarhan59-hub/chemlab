import atomicMasses from '../../data/atomicMasses.json';

const KNOWN_ELEMENTS = new Set(Object.keys(atomicMasses));

export interface ParsedCompound {
  raw: string;
  formula: string;
  state?: string;
  charge: number;
  elementCounts: Record<string, number>;
}

export interface ParsedEquation {
  reactants: ParsedCompound[];
  products: ParsedCompound[];
  arrow: string;
}

export type ParseErrorCode =
  | 'EMPTY_INPUT'
  | 'NO_ARROW'
  | 'EMPTY_SIDE'
  | 'UNKNOWN_ELEMENT'
  | 'UNCLOSED_BRACKET'
  | 'MISMATCHED_BRACKET'
  | 'INVALID_SYNTAX'
  | 'INVALID_CHARGE';

export class ChemParseError extends Error {
  code: ParseErrorCode;
  details?: Record<string, string | number>;

  constructor(code: ParseErrorCode, message: string, details?: Record<string, string | number>) {
    super(message);
    this.name = 'ChemParseError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes Unicode subscripts and charges to standard ASCII characters
 */
export function normalizeFormulaInput(str: string): string {
  const subscriptMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  };
  const superscriptMap: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁺': '+', '⁻': '-',
  };

  let res = str;
  for (const [sub, norm] of Object.entries(subscriptMap)) {
    res = res.replaceAll(sub, norm);
  }
  for (const [sup, norm] of Object.entries(superscriptMap)) {
    res = res.replaceAll(sup, `^${norm}`);
  }
  return res;
}

/**
 * Converts a formula string into formatted HTML/Unicode with proper subscripts and superscripts
 */
export function formatFormulaToUnicode(formula: string, coefficient: number = 1): string {
  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  };
  const superscriptMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻',
  };

  const coefStr = coefficient > 1 ? `${coefficient} ` : '';

  // Extract state if present: e.g. "H2O(l)"
  const stateMatch = formula.match(/\((s|l|g|aq|тв|ж|г|р-р)\)$/i);
  let baseFormula = formula;
  let stateStr = '';
  if (stateMatch) {
    baseFormula = formula.slice(0, stateMatch.index);
    stateStr = ` (${stateMatch[1].toLowerCase()})`;
  }

  // Handle charge caret: e.g. Fe^3+ or Fe^+3
  let chargeStr = '';
  const caretIndex = baseFormula.indexOf('^');
  if (caretIndex !== -1) {
    const rawCharge = baseFormula.slice(caretIndex + 1);
    baseFormula = baseFormula.slice(0, caretIndex);
    chargeStr = rawCharge
      .split('')
      .map((c) => superscriptMap[c] || c)
      .join('');
  }

  // Convert numbers in base formula to subscripts (unless preceded by dot/asterisk for hydrate coefficient)
  // Hydrates: CuSO4·5H2O
  const parts = baseFormula.split(/(·|\*)/);
  const formattedParts = parts.map((part) => {
    if (part === '·' || part === '*') return '·';
    // Match leading coefficient in hydrate: e.g. "5H2O"
    const leadNumMatch = part.match(/^(\d+)(.*)$/);
    let lead = '';
    let rest = part;
    if (leadNumMatch) {
      lead = leadNumMatch[1];
      rest = leadNumMatch[2];
    }
    // Turn interior numbers into subscripts
    const subscriptedRest = rest.replace(/([A-Za-z)\]}])(\d+)/g, (_, char, num) => {
      const sub = num.split('').map((d: string) => subscriptMap[d] || d).join('');
      return `${char}${sub}`;
    });
    return lead + subscriptedRest;
  });

  return `${coefStr}${formattedParts.join('')}${chargeStr}${stateStr}`;
}

/**
 * Parses a single chemical formula into an element count dictionary and net charge
 * Handles nested brackets: (), [], {} and hydrates: CuSO4·5H2O
 */
export function parseCompoundFormula(rawInput: string): ParsedCompound {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new ChemParseError('EMPTY_INPUT', 'Formula cannot be empty');
  }

  const normalized = normalizeFormulaInput(trimmed);

  // 1. Extract physical state tag if present at end: e.g. "(g)", "(s)", "(aq)", "(l)"
  let state: string | undefined;
  let workingFormula = normalized;
  const stateRegex = /\((s|l|g|aq|тв|ж|г|р-р)\)$/i;
  const stateMatch = workingFormula.match(stateRegex);
  if (stateMatch) {
    state = stateMatch[1].toLowerCase();
    workingFormula = workingFormula.slice(0, stateMatch.index).trim();
  }

  // 2. Extract ion charge if present: e.g. "^2+", "^+", "^3-", "^-", or suffix "2+", "3-", "+", "-"
  let charge = 0;
  const caretMatch = workingFormula.match(/\^([0-9]*[+-]|[+-][0-9]*)$/);
  if (caretMatch) {
    const rawCharge = caretMatch[1];
    workingFormula = workingFormula.slice(0, caretMatch.index).trim();
    charge = parseChargeString(rawCharge);
  } else {
    // Suffix charge: only if after element/bracket and ends with + or -: e.g. "Fe3+", "SO42-", "Na+", "Cl-"
    const suffixMatch = workingFormula.match(/([0-9]*[+-])$/);
    if (suffixMatch && workingFormula.length > suffixMatch[1].length) {
      // Check it is not a hydrate dot or bracket
      const candidateCharge = suffixMatch[1];
      // Make sure candidate is actual charge and not an element like H+
      charge = parseChargeString(candidateCharge);
      workingFormula = workingFormula.slice(0, suffixMatch.index).trim();
    }
  }

  // 3. Handle hydrates separated by dot or asterisk: e.g. "CuSO4·5H2O", "FeSO4*7H2O", "Na2CO3 . 10H2O"
  const hydrateParts = workingFormula.split(/[·*]|\s*\.\s*(?=\d*[A-Z])/);
  const elementCounts: Record<string, number> = {};

  for (let i = 0; i < hydrateParts.length; i++) {
    const part = hydrateParts[i].trim();
    if (!part) continue;

    // Check if part starts with a multiplier (e.g. 5H2O or 10H2O)
    const multiplierMatch = part.match(/^(\d+)(.+)$/);
    let multiplier = 1;
    let subFormula = part;

    if (multiplierMatch && i > 0) {
      // Multiplier applies to hydrate component
      multiplier = parseInt(multiplierMatch[1], 10);
      subFormula = multiplierMatch[2];
    } else if (multiplierMatch && i === 0) {
      // Leading coefficient in formula: e.g. "2H2O" passed as single compound
      multiplier = parseInt(multiplierMatch[1], 10);
      subFormula = multiplierMatch[2];
    }

    const partCounts = parseBracketGroup(subFormula);
    for (const [el, count] of Object.entries(partCounts)) {
      elementCounts[el] = (elementCounts[el] || 0) + count * multiplier;
    }
  }

  return {
    raw: trimmed,
    formula: workingFormula,
    state,
    charge,
    elementCounts,
  };
}

function parseChargeString(chargeStr: string): number {
  if (chargeStr === '+' || chargeStr === '+1') return 1;
  if (chargeStr === '-' || chargeStr === '-1') return -1;

  if (chargeStr.endsWith('+')) {
    const num = chargeStr.slice(0, -1);
    return num ? parseInt(num, 10) : 1;
  }
  if (chargeStr.endsWith('-')) {
    const num = chargeStr.slice(0, -1);
    return num ? -parseInt(num, 10) : -1;
  }
  if (chargeStr.startsWith('+')) {
    const num = chargeStr.slice(1);
    return num ? parseInt(num, 10) : 1;
  }
  if (chargeStr.startsWith('-')) {
    const num = chargeStr.slice(1);
    return num ? -parseInt(num, 10) : -1;
  }
  return 0;
}

/**
 * Parses nested brackets like Ca(OH)2, [Cu(NH3)4]SO4 using a stack
 */
function parseBracketGroup(formula: string): Record<string, number> {
  const stack: Record<string, number>[] = [{}];
  let i = 0;
  const n = formula.length;

  const bracketPairs: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const openBrackets = new Set(['(', '[', '{']);
  const closeBrackets = new Set([')', ']', '}']);

  while (i < n) {
    const char = formula[i];

    if (openBrackets.has(char)) {
      stack.push({});
      i++;
    } else if (closeBrackets.has(char)) {
      if (stack.length <= 1) {
        throw new ChemParseError('MISMATCHED_BRACKET', `Unexpected closing bracket "${char}" at index ${i}`);
      }
      i++;
      // Parse subscript after closing bracket
      let countStr = '';
      while (i < n && /\d/.test(formula[i])) {
        countStr += formula[i];
        i++;
      }
      const multiplier = countStr ? parseInt(countStr, 10) : 1;
      const closedGroup = stack.pop()!;
      const targetGroup = stack[stack.length - 1];

      for (const [el, count] of Object.entries(closedGroup)) {
        targetGroup[el] = (targetGroup[el] || 0) + count * multiplier;
      }
    } else if (/[A-Z]/.test(char)) {
      // Element symbol starts with capital letter, optional lowercase letter
      let el = char;
      i++;
      if (i < n && /[a-z]/.test(formula[i])) {
        el += formula[i];
        i++;
      }

      if (!KNOWN_ELEMENTS.has(el)) {
        throw new ChemParseError('UNKNOWN_ELEMENT', `Unknown chemical element symbol "${el}"`, { element: el });
      }

      // Parse subscript count after element
      let countStr = '';
      while (i < n && /\d/.test(formula[i])) {
        countStr += formula[i];
        i++;
      }
      const count = countStr ? parseInt(countStr, 10) : 1;
      const currentGroup = stack[stack.length - 1];
      currentGroup[el] = (currentGroup[el] || 0) + count;
    } else if (/\s/.test(char)) {
      i++; // Skip whitespace
    } else {
      throw new ChemParseError('INVALID_SYNTAX', `Invalid character "${char}" at index ${i}`);
    }
  }

  if (stack.length !== 1) {
    throw new ChemParseError('UNCLOSED_BRACKET', 'Unclosed bracket in formula');
  }

  return stack[0];
}

/**
 * Splits a full equation string (e.g. "H2 + O2 -> H2O") into reactant and product compounds
 */
export function parseChemicalEquation(equationStr: string): ParsedEquation {
  const trimmed = equationStr.trim();
  if (!trimmed) {
    throw new ChemParseError('EMPTY_INPUT', 'Equation string is empty');
  }

  // Find equation arrow: ->, →, =, =>, ==>, <=>, ⇌
  const arrowRegex = /(=>|==>|->|→|<=>|⇌|=)/;
  const match = trimmed.match(arrowRegex);
  if (!match || match.index === undefined) {
    throw new ChemParseError('NO_ARROW', 'Equation must contain reaction arrow (-> or =)');
  }

  const arrow = match[0];
  const leftStr = trimmed.slice(0, match.index).trim();
  const rightStr = trimmed.slice(match.index + arrow.length).trim();

  if (!leftStr || !rightStr) {
    throw new ChemParseError('EMPTY_SIDE', 'Both left and right sides of equation must contain compounds');
  }

  const splitByPlus = (str: string): string[] => {
    return str
      .split(/\+(?![0-9]*[A-Za-z\^])/) // Don't split on charge plus like Fe^3+
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const leftParts = splitByPlus(leftStr);
  const rightParts = splitByPlus(rightStr);

  const reactants = leftParts.map((p) => parseCompoundFormula(p));
  const products = rightParts.map((p) => parseCompoundFormula(p));

  return { reactants, products, arrow };
}
