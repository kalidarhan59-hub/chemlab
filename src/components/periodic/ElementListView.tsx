import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { ChemicalElement } from '../../types/element';
import { Language } from '../../types';
import { CATEGORY_COLORS } from '../../utils/elementHelpers';

export interface ElementListViewProps {
  elements: ChemicalElement[];
  language: Language;
  onSelectElement: (el: ChemicalElement) => void;
}

type SortField = 'number' | 'name' | 'mass' | 'electronegativity' | 'density';

export const ElementListView: React.FC<ElementListViewProps> = ({
  elements,
  language,
  onSelectElement,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => {
      let valA: string | number = a.number;
      let valB: string | number = b.number;

      if (sortField === 'name') {
        valA = a.name[language] || a.name.kk;
        valB = b.name[language] || b.name.kk;
        return sortAsc
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      } else if (sortField === 'mass') {
        valA = a.atomicMass;
        valB = b.atomicMass;
      } else if (sortField === 'electronegativity') {
        valA = a.electronegativity ?? -1;
        valB = b.electronegativity ?? -1;
      } else if (sortField === 'density') {
        valA = a.density ?? -1;
        valB = b.density ?? -1;
      }

      return sortAsc
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });
  }, [elements, sortField, sortAsc, language]);

  return (
    <div className="space-y-4">
      {/* Sorting Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider">
          {t('periodicTable.list.sortBy')}
        </span>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleSort('number')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              sortField === 'number'
                ? 'bg-teal-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{t('periodicTable.list.byNumber')}</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleSort('name')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              sortField === 'name'
                ? 'bg-teal-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{t('periodicTable.list.byName')}</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleSort('mass')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              sortField === 'mass'
                ? 'bg-teal-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{t('periodicTable.list.byMass')}</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => handleSort('electronegativity')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              sortField === 'electronegativity'
                ? 'bg-teal-500 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>{t('periodicTable.list.byElectronegativity')}</span>
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid of Element Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedElements.map((el) => {
          const catVisual = CATEGORY_COLORS[el.category] || CATEGORY_COLORS.unknown;
          const name = el.name[language] || el.name.kk;

          return (
            <div
              key={`el-list-${el.number}`}
              onClick={() => onSelectElement(el)}
              className="p-3.5 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 hover:border-teal-500/40 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-mono shrink-0 ${catVisual.bgLight} ${catVisual.bgDark} ${catVisual.borderLight} ${catVisual.borderDark}`}
                >
                  <span className="text-[10px] font-bold opacity-75">{el.number}</span>
                  <span className="text-base font-extrabold leading-none">{el.symbol}</span>
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Ar: {el.atomicMass.toFixed(2)}</span>
                    <span>•</span>
                    <span>{t(`periodicTable.blocks.${el.block}`)}</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transform group-hover:translate-x-1 transition-all shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
