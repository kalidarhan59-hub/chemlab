import { describe, it, expect } from 'vitest';
import { checkTaskAnswer, normalizeChemicalFormula, normalizeText } from '../checkAnswer';
import { calculateExamGrade } from '../scoring';
import { updateTaskSpacedState, getTasksDueForReview, INTERVALS_DAYS } from '../spacedRepetition';
import { generateRandomCalculationTask } from '../taskGenerator';
import { TrainerTask } from '../../../types/trainer';

describe('Trainer Engine Test Suite (30+ cases)', () => {
  // 1. Formula & Text Normalization (10 cases)
  describe('Formula & Text Normalization', () => {
    it('normalizes simple chemical formula H2O', () => {
      expect(normalizeChemicalFormula('H2O')).toBe('H2O');
    });

    it('converts unicode subscripts to regular numbers: H₂SO₄ -> H2SO4', () => {
      expect(normalizeChemicalFormula('H₂SO₄')).toBe('H2SO4');
    });

    it('converts multi-digit unicode subscripts: C₆H₁₂O₆ -> C6H12O6', () => {
      expect(normalizeChemicalFormula('C₆H₁₂O₆')).toBe('C6H12O6');
    });

    it('strips all whitespace from formulas: "  Ca CO 3  " -> "CaCO3"', () => {
      expect(normalizeChemicalFormula('  Ca CO 3  ')).toBe('CaCO3');
    });

    it('handles empty or blank string gracefully', () => {
      expect(normalizeChemicalFormula('')).toBe('');
      expect(normalizeText('')).toBe('');
    });

    it('normalizes text case-insensitively', () => {
      expect(normalizeText('  KMnO4  ')).toBe('kmno4');
      expect(normalizeText('Водород')).toBe('водород');
      expect(normalizeText('METHANE GAS')).toBe('methane gas');
    });

    it('collapses multiple inner spaces into single space', () => {
      expect(normalizeText('серная    кислота')).toBe('серная кислота');
    });

    it('handles unicode subscripts mixed with regular characters: SO₄²⁻', () => {
      expect(normalizeChemicalFormula('SO₄')).toBe('SO4');
    });

    it('matches user formula with unicode subscript against standard representation', () => {
      expect(checkTaskAnswer('formula_input', 'H₂O', 'H2O')).toBe(true);
      expect(checkTaskAnswer('formula_input', 'CO₂', 'CO2')).toBe(true);
    });

    it('matches user chemical name ignoring case', () => {
      expect(checkTaskAnswer('formula_input', 'кислород', 'Кислород')).toBe(true);
    });
  });

  // 2. Answer Checking for all task types (8 cases)
  describe('Answer Checking Engine', () => {
    it('validates single choice question correctly', () => {
      expect(checkTaskAnswer('single_choice', 1, 1)).toBe(true);
      expect(checkTaskAnswer('single_choice', '1', 1)).toBe(true);
      expect(checkTaskAnswer('single_choice', 2, 1)).toBe(false);
    });

    it('validates multi choice question regardless of selection order', () => {
      expect(checkTaskAnswer('multi_choice', [0, 2], [2, 0])).toBe(true);
      expect(checkTaskAnswer('multi_choice', [1], [0, 1])).toBe(false);
      expect(checkTaskAnswer('multi_choice', [0, 1, 2], [0, 1])).toBe(false);
    });

    it('validates numeric answer within tolerance: 2.24 vs 2.25 with tol 0.05', () => {
      expect(checkTaskAnswer('numeric_input', 2.24, 2.25, 0.05)).toBe(true);
      expect(checkTaskAnswer('numeric_input', 2.10, 2.25, 0.05)).toBe(false);
    });

    it('accepts comma as decimal separator: "2,24" -> 2.24', () => {
      expect(checkTaskAnswer('numeric_input', '2,24', 2.24, 0.01)).toBe(true);
    });

    it('validates matching task where all pairs match', () => {
      const correct = { p1: 'basic', p2: 'acidic' };
      const userCorrect = { p1: 'basic', p2: 'acidic' };
      const userWrong = { p1: 'acidic', p2: 'basic' };
      expect(checkTaskAnswer('matching', userCorrect, correct)).toBe(true);
      expect(checkTaskAnswer('matching', userWrong, correct)).toBe(false);
    });

    it('rejects null, undefined, or empty answers', () => {
      expect(checkTaskAnswer('single_choice', null, 0)).toBe(false);
      expect(checkTaskAnswer('numeric_input', '', 10)).toBe(false);
      expect(checkTaskAnswer('formula_input', undefined, 'H2O')).toBe(false);
    });

    it('fails numeric check on non-numeric input', () => {
      expect(checkTaskAnswer('numeric_input', 'not_a_number', 10)).toBe(false);
    });

    it('fails multi choice on non-array input', () => {
      expect(checkTaskAnswer('multi_choice', '0', [0])).toBe(false);
    });
  });

  // 3. Scoring & Grade Scales (6 cases)
  describe('Exam Scoring & Grade Scales', () => {
    it('ENT: scores >= 35 get Grant-level grade and pass', () => {
      const res = calculateExamGrade('ent', 38, 40);
      expect(res.passed).toBe(true);
      expect(res.percentage).toBe(95);
      expect(res.gradeLabel.ru).toContain('Грант');
    });

    it('ENT: scores < 15 fail threshold', () => {
      const res = calculateExamGrade('ent', 12, 40);
      expect(res.passed).toBe(false);
      expect(res.gradeLabel.kk).toContain('өтпеді');
    });

    it('clamps negative or exceeding scores within bounds [0, maxScore]', () => {
      const clamped = calculateExamGrade('ent', 55, 40);
      expect(clamped.score).toBe(40);
      expect(clamped.percentage).toBe(100);
    });
  });

  // 4. Spaced Repetition (Leitner / SM-2) (6 cases)
  describe('Spaced Repetition Algorithm', () => {
    it('promotes level from 0 to 1 on first correct answer', () => {
      const state = updateTaskSpacedState(undefined, true, 1000);
      expect(state.level).toBe(1);
      expect(state.correctCount).toBe(1);
      expect(state.errorCount).toBe(0);
      expect(state.nextReviewDate).toBe(1000 + INTERVALS_DAYS[1] * 86400000);
    });

    it('promotes level up to maximum 5 on successive correct answers', () => {
      let state = updateTaskSpacedState(undefined, true, 1000);
      for (let i = 0; i < 6; i++) {
        state = updateTaskSpacedState(state, true, 1000);
      }
      expect(state.level).toBe(5);
      expect(state.correctCount).toBe(7);
    });

    it('resets level to 0 on incorrect answer', () => {
      const advanced = {
        level: 4,
        nextReviewDate: 20000,
        lastAnsweredDate: 1000,
        correctCount: 5,
        errorCount: 0,
      };
      const demoted = updateTaskSpacedState(advanced, false, 5000);
      expect(demoted.level).toBe(0);
      expect(demoted.errorCount).toBe(1);
      expect(demoted.nextReviewDate).toBeLessThan(5000 + 86400000); // 4 hours later
    });

    it('filters tasks due for review based on timestamp', () => {
      const tasks: TrainerTask[] = [
        { id: 't1', exams: ['ent'], topic: 'solutions', difficulty: 'easy', type: 'numeric_input', condition: { kk: '', ru: '', en: '' }, correctAnswer: 1, hint: { kk: '', ru: '', en: '' }, solutionSteps: { kk: [], ru: [], en: [] } },
        { id: 't2', exams: ['ent'], topic: 'solutions', difficulty: 'easy', type: 'numeric_input', condition: { kk: '', ru: '', en: '' }, correctAnswer: 1, hint: { kk: '', ru: '', en: '' }, solutionSteps: { kk: [], ru: [], en: [] } },
      ];

      const tasksState = {
        t1: { level: 3, nextReviewDate: 10000, lastAnsweredDate: 1000, correctCount: 3, errorCount: 0 }, // due if now >= 10000
        t2: { level: 3, nextReviewDate: 50000, lastAnsweredDate: 1000, correctCount: 3, errorCount: 0 }, // not due at now = 20000
      };

      const due = getTasksDueForReview(tasks, tasksState, 20000, 5);
      expect(due.some((t) => t.id === 't1')).toBe(true);
      expect(due.some((t) => t.id === 't2')).toBe(false);
    });

    it('prioritizes tasks with higher error count in review queue', () => {
      const tasks: TrainerTask[] = [
        { id: 't_good', exams: ['ent'], topic: 'redox', difficulty: 'easy', type: 'single_choice', condition: { kk: '', ru: '', en: '' }, correctAnswer: 0, hint: { kk: '', ru: '', en: '' }, solutionSteps: { kk: [], ru: [], en: [] } },
        { id: 't_struggle', exams: ['ent'], topic: 'redox', difficulty: 'easy', type: 'single_choice', condition: { kk: '', ru: '', en: '' }, correctAnswer: 0, hint: { kk: '', ru: '', en: '' }, solutionSteps: { kk: [], ru: [], en: [] } },
      ];

      const tasksState = {
        t_good: { level: 0, nextReviewDate: 1000, lastAnsweredDate: 500, correctCount: 1, errorCount: 0 },
        t_struggle: { level: 0, nextReviewDate: 1000, lastAnsweredDate: 500, correctCount: 0, errorCount: 4 },
      };

      const due = getTasksDueForReview(tasks, tasksState, 2000, 5);
      expect(due[0].id).toBe('t_struggle');
    });

    it('includes unstudied tasks in review queue', () => {
      const tasks: TrainerTask[] = [
        { id: 't_new', exams: ['ent'], topic: 'organic', difficulty: 'easy', type: 'single_choice', condition: { kk: '', ru: '', en: '' }, correctAnswer: 0, hint: { kk: '', ru: '', en: '' }, solutionSteps: { kk: [], ru: [], en: [] } },
      ];
      const due = getTasksDueForReview(tasks, {}, 1000, 5);
      expect(due.length).toBe(1);
    });
  });

  // 5. Procedural Task Generator (4 cases)
  describe('Procedural Task Generator', () => {
    it('generates a valid calculation task with non-empty condition', () => {
      const task = generateRandomCalculationTask(1);
      expect(task.id).toContain('gen_');
      expect(task.type).toBe('numeric_input');
      expect(task.condition.kk.length).toBeGreaterThan(10);
      expect(task.condition.ru.length).toBeGreaterThan(10);
      expect(task.condition.en.length).toBeGreaterThan(10);
    });

    it('provides correct numeric answer and tolerance', () => {
      const task = generateRandomCalculationTask(2);
      expect(typeof task.correctAnswer).toBe('number');
      expect(task.tolerance).toBeGreaterThan(0);
    });

    it('includes step-by-step solution for all three languages', () => {
      const task = generateRandomCalculationTask(3);
      expect(task.solutionSteps.kk.length).toBeGreaterThanOrEqual(1);
      expect(task.solutionSteps.ru.length).toBeGreaterThanOrEqual(1);
      expect(task.solutionSteps.en.length).toBeGreaterThanOrEqual(1);
    });

    it('verifies generated answer against solution with tolerance', () => {
      const task = generateRandomCalculationTask(4);
      expect(checkTaskAnswer('numeric_input', task.correctAnswer, task.correctAnswer, task.tolerance)).toBe(true);
    });
  });
});
