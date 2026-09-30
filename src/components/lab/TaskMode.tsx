import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckSquare,
  Star,
  Award,
  ChevronRight,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  X,
} from 'lucide-react';
import labTasksData from '../../data/labTasks.json';

export interface LabTask {
  id: string;
  title: { kk: string; ru: string; en: string };
  description: { kk: string; ru: string; en: string };
  hint: { kk: string; ru: string; en: string };
  target: {
    type: string;
    value?: string | string[];
    indicator?: string;
    color?: string;
    gas?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface TaskModeProps {
  activeTaskId: string | null;
  completedTasks: Record<string, { stars: number; timestamp: number }>;
  onSelectTask: (taskId: string) => void;
  onClose: () => void;
}

export const TaskMode: React.FC<TaskModeProps> = ({
  activeTaskId,
  completedTasks,
  onSelectTask,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const [activeTab, setActiveTab] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [showHintForId, setShowHintForId] = useState<string | null>(null);

  const tasks: LabTask[] = labTasksData as LabTask[];

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    return task.difficulty === activeTab;
  });

  const totalPointsEarned = Object.keys(completedTasks).reduce((sum, id) => {
    const found = tasks.find((t) => t.id === id);
    return sum + (found?.points || 0);
  }, 0);

  return (
    <div className="bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 rounded-3xl p-5 backdrop-blur-2xl shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {t('lab.tasks.title', 'Зертханалық тапсырмалар')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('lab.tasks.subtitle', '15 интерактивті химиялық сынақ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{totalPointsEarned} ұпай</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            type="button"
            onClick={() => setActiveTab(diff)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
              activeTab === diff
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {diff === 'all' ? t('lab.shelf.all', 'Барлығы') : diff}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="max-h-[50vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {filteredTasks.map((task) => {
          const isDone = !!completedTasks[task.id];
          const isActive = activeTaskId === task.id;
          const stars = completedTasks[task.id]?.stars || 0;

          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 ring-2 ring-teal-400/30 shadow-lg shadow-teal-500/10'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {task.title[currentLang] || task.title.kk}
                    </span>

                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {task.description[currentLang] || task.description.kk}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {isDone ? (
                    <div className="flex items-center text-amber-500 dark:text-amber-400">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-current' : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectTask(task.id)}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/15 hover:bg-teal-500 text-teal-700 dark:text-teal-300 hover:text-white dark:hover:text-slate-950 border border-teal-500/30 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                    >
                      <span>{isActive ? 'Таңдалды' : 'Орындау'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hint accordion toggle */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() =>
                    setShowHintForId(showHintForId === task.id ? null : task.id)
                  }
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHintForId === task.id ? 'Кеңесті жабу' : 'Кеңес алу'}</span>
                </button>

                <span className="text-slate-500 font-mono font-semibold">+{task.points} балл</span>
              </div>

              {/* Hint display */}
              {showHintForId === task.id && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-900 dark:text-amber-200 animate-in fade-in">
                  💡 {task.hint[currentLang] || task.hint.kk}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
