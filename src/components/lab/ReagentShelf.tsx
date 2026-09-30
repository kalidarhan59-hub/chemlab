import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, X, Filter } from 'lucide-react';
import { Reagent, REAGENTS_MAP } from '../../utils/lab/reactionEngine';
import { ReagentItem } from './ReagentItem';
import reagentsData from '../../data/reagents.json';

interface ReagentShelfProps {
  selectedReagentId: string | null;
  onSelectReagent: (reagent: Reagent) => void;
  onQuickAdd: (reagentId: string) => void;
}

export const ReagentShelf: React.FC<ReagentShelfProps> = ({
  selectedReagentId,
  onSelectReagent,
  onQuickAdd,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('lab.shelf.all', 'Барлығы') },
    { id: 'acid', label: t('lab.reagentTypes.acid', 'Қышқылдар') },
    { id: 'base', label: t('lab.reagentTypes.base', 'Сілтілер') },
    { id: 'salt', label: t('lab.reagentTypes.salt', 'Тұздар') },
    { id: 'metal', label: t('lab.reagentTypes.metal', 'Металдар') },
    { id: 'indicator', label: t('lab.reagentTypes.indicator', 'Индикаторлар') },
  ];

  const allReagents: Reagent[] = reagentsData as Reagent[];

  const filteredReagents = allReagents.filter((r) => {
    const matchesCategory = activeCategory === 'all' || r.type === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = r.name[currentLang]?.toLowerCase().includes(q);
    const matchesFormula = r.formula.toLowerCase().includes(q);
    const matchesDesc = r.description[currentLang]?.toLowerCase().includes(q);

    return matchesCategory && (matchesName || matchesFormula || matchesDesc);
  });

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/60 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {t('lab.shelf.title', 'Реактивтер сөресі')}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('lab.shelf.dragHint', 'Реактивті сынауыққа тартыңыз немесе таңдап басыңыз')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('lab.shelf.searchPlaceholder', 'Реактив немесе формула...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Reagents Grid */}
      <div className="flex-1 overflow-y-auto max-h-[380px] sm:max-h-[460px] pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredReagents.map((reagent) => (
          <ReagentItem
            key={reagent.id}
            reagent={reagent}
            isSelected={selectedReagentId === reagent.id}
            onSelect={onSelectReagent}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
};
