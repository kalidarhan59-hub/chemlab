import { TaskType } from '../../types/trainer';

/**
 * Normalizes chemical formulas and strings:
 * - strips extra spaces
 * - converts unicode subscripts to standard digits (e.g. H₂SO₄ -> H2SO4)
 * - removes formatting dashes/hyphens
 */
export function normalizeChemicalFormula(input: string): string {
  if (!input) return '';
  const subscripts: Record<string, string> = {
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
  };

  return input
    .replace(/[₀-₉]/g, (ch) => subscripts[ch] || ch)
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Normalizes text response (case-insensitive, trims whitespace).
 */
export function normalizeText(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Checks whether user response matches the correct answer according to task type.
 */
export function checkTaskAnswer(
  type: TaskType,
  userAnswer: any,
  correctAnswer: any,
  tolerance: number = 0.05
): boolean {
  if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
    return false;
  }

  switch (type) {
    case 'single_choice': {
      return Number(userAnswer) === Number(correctAnswer);
    }

    case 'multi_choice': {
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
      if (userAnswer.length !== correctAnswer.length) return false;
      const sortedUser = [...userAnswer].map(Number).sort((a, b) => a - b);
      const sortedCorrect = [...correctAnswer].map(Number).sort((a, b) => a - b);
      return sortedUser.every((val, idx) => val === sortedCorrect[idx]);
    }

    case 'matching': {
      // userAnswer: Record<pairId, selectedOptionId>
      if (typeof userAnswer !== 'object' || typeof correctAnswer !== 'object') return false;
      const keys = Object.keys(correctAnswer);
      if (keys.length === 0) return false;
      return keys.every((k) => String(userAnswer[k]) === String(correctAnswer[k]));
    }

    case 'numeric_input': {
      const parsedUser = parseFloat(String(userAnswer).replace(',', '.'));
      const parsedCorrect = parseFloat(String(correctAnswer));
      if (isNaN(parsedUser) || isNaN(parsedCorrect)) return false;
      const tol = tolerance !== undefined ? tolerance : 0.05;
      return Math.abs(parsedUser - parsedCorrect) <= tol;
    }

    case 'formula_input': {
      const normUser = normalizeChemicalFormula(String(userAnswer));
      const normCorrect = normalizeChemicalFormula(String(correctAnswer));
      return (
        normUser === normCorrect ||
        normalizeText(String(userAnswer)) === normalizeText(String(correctAnswer))
      );
    }

    default:
      return false;
  }
}
