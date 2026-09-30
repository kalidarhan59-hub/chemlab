import React, { useRef } from 'react';
import {
  Trophy,
  Flame,
  Target,
  TrendingUp,
  AlertOctagon,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { TopicId, TrainerStorageSchema } from '../../types/trainer';
import { TOPICS_META } from './TopicPicker';
import { getWeakestTopics } from '../../utils/trainer/stats';

interface StatsDashboardProps {
  stats: TrainerStorageSchema;
  onResetStats: () => void;
  onImportStats: (newStats: TrainerStorageSchema) => void;
  onTrainWeakTopic: (topic: TopicId) => void;
  lang: 'kk' | 'ru' | 'en';
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  onResetStats,
  onImportStats,
  onTrainWeakTopic,
  lang,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute total solved and total correct
  let totalSolved = 0;
  let totalCorrect = 0;
  Object.values(stats.topicStats).forEach((s) => {
    totalSolved += s.total;
    totalCorrect += s.correct;
  });

  const overallAccuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  const weakestTopics = getWeakestTopics(stats.topicStats, 3);

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'chemlab-trainer-stats.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.version) {
          onImportStats(parsed);
        }
      } catch {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  // Build last 28 days for activity heatmap
  const daysList: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    daysList.push({
      date: dateStr,
      count: stats.activityHistory[dateStr] || 0,
    });
  }

  const t = {
    title: lang === 'kk' ? 'Оқу статистикасы мен нәтижелер' : lang === 'ru' ? 'Статистика обучения и прогресс' : 'Learning Statistics & Progress',
    accuracy: lang === 'kk' ? 'Дәлдік' : lang === 'ru' ? 'Точность' : 'Accuracy',
    totalSolved: lang === 'kk' ? 'Барлық шешілгені' : lang === 'ru' ? 'Всего решено' : 'Total Solved',
    streak: lang === 'kk' ? 'Үздіксіз серия' : lang === 'ru' ? 'Серия дней' : 'Day Streak',
    heatmapTitle: lang === 'kk' ? 'Белсенділік күнтізбесі (соңғы 4 апта)' : lang === 'ru' ? 'Календарь активности (последние 4 недели)' : 'Activity Calendar (last 4 weeks)',
    weakTitle: lang === 'kk' ? 'Қайталауды қажет ететін тақырыптар' : lang === 'ru' ? 'Слабые темы (требуют повторения)' : 'Weak Topics (Need practice)',
    trainBtn: lang === 'kk' ? 'Жаттығу' : lang === 'ru' ? 'Тренировать' : 'Practice',
    achievementsTitle: lang === 'kk' ? 'Жетістіктер' : lang === 'ru' ? 'Достижения' : 'Achievements',
    exportBtn: lang === 'kk' ? 'Экспорттау (JSON)' : lang === 'ru' ? 'Экспорт (JSON)' : 'Export JSON',
    importBtn: lang === 'kk' ? 'Импорттау' : lang === 'ru' ? 'Импорт' : 'Import',
    resetBtn: lang === 'kk' ? 'Нөлдеу' : lang === 'ru' ? 'Сброс' : 'Reset',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleExport}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.importBtn}</span>
          </button>
          <button
            type="button"
            onClick={onResetStats}
            title={t.resetBtn}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
            {t.accuracy}
          </span>
          <div className="font-mono font-extrabold text-2xl text-teal-600 dark:text-teal-400">
            {overallAccuracy}%
          </div>
          <span className="text-xs text-slate-500">
            {totalCorrect} / {totalSolved}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
            {t.totalSolved}
          </span>
          <div className="font-mono font-extrabold text-2xl text-slate-900 dark:text-white">
            {totalSolved}
          </div>
          <span className="text-xs text-slate-500">{lang === 'kk' ? 'тапсырма' : 'заданий'}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
            {t.streak}
          </span>
          <div className="font-mono font-extrabold text-2xl text-amber-500 flex items-center gap-1.5">
            <Flame className="w-6 h-6 fill-amber-500" />
            <span>{stats.streak}</span>
          </div>
          <span className="text-xs text-slate-500">{lang === 'kk' ? 'күн қатарынан' : 'дней подряд'}</span>
        </div>
      </div>

      {/* Activity Calendar Heatmap */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          {t.heatmapTitle}
        </span>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          {daysList.map((day) => {
            let color = 'bg-slate-200 dark:bg-slate-800';
            if (day.count >= 10) color = 'bg-emerald-600 dark:bg-emerald-400';
            else if (day.count >= 5) color = 'bg-emerald-500 dark:bg-emerald-500';
            else if (day.count >= 1) color = 'bg-emerald-300 dark:bg-emerald-700';

            return (
              <div
                key={day.date}
                className={`w-6 h-6 rounded-md ${color} transition-all`}
                title={`${day.date}: ${day.count} задач`}
              />
            );
          })}
        </div>
      </div>

      {/* Weak Topics */}
      {weakestTopics.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-orange-500" />
            <span>{t.weakTitle}</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {weakestTopics.map((topicId) => {
              const meta = TOPICS_META.find((t) => t.id === topicId);
              const stat = stats.topicStats[topicId] || { total: 0, correct: 0 };
              const acc = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div
                  key={topicId}
                  className="p-3.5 rounded-xl border border-orange-200/60 dark:border-orange-950/40 bg-orange-50/40 dark:bg-orange-950/15 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {meta?.name[lang] || meta?.name.kk}
                    </h4>
                    <span className="font-mono text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      {acc}% {t.accuracy} ({stat.total} {lang === 'kk' ? 'талпыныс' : 'попыток'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onTrainWeakTopic(topicId)}
                    className="mt-3 py-1.5 px-3 rounded-lg text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all cursor-pointer"
                  >
                    {t.trainBtn}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
