import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, HelpCircle, RotateCcw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ChemicalElement, QuizProgress } from '../../types/element';
import { Language } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export interface ElementQuizProps {
  elements: ChemicalElement[];
  language: Language;
  onCellClickTarget: (el: ChemicalElement) => void;
  selectedElementForQuiz: ChemicalElement | null;
}

const STORAGE_KEY_QUIZ = 'chemlab:periodic-quiz';

const INITIAL_QUIZ: QuizProgress = {
  score: 0,
  totalAsked: 0,
  streak: 0,
  bestStreak: 0,
  history: [],
};

export const ElementQuiz: React.FC<ElementQuizProps> = ({
  elements,
  language,
  selectedElementForQuiz,
}) => {
  const { t } = useTranslation();
  const [quizState, setQuizState] = useLocalStorage<QuizProgress>(STORAGE_KEY_QUIZ, INITIAL_QUIZ);

  const [currentTarget, setCurrentTarget] = useState<ChemicalElement | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const lastProcessedRef = useRef<ChemicalElement | null>(null);

  // Pick a random element
  const pickNewTarget = useCallback(() => {
    if (!elements || elements.length === 0) return;
    const randomIndex = Math.floor(Math.random() * elements.length);
    setCurrentTarget(elements[randomIndex]);
    setFeedback(null);
    setShowHint(false);
    lastProcessedRef.current = null;
  }, [elements]);

  useEffect(() => {
    if (!currentTarget && elements.length > 0) {
      pickNewTarget();
    }
  }, [currentTarget, elements, pickNewTarget]);

  // Handle user selecting an element from the table
  useEffect(() => {
    if (!selectedElementForQuiz || !currentTarget || feedback !== null) return;
    if (lastProcessedRef.current === selectedElementForQuiz) return;
    lastProcessedRef.current = selectedElementForQuiz;

    const isCorrect = selectedElementForQuiz.number === currentTarget.number;

    if (isCorrect) {
      setQuizState((prev) => {
        const currentStreak = prev.streak || 0;
        const currentScore = prev.score || 0;
        const newStreak = currentStreak + 1;
        const newScore = currentScore + 10;
        const newBest = Math.max(newStreak, prev.bestStreak || 0);

        return {
          ...prev,
          score: newScore,
          streak: newStreak,
          bestStreak: newBest,
          totalAsked: (prev.totalAsked || 0) + 1,
          history: [...(prev.history || []), { number: currentTarget.number, correct: true }],
        };
      });
      setFeedback('correct');
    } else {
      setQuizState((prev) => ({
        ...prev,
        streak: 0,
        totalAsked: (prev.totalAsked || 0) + 1,
        history: [...(prev.history || []), { number: currentTarget.number, correct: false }],
      }));
      setFeedback('incorrect');
    }
  }, [selectedElementForQuiz, currentTarget, feedback, setQuizState]);

  if (!currentTarget) return null;

  const targetName = currentTarget.name[language] || currentTarget.name.kk;

  return (
    <Card padding="md" className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-purple-500/5 to-transparent glow-teal mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left prompt */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {t('periodicTable.quiz.title')}
            </span>
          </div>

          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
            <span>{t('periodicTable.quiz.findPrompt')}</span>
            <span className="px-3 py-1 rounded-xl bg-teal-500 text-white font-mono font-black text-lg sm:text-xl shadow-md">
              {targetName}
            </span>
          </div>
        </div>

        {/* Score & Streak Counter */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs sm:text-sm">
          <div className="p-2 px-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-slate-500 block text-[10px]">{t('periodicTable.quiz.score')}</span>
            <strong className="text-teal-600 dark:text-teal-400 text-base">{quizState.score}</strong>
          </div>

          <div className="p-2 px-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-slate-500 block text-[10px]">{t('periodicTable.quiz.streak')}</span>
            <strong className="text-amber-500 text-base">🔥 {quizState.streak}</strong>
          </div>

          <div className="p-2 px-3 rounded-xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-slate-500 block text-[10px]">{t('periodicTable.quiz.bestStreak')}</span>
            <strong className="text-purple-500 text-base">🏆 {quizState.bestStreak}</strong>
          </div>
        </div>
      </div>

      {/* Action / Feedback row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-2">
          {feedback === 'correct' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('periodicTable.quiz.correct')}</span>
            </span>
          )}

          {feedback === 'incorrect' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{t('periodicTable.quiz.incorrect', { name: targetName, symbol: currentTarget.symbol })}</span>
            </span>
          )}

          {!feedback && !showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('periodicTable.quiz.hintButton')}</span>
            </button>
          )}

          {showHint && (
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded">
              {t('periodicTable.quiz.hint', { period: currentTarget.period, group: currentTarget.group || 'f-block' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={pickNewTarget}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {feedback !== null ? t('common.start') : t('periodicTable.quiz.skip')}
          </Button>

          <button
            type="button"
            onClick={() => setQuizState(INITIAL_QUIZ)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title={t('periodicTable.quiz.restart')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
};
