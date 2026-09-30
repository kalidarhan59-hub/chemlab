import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { ArticleQuizQuestion } from '../../types/article';
import { FormulaText } from '../ui/FormulaText';

interface ArticleQuizProps {
  quiz: ArticleQuizQuestion[];
  lang: 'kk' | 'ru' | 'en';
}

export const ArticleQuiz: React.FC<ArticleQuizProps> = ({ quiz, lang }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const t = {
    title: lang === 'kk' ? 'Мини-тест: Материалды тексеру' : lang === 'ru' ? 'Мини-тест: Проверь себя' : 'Mini-Quiz: Check Your Knowledge',
    check: lang === 'kk' ? 'Тексеру' : lang === 'ru' ? 'Проверить' : 'Check',
  };

  if (!quiz || quiz.length === 0) return null;

  return (
    <div id="quiz" className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm uppercase tracking-wider">
        <HelpCircle className="w-5 h-5" />
        <span>{t.title}</span>
      </div>

      <div className="space-y-6">
        {quiz.map((q, qIdx) => {
          const selectedOption = userAnswers[qIdx];
          const isQSubmitted = submitted[qIdx];
          const isCorrect = selectedOption === q.correctAnswer;

          const options = q.options[lang] || q.options.kk;

          return (
            <div key={qIdx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <p className="font-bold text-slate-900 dark:text-white">
                {qIdx + 1}. <FormulaText text={q.question[lang] || q.question.kk} />
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  let style = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                  if (isQSubmitted) {
                    if (optIdx === q.correctAnswer) {
                      style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/40';
                    } else if (isSelected && !isCorrect) {
                      style = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300';
                    } else {
                      style = 'opacity-50 border-slate-200 dark:border-slate-800';
                    }
                  } else if (isSelected) {
                    style = 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/40';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isQSubmitted}
                      onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <FormulaText text={opt} />
                      {isQSubmitted && optIdx === q.correctAnswer && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      {isQSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Feedback */}
              {!isQSubmitted ? (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={selectedOption === undefined}
                    onClick={() => setSubmitted((prev) => ({ ...prev, [qIdx]: true }))}
                    className="px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {t.check}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-bold block mb-0.5">
                    {isCorrect
                      ? (lang === 'kk' ? '✓ Дұрыс!' : lang === 'ru' ? '✓ Верно!' : '✓ Correct!')
                      : (lang === 'kk' ? '✗ Қате!' : lang === 'ru' ? '✗ Неверно!' : '✗ Incorrect!')}
                  </span>
                  <FormulaText text={q.explanation[lang] || q.explanation.kk} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
