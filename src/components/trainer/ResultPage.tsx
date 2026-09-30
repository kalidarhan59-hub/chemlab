import React, { useState } from 'react';
import { Trophy, CheckCircle, XCircle, RotateCcw, Share2, ArrowRight, Award } from 'lucide-react';
import { ExamType, TrainerTask } from '../../types/trainer';
import { calculateExamGrade } from '../../utils/trainer/scoring';
import { checkTaskAnswer } from '../../utils/trainer/checkAnswer';
import { FormulaText } from '../ui/FormulaText';

interface ResultPageProps {
  exam: ExamType;
  tasks: TrainerTask[];
  userAnswers: Record<string, any>;
  elapsedSeconds: number;
  onRetryMistakes: (mistakeTasks: TrainerTask[]) => void;
  onNewTest: () => void;
  lang: 'kk' | 'ru' | 'en';
}

export const ResultPage: React.FC<ResultPageProps> = ({
  exam,
  tasks,
  userAnswers,
  elapsedSeconds,
  onRetryMistakes,
  onNewTest,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  // Calculate score and identify mistake tasks
  let score = 0;
  const mistakeTasks: TrainerTask[] = [];

  tasks.forEach((t) => {
    const isCorrect = checkTaskAnswer(t.type, userAnswers[t.id], t.correctAnswer, t.tolerance);
    if (isCorrect) {
      score += 1;
    } else {
      mistakeTasks.push(t);
    }
  });

  const gradeResult = calculateExamGrade(exam, score, tasks.length);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} мин ${s < 10 ? '0' : ''}${s} сек`;
  };

  const handleShare = async () => {
    const text = `ChemLab ${exam.toUpperCase()}: ${score}/${tasks.length} (${gradeResult.percentage}%) - ${gradeResult.gradeLabel[lang] || gradeResult.gradeLabel.kk}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const t = {
    title: lang === 'kk' ? 'Тест аяқталды!' : lang === 'ru' ? 'Тестирование завершено!' : 'Test Completed!',
    score: lang === 'kk' ? 'Жинаған балыңыз' : lang === 'ru' ? 'Ваш результат' : 'Your Score',
    time: lang === 'kk' ? 'Жұмсалған уақыт' : lang === 'ru' ? 'Затраченное время' : 'Time Elapsed',
    retryErrors: lang === 'kk' ? 'Қателермен жұмыс' : lang === 'ru' ? 'Работа над ошибками' : 'Retry Mistakes',
    newTest: lang === 'kk' ? 'Жаңа тест бастау' : lang === 'ru' ? 'Новый тест' : 'New Test',
    share: lang === 'kk' ? 'Нәтижемен бөлісу' : lang === 'ru' ? 'Поделиться результатом' : 'Share Result',
    copied: lang === 'kk' ? 'Көшірілді!' : lang === 'ru' ? 'Скопировано!' : 'Copied!',
    mistakesTitle: lang === 'kk' ? 'Жіберілген қателердің талдауы' : lang === 'ru' ? 'Разбор допущенных ошибок' : 'Mistakes Breakdown',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center shadow-inner">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t.title}
        </h2>
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          {gradeResult.gradeLabel[lang] || gradeResult.gradeLabel.kk}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 block mb-1">{t.score}</span>
          <div className="font-mono font-extrabold text-3xl text-teal-600 dark:text-teal-400">
            {score} <span className="text-base text-slate-400">/ {tasks.length}</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">{gradeResult.percentage}% дұрыс</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            {lang === 'kk' ? 'ҰБТ Балы' : lang === 'ru' ? 'Балл ЕНТ' : 'UNT Score'}
          </span>
          <div className="font-mono font-extrabold text-3xl text-indigo-600 dark:text-indigo-400">
            {score} б.
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {gradeResult.passed ? (lang === 'kk' ? 'Шектен өтті' : lang === 'ru' ? 'Порог пройден' : 'Passed') : (lang === 'kk' ? 'Қайталау керек' : lang === 'ru' ? 'Ниже порога' : 'Below threshold')}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 block mb-1">{t.time}</span>
          <div className="font-mono font-bold text-xl text-slate-900 dark:text-white mt-1">
            {formatTime(elapsedSeconds)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {mistakeTasks.length > 0 && (
          <button
            type="button"
            onClick={() => onRetryMistakes(mistakeTasks)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.retryErrors} ({mistakeTasks.length})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNewTest}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
          <span>{t.newTest}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? t.copied : t.share}</span>
        </button>
      </div>

      {/* Mistakes Review List */}
      {mistakeTasks.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>{t.mistakesTitle}</span>
          </h3>

          <div className="space-y-3">
            {mistakeTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-red-200/60 dark:border-red-950/40 bg-red-50/20 dark:bg-red-950/10 space-y-2 text-xs"
              >
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  <FormulaText text={task.condition[lang] || task.condition.kk} />
                </div>
                <div className="text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-semibold text-slate-500 block mb-1">Шешу жолы:</span>
                  {(task.solutionSteps[lang] || task.solutionSteps.kk).map((s, i) => (
                    <p key={i}>
                      <FormulaText text={s} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
