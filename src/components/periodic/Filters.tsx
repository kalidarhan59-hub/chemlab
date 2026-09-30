import React from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ElementBlock, ElementState, FilterOptions } from '../../types/element';

export interface FiltersProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onReset: () => void;
  className?: string;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const { t } = useTranslation();

  const blocks: (ElementBlock | 'all')[] = ['all', 's', 'p', 'd', 'f'];
  const states: (ElementState | 'all')[] = ['all', 'solid', 'liquid', 'gas'];

  const hasActiveFilters =
    filters.block !== 'all' ||
    filters.state !== 'all' ||
    filters.category !== 'all' ||
    filters.discoveryYearRange[0] > -5000 ||
    filters.discoveryYearRange[1] < 2026;

  return (
    <div className={`p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 space-y-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-teal-500" />
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {t('periodicTable.quickFilter')}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('periodicTable.list.resetFilters')}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Block Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            {t('periodicTable.details.block')}
          </label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 gap-1 border border-slate-200 dark:border-white/5">
            {blocks.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => onChange({ ...filters, block: b })}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                  filters.block === b
                    ? 'bg-teal-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t(`periodicTable.blocks.${b}`)}
              </button>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            {t('periodicTable.details.state')}
          </label>
          <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 gap-1 border border-slate-200 dark:border-white/5">
            {states.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onChange({ ...filters, state: s })}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
                  filters.state === s
                    ? 'bg-teal-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t(`periodicTable.states.${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Year Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>{t('periodicTable.discovery.label')}</span>
            <span className="font-mono text-teal-600 dark:text-teal-400">
              ≤ {filters.discoveryYearRange[1]}
            </span>
          </div>
          <input
            type="range"
            min="1650"
            max="2026"
            step="1"
            value={filters.discoveryYearRange[1]}
            onChange={(e) =>
              onChange({
                ...filters,
                discoveryYearRange: [filters.discoveryYearRange[0], parseInt(e.target.value, 10)],
              })
            }
            className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
        </div>
      </div>
    </div>
  );
};
