import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  RotateCcw,
  Trash2,
  Shuffle,
  BookOpen,
  CheckSquare,
  ShieldAlert,
  Camera,
} from 'lucide-react';

interface LabControlsProps {
  onClearActive: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  onRandomExperiment: () => void;
  onOpenLog: () => void;
  onToggleTasks: () => void;
  onOpenSafety: () => void;
  onExportSnapshot: () => void;
  isTasksActive: boolean;
  canUndo: boolean;
  hasReagents: boolean;
}

export const LabControls: React.FC<LabControlsProps> = ({
  onClearActive,
  onClearAll,
  onUndo,
  onRandomExperiment,
  onOpenLog,
  onToggleTasks,
  onOpenSafety,
  onExportSnapshot,
  isTasksActive,
  canUndo,
  hasReagents,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl backdrop-blur-xl shadow-lg">
      {/* Left side: Vessel actions (Undo, Clear Active, Clear All) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Болдырмау (Undo)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('lab.controls.undo', 'Болдырмау')}</span>
        </button>

        <button
          type="button"
          onClick={onClearActive}
          disabled={!hasReagents}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Сынауықты тазарту"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('lab.controls.rinseActive', 'Сынауықты жуу')}</span>
        </button>

        <button
          type="button"
          onClick={onRandomExperiment}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>{t('lab.controls.random', 'Кездейсоқ тәжірибе')}</span>
        </button>
      </div>

      {/* Right side: Tools & Modes (Tasks, Log, Safety, Export) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={onToggleTasks}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
            isTasksActive
              ? 'bg-teal-500 text-white dark:text-slate-950 font-bold shadow-teal-500/20'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{t('lab.controls.tasks', 'Тапсырмалар')}</span>
        </button>

        <button
          type="button"
          onClick={onOpenLog}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('lab.controls.log', 'Журнал')}</span>
        </button>

        <button
          type="button"
          onClick={onExportSnapshot}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          title="Тәжірибе есебін көшіру / сақтау"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onOpenSafety}
          className="p-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
          title="Қауіпсіздік ережелері"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
