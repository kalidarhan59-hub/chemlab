import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Crown,
  User,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import {
  QuizLeaderboardEntry,
  getQuizLeaderboard,
  saveQuizLeaderboard,
  DEFAULT_LEADERBOARD,
} from '../../types/quizLeaderboard';

interface QuizLeaderboardProps {
  lang: 'kk' | 'ru' | 'en';
  highlightId?: string;
  onPlayAgain?: () => void;
  className?: string;
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({
  lang,
  highlightId,
  onPlayAgain,
  className = '',
}) => {
  const [leaderboard, setLeaderboard] = useState<QuizLeaderboardEntry[]>(() => getQuizLeaderboard());
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'elements' | 'reactions' | 'precipitates'>('all');

  const refreshLeaderboard = () => {
    setLeaderboard(getQuizLeaderboard());
  };

  useEffect(() => {
    refreshLeaderboard();
    const handleStorage = () => refreshLeaderboard();
    window.addEventListener('local-storage', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('local-storage', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleResetToDefault = () => {
    if (
      window.confirm(
        lang === 'kk'
          ? 'Көшбасшылар тақтасын әдепкі мәндерге қайтаруды растайсыз ба?'
          : lang === 'ru'
          ? 'Сбросить таблицу лидеров до начальных значений?'
          : 'Reset leaderboard to default entries?'
      )
    ) {
      saveQuizLeaderboard(DEFAULT_LEADERBOARD);
      setLeaderboard(DEFAULT_LEADERBOARD);
    }
  };

  const filteredLeaderboard = categoryFilter === 'all'
    ? leaderboard
    : leaderboard.filter((item) => item.category === categoryFilter);

  const t = {
    title:
      lang === 'kk'
        ? '🏆 Элементтер мен Реакциялар: ТОП-5 Көшбасшылар'
        : lang === 'ru'
        ? '🏆 Элементы и Реакции: ТОП-5 Лидеров'
        : '🏆 Elements & Reactions: TOP 5 Leaderboard',
    subtitle:
      lang === 'kk'
        ? 'Химиялық викторинада ең жоғары балл мен XP жинаған үздік нәтижелер'
        : lang === 'ru'
        ? 'Лучшие результаты и рекорды по набранным очкам и опыту в экспресс-викторине'
        : 'Top 5 highest score records achieved in the elements and reactions quiz',
    rank: lang === 'kk' ? 'Орын' : lang === 'ru' ? 'Место' : 'Rank',
    user: lang === 'kk' ? 'Қатысушы' : lang === 'ru' ? 'Участник' : 'Player',
    score: lang === 'kk' ? 'Балл' : lang === 'ru' ? 'Баллы' : 'Score',
    accuracy: lang === 'kk' ? 'Дәлдік' : lang === 'ru' ? 'Точность' : 'Accuracy',
    streak: lang === 'kk' ? 'Стрик' : lang === 'ru' ? 'Стрик' : 'Streak',
    xp: lang === 'kk' ? 'XP Ұпайы' : lang === 'ru' ? 'Очки XP' : 'XP Points',
    category: lang === 'kk' ? 'Санат' : lang === 'ru' ? 'Категория' : 'Category',
    date: lang === 'kk' ? 'Күні' : lang === 'ru' ? 'Дата' : 'Date',
    reset: lang === 'kk' ? 'Әдепкіге қайтару' : lang === 'ru' ? 'Сброс рекордов' : 'Reset to default',
    playQuiz: lang === 'kk' ? 'Викторинаға қатысу' : lang === 'ru' ? 'Пройти викторину' : 'Take the Quiz',
    noRecords: lang === 'kk' ? 'Әзірге бұл санатта рекордтар жоқ.' : lang === 'ru' ? 'Пока нет рекордов в этой категории.' : 'No records yet for this category.',
    catAll: lang === 'kk' ? 'Барлығы' : lang === 'ru' ? 'Все' : 'All',
    catElem: lang === 'kk' ? 'Элементтер' : lang === 'ru' ? 'Элементы' : 'Elements',
    catReac: lang === 'kk' ? 'Реакциялар' : lang === 'ru' ? 'Реакции' : 'Reactions',
    catPrec: lang === 'kk' ? 'Осадоктар' : lang === 'ru' ? 'Осадки' : 'Precipitates',
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg ring-2 ring-amber-400/50">
            <Crown className="w-4 h-4 fill-slate-950" />
          </div>
        );
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-950 font-black flex items-center justify-center shadow-md ring-2 ring-slate-300/40">
            <Medal className="w-4 h-4 fill-slate-900" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-black flex items-center justify-center shadow-md ring-2 ring-amber-700/40">
            <Medal className="w-4 h-4 fill-white" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold flex items-center justify-center">
            #{index + 1}
          </div>
        );
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'elements':
        return { label: t.catElem, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
      case 'reactions':
        return { label: t.catReac, color: 'text-teal-400 bg-teal-950/60 border-teal-800/60' };
      case 'precipitates':
        return { label: t.catPrec, color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' };
      default:
        return { label: t.catAll, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">{t.title}</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{t.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {onPlayAgain && (
            <button
              type="button"
              onClick={onPlayAgain}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t.playQuiz}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetToDefault}
            title={t.reset}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'elements', 'reactions', 'precipitates'] as const).map((cat) => (
          <button
            key={`lead-tab-${cat}`}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {cat === 'all'
              ? t.catAll
              : cat === 'elements'
              ? `⚛️ ${t.catElem}`
              : cat === 'reactions'
              ? `⚡ ${t.catReac}`
              : `🎨 ${t.catPrec}`}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Cards */}
      {filteredLeaderboard.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
          {t.noRecords}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredLeaderboard.map((entry, index) => {
            const isHighlighted = highlightId === entry.id;
            const catInfo = getCategoryLabel(entry.category);

            return (
              <div
                key={entry.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isHighlighted
                    ? 'bg-teal-50 dark:bg-teal-950/70 border-teal-500 shadow-lg ring-2 ring-teal-500/50 scale-[1.01]'
                    : index === 0
                    ? 'bg-gradient-to-r from-amber-50/80 via-white to-white dark:from-amber-950/40 dark:via-slate-850 dark:to-slate-850 border-amber-500/40'
                    : 'bg-slate-50/80 dark:bg-slate-850/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left: Rank Badge + User Name + Category */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {getRankBadge(index)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[240px]">
                        {entry.userName}
                      </span>
                      {isHighlighted && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-0.5 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${catInfo.color}`}
                      >
                        {catInfo.label}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics Grid */}
                <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                  {/* Score */}
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                      {t.score}
                    </span>
                    <span className="font-mono font-black text-sm sm:text-base text-teal-600 dark:text-teal-400">
                      {entry.score} / {entry.total}
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                      {t.accuracy}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-purple-600 dark:text-purple-400">
                      {entry.percentage}%
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                      {t.streak}
                    </span>
                    <span className="font-mono font-extrabold text-sm text-amber-500 dark:text-amber-400 flex items-center justify-center sm:justify-end gap-0.5">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400" />
                      {entry.streak}
                    </span>
                  </div>

                  {/* XP */}
                  <div className="text-center sm:text-right px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 min-w-[70px]">
                    <span className="text-[9px] uppercase font-bold text-indigo-700 dark:text-indigo-300 block">
                      {t.xp}
                    </span>
                    <span className="font-mono font-black text-sm text-indigo-400 flex items-center justify-center sm:justify-end gap-0.5">
                      <Zap className="w-3 h-3 fill-indigo-400" />
                      +{entry.xp}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
