import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Sliders } from 'lucide-react';
import { HeatmapProperty } from '../../types/element';
import { HEATMAP_RANGES } from '../../utils/elementHelpers';

export interface HeatmapControlProps {
  currentProperty: HeatmapProperty;
  onChange: (prop: HeatmapProperty) => void;
}

export const HeatmapControl: React.FC<HeatmapControlProps> = ({ currentProperty, onChange }) => {
  const { t } = useTranslation();

  const options: { id: HeatmapProperty; label: string }[] = [
    { id: 'none', label: t('periodicTable.heatmap.none') },
    { id: 'electronegativity', label: t('periodicTable.heatmap.electronegativity') },
    { id: 'atomicMass', label: t('periodicTable.heatmap.atomicMass') },
    { id: 'density', label: t('periodicTable.heatmap.density') },
    { id: 'meltingPoint', label: t('periodicTable.heatmap.meltingPoint') },
    { id: 'boilingPoint', label: t('periodicTable.heatmap.boilingPoint') },
  ];

  const range = currentProperty !== 'none' ? HEATMAP_RANGES[currentProperty] : null;

  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-500">
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {t('periodicTable.heatmap.label')}
          </span>
        </div>

        {/* Dropdown Select */}
        <select
          value={currentProperty}
          onChange={(e) => onChange(e.target.value as HeatmapProperty)}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gradient Scale and Range Legend if active */}
      {range && (
        <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-600 via-teal-400 via-amber-400 to-rose-600 shadow-inner" />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>
              {t('periodicTable.heatmap.low')}: {range.min} {range.unit}
            </span>
            <span className="text-slate-400">•</span>
            <span>
              {t('periodicTable.heatmap.high')}: {range.max} {range.unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
