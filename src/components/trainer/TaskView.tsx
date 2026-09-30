import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, HelpCircle } from 'lucide-react';
import { TrainerTask } from '../../types/trainer';
import { checkTaskAnswer } from '../../utils/trainer/checkAnswer';
import { FormulaText } from '../ui/FormulaText';

interface TaskViewProps {
  task: TrainerTask;
  userAnswer: any;
  onChangeAnswer: (answer: any) => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  onNext: () => void;
  lang: 'kk' | 'ru' | 'en';
}

export const TaskView: React.FC<TaskViewProps> = ({
  task,
  userAnswer,
  onChangeAnswer,
  isSubmitted,
  onSubmit,
  onNext,
  lang,
}) => {
  const [showHint, setShowHint] = useState(false);

  // Keyboard shortcut listener: 1-4 for options, Enter for submit/next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter') {
          onNext();
        }
        return;
      }

      if (task.type === 'single_choice' && task.options) {
        const key = e.key;
        if (['1', '2', '3', '4'].includes(key)) {
          const idx = parseInt(key, 10) - 1;
          const options = task.options[lang] || task.options.kk;
          if (idx < options.length) {
            onChangeAnswer(idx);
          }
        }
      }

      if (e.key === 'Enter' && userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, userAnswer, isSubmitted, lang, onChangeAnswer, onSubmit, onNext]);

  const isCorrect = isSubmitted
    ? checkTaskAnswer(task.type, userAnswer, task.correctAnswer, task.tolerance)
    : false;

  const t = {
    hint: lang === 'kk' ? 'Көмек / Кеңес' : lang === 'ru' ? 'Подсказка' : 'Hint',
    check: lang === 'kk' ? 'Тексеру (Enter)' : lang === 'ru' ? 'Проверить (Enter)' : 'Check (Enter)',
    next: lang === 'kk' ? 'Келесі сұрақ' : lang === 'ru' ? 'Следующий вопрос' : 'Next Question',
    solution: lang === 'kk' ? 'Шешімнің қадамдық талдауы' : lang === 'ru' ? 'Пошаговый разбор решения' : 'Step-by-step Solution',
    correct: lang === 'kk' ? 'Дұрыс! Өте жақсы!' : lang === 'ru' ? 'Верно! Отличная работа!' : 'Correct! Great job!',
    incorrect: lang === 'kk' ? 'Қате. Шешімін оқыңыз:' : lang === 'ru' ? 'Неверно. Ознакомьтесь с решением:' : 'Incorrect. Check the solution:',
    enterAnswer: lang === 'kk' ? 'Жауабыңызды жазыңыз...' : lang === 'ru' ? 'Введите ответ...' : 'Enter your answer...',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Condition */}
      <div>
        <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-2">
          {task.difficulty === 'easy'
            ? lang === 'kk' ? 'Оңай деңгей' : lang === 'ru' ? 'Базовый уровень' : 'Easy level'
            : task.difficulty === 'medium'
            ? lang === 'kk' ? 'Орташа деңгей' : lang === 'ru' ? 'Средний уровень' : 'Medium level'
            : lang === 'kk' ? 'Күрделі деңгей' : lang === 'ru' ? 'Сложный уровень' : 'Advanced level'}
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          <FormulaText text={task.condition[lang] || task.condition.kk} />
        </h3>
      </div>

      {/* Answer Input depending on TaskType */}
      <div>
        {/* Single Choice */}
        {task.type === 'single_choice' && task.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(task.options[lang] || task.options.kk).map((opt, idx) => {
              const isSelected = userAnswer === idx;
              let style =
                'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-teal-400 text-slate-800 dark:text-slate-200';

              if (isSubmitted) {
                if (idx === task.correctAnswer) {
                  style =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/40';
                } else if (isSelected && !isCorrect) {
                  style =
                    'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300';
                } else {
                  style = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              } else if (isSelected) {
                style =
                  'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/40 shadow-sm';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => onChangeAnswer(idx)}
                  className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-200/70 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <FormulaText text={opt} />
                  </div>
                  {isSubmitted && idx === task.correctAnswer && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Multi Choice */}
        {task.type === 'multi_choice' && task.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(task.options[lang] || task.options.kk).map((opt, idx) => {
              const selectedList = Array.isArray(userAnswer) ? userAnswer : [];
              const isSelected = selectedList.includes(idx);
              const isAnsCorrect = Array.isArray(task.correctAnswer) && task.correctAnswer.includes(idx);

              const toggleChoice = () => {
                if (isSubmitted) return;
                if (isSelected) {
                  onChangeAnswer(selectedList.filter((x: number) => x !== idx));
                } else {
                  onChangeAnswer([...selectedList, idx]);
                }
              };

              let style =
                'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-teal-400 text-slate-800 dark:text-slate-200';

              if (isSubmitted) {
                if (isAnsCorrect) {
                  style =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/40';
                } else if (isSelected && !isAnsCorrect) {
                  style =
                    'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300';
                } else {
                  style = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              } else if (isSelected) {
                style =
                  'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/40 shadow-sm';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={toggleChoice}
                  className={`p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs shrink-0">
                      {isSelected ? '✓' : ''}
                    </span>
                    <FormulaText text={opt} />
                  </div>
                  {isSubmitted && isAnsCorrect && (
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Numeric Input */}
        {task.type === 'numeric_input' && (
          <div className="flex items-center gap-3 max-w-sm">
            <input
              type="text"
              disabled={isSubmitted}
              value={userAnswer || ''}
              onChange={(e) => onChangeAnswer(e.target.value)}
              placeholder={t.enterAnswer}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {task.unit && (
              <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">
                {task.unit[lang] || task.unit.kk}
              </span>
            )}
          </div>
        )}

        {/* Formula Input */}
        {task.type === 'formula_input' && (
          <div className="max-w-md">
            <input
              type="text"
              disabled={isSubmitted}
              value={userAnswer || ''}
              onChange={(e) => onChangeAnswer(e.target.value)}
              placeholder={lang === 'kk' ? 'Формуланы жазыңыз (мыс. CO2)...' : lang === 'ru' ? 'Введите формулу (напр. CO2)...' : 'Enter formula (e.g. CO2)...'}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-base font-bold text-teal-600 dark:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}

        {/* Matching */}
        {task.type === 'matching' && task.matchingPairs && (
          <div className="space-y-3">
            {task.matchingPairs.map((pair) => (
              <div
                key={pair.id}
                className="flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {pair.left[lang] || pair.left.kk}
                </span>
                <span className="text-slate-400">→</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {pair.right[lang] || pair.right.kk}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hint toggle */}
      {task.hint && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint((h) => !h)}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{t.hint}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
              <FormulaText text={task.hint[lang] || task.hint.kk} />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons: Submit or Next */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
        <div />
        {!isSubmitted ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={userAnswer === undefined || userAnswer === null || userAnswer === ''}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md disabled:opacity-40 transition-all active:scale-95"
          >
            {t.check}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <span>{t.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Solution breakdown when submitted */}
      {isSubmitted && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-sm">
            {isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> {t.correct}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> {t.incorrect}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-semibold text-slate-500 block mb-1">{t.solution}:</span>
            {(task.solutionSteps[lang] || task.solutionSteps.kk).map((step, idx) => (
              <p key={idx} className="leading-relaxed">
                <FormulaText text={step} />
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
