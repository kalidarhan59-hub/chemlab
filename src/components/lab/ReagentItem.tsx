import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skull, Flame, Biohazard, Droplet, Shield, Plus } from 'lucide-react';
import { Reagent } from '../../utils/lab/reactionEngine';

interface ReagentItemProps {
  reagent: Reagent;
  isSelected?: boolean;
  onSelect: (reagent: Reagent) => void;
  onQuickAdd?: (reagentId: string) => void;
}

export const ReagentItem: React.FC<ReagentItemProps> = ({
  reagent,
  isSelected = false,
  onSelect,
  onQuickAdd,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', reagent.id);
    e.dataTransfer.setData('application/chemlab-reagent', reagent.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const getHazardIcon = () => {
    switch (reagent.hazard.icon) {
      case 'skull':
        return <Skull className="w-3 h-3 text-rose-400" />;
      case 'flame':
        return <Flame className="w-3 h-3 text-amber-400" />;
      case 'biohazard':
        return <Biohazard className="w-3 h-3 text-purple-400" />;
      case 'droplet':
        return <Droplet className="w-3 h-3 text-sky-400" />;
      default:
        return <Shield className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getTypeBadgeClass = () => {
    switch (reagent.type) {
      case 'acid':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'base':
        return 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'salt':
        return 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30';
      case 'metal':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'indicator':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(reagent)}
      className={`relative p-3 rounded-2xl border transition-all duration-200 select-none cursor-grab active:cursor-grabbing group hover:-translate-y-0.5 shadow-sm ${
        isSelected
          ? 'bg-teal-500/15 border-teal-500 shadow-md shadow-teal-500/15 ring-2 ring-teal-400/40'
          : 'bg-white hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
      title={`${reagent.name[currentLang]}: ${reagent.hazard.text[currentLang]}`}
    >
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          {/* Solution color swatch circle */}
          <span
            className="w-3 h-3 rounded-full border border-slate-300 dark:border-white/30 shrink-0 shadow-xs"
            style={{ backgroundColor: reagent.color }}
          />
          {/* Chemical Formula */}
          <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
            {reagent.formula}
          </span>
        </div>

        {/* Hazard Icon */}
        <div className="flex items-center gap-1">
          {getHazardIcon()}
          {onQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(reagent.id);
              }}
              className="p-1 rounded-md bg-teal-500/10 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              title={t('lab.controls.addReagent', 'Қосу')}
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Localized Name */}
      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mb-2 font-medium">
        {reagent.name[currentLang] || reagent.id}
      </p>

      {/* Bottom Category badge & state */}
      <div className="flex items-center justify-between text-[10px]">
        <span className={`px-2 py-0.5 rounded-md font-semibold border ${getTypeBadgeClass()}`}>
          {t(`lab.reagentTypes.${reagent.type}`, reagent.type)}
        </span>

        <span className="text-slate-500 dark:text-slate-400 font-mono">
          {reagent.state === 'solid' ? t('lab.states.solid', 'қатты') : `${reagent.pH} pH`}
        </span>
      </div>
    </div>
  );
};
