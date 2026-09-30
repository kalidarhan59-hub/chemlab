import React from 'react';
import { useTranslation } from 'react-i18next';
import { ElementCategory } from '../../types/element';
import { CATEGORY_COLORS } from '../../utils/elementHelpers';

export interface LegendProps {
  activeCategory: ElementCategory | 'all';
  onSelectCategory: (cat: ElementCategory | 'all') => void;
  className?: string;
}

export const Legend: React.FC<LegendProps> = ({
  activeCategory,
  onSelectCategory,
  className = '',
}) => {
  const { t } = useTranslation();

  const categories: ElementCategory[] = [
    'alkali-metal',
    'alkaline-earth',
    'transition-metal',
    'post-transition-metal',
    'metalloid',
    'reactive-nonmetal',
    'halogen',
    'noble-gas',
    'lanthanide',
    'actinide',
    'unknown',
  ];

  return (
    <div className={`p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('periodicTable.legend.title')}
        </span>
        {activeCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            {t('periodicTable.list.resetFilters')}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map((cat) => {
          const visual = CATEGORY_COLORS[cat];
          const isSelected = activeCategory === cat;
          const label = t(`periodicTable.categories.${cat}`);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(isSelected ? 'all' : cat)}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer flex items-center gap-1.5 select-none
                ${visual.badgeBg} ${visual.badgeText}
                ${isSelected ? 'ring-2 ring-teal-400 scale-105 shadow-sm' : activeCategory !== 'all' ? 'opacity-40 hover:opacity-80' : 'hover:scale-102'}
              `}
              title={t('periodicTable.legend.clickToFilter')}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-80" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
