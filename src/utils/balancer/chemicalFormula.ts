import atomicMassesData from '../../data/atomicMasses.json';

const ATOMIC_MASSES: Record<string, number> = atomicMassesData as Record<string, number>;

export interface ElementBreakdownItem {
  symbol: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  massPercent: number;
}

export interface ParsedCompound {
  raw: string;
  coefficient: number;
  formula: string;
  elementCounts: Record<string, number>;
  charge: number;
  molarMass: number;
  breakdown: ElementBreakdownItem[];
  formattedUnicode: string;
  formattedHtml: string;
}

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
};

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻'
};

/**
 * Converts a raw chemical formula string into a Unicode formatted string with subscripts and superscripts.
 */
export function formatToUnicode(formula: string): string {
  // Convert * or · to ·
  let res = formula.replace(/[*·]/g, '·');

  // Handle charge in braces like {2+} or ^{2+} or ^2+
  res = res.replace(/\^?\{([0-9+-]+)\}/g, (_, charge) => {
    return charge.split('').map((c: string) => SUPERSCRIPTS[c] || c).join('');
  });

  // Handle caret charges like ^2+ or ^+
  res = res.replace(/\^([0-9]*[+-])/g, (_, charge) => {
    return charge.split('').map((c: string) => SUPERSCRIPTS[c] || c).join('');
  });

  // Handle trailing simple charge after letters or numbers (e.g. Fe3+, SO42-, H+, Cl-)
  res = res.replace(/([A-Za-z)\]])([0-9]+)?([+-])/g, (_, prev, num, sign) => {
    const chargeStr = (num || '') + sign;
    const sup = chargeStr.split('').map((c: string) => SUPERSCRIPTS[c] || c).join('');
    return prev + sup;
  });

  // Handle remaining numbers after letters, close brackets/parens, or dot:
  // e.g. H2O -> H₂O, but not hydrate multiplier like ·5H2O where 5 is before H
  res = res.replace(/([A-Za-z)\]])([0-9]+)/g, (_, char, num) => {
    const sub = num.split('').map((c: string) => SUBSCRIPTS[c] || c).join('');
    return char + sub;
  });

  return res;
}

/**
 * Converts a formula string into safe HTML with <sub> and <sup> tags.
 */
export function formatToHtml(formula: string): string {
  let str = formula.replace(/[*·]/g, '&middot;');

  // Replace explicit charge notation {2+}
  str = str.replace(/\^?\{([0-9+-]+)\}/g, '<sup>$1</sup>');

  // Replace trailing charges like Fe3+ or SO42- or H+
  str = str.replace(/([A-Za-z)\]])([0-9]*[+-])/g, '$1<sup>$2</sup>');

  // Replace chemical subscripts
  str = str.replace(/([A-Za-z)\]])([0-9]+)/g, '$1<sub>$2</sub>');

  return str;
}

/**
 * Tokenizes and parses a single chemical formula into element counts and net charge.
 * Handles:
 * - Parentheses: (NH4)2SO4
 * - Square brackets: K4[Fe(CN)6]
 * - Hydrates: CuSO4*5H2O or CuSO4·5H2O
 * - Charges: Fe3+, Fe{3+}, Fe^3+, SO4{2-}, SO42-, OH-
 */
export function parseCompound(rawInput: string): ParsedCompound {
  let trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Compound string is empty');
  }

  // Extract leading user coefficient if typed (e.g. "2 H2O" or "3Ca(OH)2")
  const coeffMatch = trimmed.match(/^([0-9]+)\s*(.*)$/);
  let coefficient = 1;
  let formula = trimmed;

  if (coeffMatch && coeffMatch[2]) {
    coefficient = parseInt(coeffMatch[1], 10);
    formula = coeffMatch[2].trim();
  }

  // Check for hydrate (split by * or ·)
  const hydrateParts = formula.split(/[*·]/);
  const totalCounts: Record<string, number> = {};
  let netCharge = 0;

  hydrateParts.forEach((part, partIndex) => {
    let p = part.trim();
    if (!p) return;

    let partMultiplier = 1;
    // For hydrate parts after the first (e.g. 5H2O)
    if (partIndex > 0) {
      const partCoeffMatch = p.match(/^([0-9]+)\s*(.*)$/);
      if (partCoeffMatch && partCoeffMatch[2]) {
        partMultiplier = parseInt(partCoeffMatch[1], 10);
        p = partCoeffMatch[2].trim();
      }
    }

    const { counts, charge } = parseSingleFormula(p);
    netCharge += charge * partMultiplier;

    for (const [elem, cnt] of Object.entries(counts)) {
      totalCounts[elem] = (totalCounts[elem] || 0) + cnt * partMultiplier;
    }
  });

  // Calculate molar mass and breakdown
  let molarMass = 0;
  const breakdown: ElementBreakdownItem[] = [];

  for (const [symbol, count] of Object.entries(totalCounts)) {
    const atomicMass = ATOMIC_MASSES[symbol] || 0;
    const totalMass = atomicMass * count;
    molarMass += totalMass;
    breakdown.push({
      symbol,
      count,
      atomicMass,
      totalMass,
      massPercent: 0, // computed below once total is known
    });
  }

  // Sort breakdown by count/mass
  breakdown.sort((a, b) => b.totalMass - a.totalMass);

  // Compute mass percents
  if (molarMass > 0) {
    breakdown.forEach((item) => {
      item.massPercent = Number(((item.totalMass / molarMass) * 100).toFixed(2));
    });
  }

  return {
    raw: rawInput,
    coefficient,
    formula,
    elementCounts: totalCounts,
    charge: netCharge,
    molarMass: Number(molarMass.toFixed(3)),
    breakdown,
    formattedUnicode: formatToUnicode(formula),
    formattedHtml: formatToHtml(formula),
  };
}

/**
 * Parses a single formula part without hydrate multiplier.
 */
function parseSingleFormula(input: string): { counts: Record<string, number>; charge: number } {
  let str = input;
  let charge = 0;

  // Extract explicit charge like {2+}, {3-}, ^2+, ^-, 2+, 3-, +, -
  // Case 1: {...}
  const braceCharge = str.match(/\{([0-9]*)([+-])\}$/);
  if (braceCharge) {
    const val = braceCharge[1] ? parseInt(braceCharge[1], 10) : 1;
    charge = braceCharge[2] === '-' ? -val : val;
    str = str.replace(/\{[0-9]*[+-]\}$/, '');
  } else {
    // Case 2: ^{...}
    const caretBrace = str.match(/\^\{([0-9]*)([+-])\}$/);
    if (caretBrace) {
      const val = caretBrace[1] ? parseInt(caretBrace[1], 10) : 1;
      charge = caretBrace[2] === '-' ? -val : val;
      str = str.replace(/\^\{[0-9]*[+-]\}$/, '');
    } else {
      // Case 3: ^2+ or ^+
      const caretCharge = str.match(/\^([0-9]*)([+-])$/);
      if (caretCharge) {
        const val = caretCharge[1] ? parseInt(caretCharge[1], 10) : 1;
        charge = caretCharge[2] === '-' ? -val : val;
        str = str.replace(/\^[0-9]*[+-]$/, '');
      } else {
        // Case 4: trailing 2+, 3-, +, - at end of formula
        const trailingCharge = str.match(/([0-9]*)([+-])$/);
        if (trailingCharge) {
          const val = trailingCharge[1] ? parseInt(trailingCharge[1], 10) : 1;
          charge = trailingCharge[2] === '-' ? -val : val;
          str = str.replace(/([0-9]*)[+-]$/, '');
        }
      }
    }
  }

  // Parse nested parentheses/brackets with stack
  const stack: Record<string, number>[] = [{}];
  let i = 0;
  const n = str.length;

  while (i < n) {
    const char = str[i];

    if (char === '(' || char === '[' || char === '{') {
      stack.push({});
      i++;
    } else if (char === ')' || char === ']' || char === '}') {
      i++;
      // Check for index after closing bracket
      let numStr = '';
      while (i < n && /[0-9]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      const multiplier = numStr ? parseInt(numStr, 10) : 1;
      const closed = stack.pop();
      if (!closed) {
        throw new Error(`Unmatched closing bracket in "${input}"`);
      }
      const current = stack[stack.length - 1];
      for (const [el, cnt] of Object.entries(closed)) {
        current[el] = (current[el] || 0) + cnt * multiplier;
      }
    } else if (/[A-Z]/.test(char)) {
      // Element symbol start: Capital letter, possibly followed by lowercase letters
      let sym = char;
      i++;
      while (i < n && /[a-z]/.test(str[i])) {
        sym += str[i];
        i++;
      }
      // Check for count
      let numStr = '';
      while (i < n && /[0-9]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      const count = numStr ? parseInt(numStr, 10) : 1;
      const current = stack[stack.length - 1];
      current[sym] = (current[sym] || 0) + count;
    } else if (char === ' ' || char === '\t') {
      i++;
    } else {
      throw new Error(`Unexpected character "${char}" at index ${i} in formula "${input}"`);
    }
  }

  if (stack.length !== 1) {
    throw new Error(`Unclosed parenthesis/bracket in "${input}"`);
  }

  return { counts: stack[0], charge };
}
