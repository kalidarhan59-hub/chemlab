import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Sparkles, X, ChevronRight, GraduationCap } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { REACTION_PRESETS, ReactionPreset } from '../../utils/balancer/presets';
import { formatToUnicode } from '../../utils/balancer/chemicalFormula';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReaction: (equation: string) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectReaction,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('balancer.presets.all', 'Барлығы') },
    { id: 'basic', label: t('balancer.presets.basic', 'Бастапқы') },
    { id: 'neutralization', label: t('balancer.presets.neutralization', 'Бейтараптану және алмасу') },
    { id: 'redox', label: t('balancer.presets.redox', 'ОВР / Тотығу-тотықсыздану') },
    { id: 'organic', label: t('balancer.presets.organic', 'Органика және жану') },
    { id: 'complex', label: t('balancer.presets.complex', 'Күрделі реакциялар') },
    { id: 'ionic', label: t('balancer.presets.ionic', 'Иондық теңдеулер') },
    { id: 'exam', label: t('balancer.presets.exam', 'ЕНТ / ОГЭ / ЕГЭ') },
  ];

  const filteredPresets = REACTION_PRESETS.filter((preset) => {
    const matchesCategory = activeCategory === 'all' || preset.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesName = preset.name[currentLang]?.toLowerCase().includes(q);
    const matchesEq = preset.equation.toLowerCase().includes(q);
    const matchesDesc = preset.description?.[currentLang]?.toLowerCase().includes(q);

    return matchesCategory && (matchesName || matchesEq || matchesDesc);
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          <span>{t('balancer.presets.modalTitle', 'Химиялық реакциялар кітапханасы')}</span>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('balancer.presets.searchPlaceholder', 'Реакцияны немесе затты іздеу (мысалы: KMnO4, метан, су)...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.id === 'exam' && <GraduationCap className="w-3.5 h-3.5 inline mr-1" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Presets List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {filteredPresets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <p className="text-sm">{t('balancer.presets.noResults', 'Сәйкес реакция табылмады')}</p>
            </div>
          ) : (
            filteredPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectReaction(preset.equation);
                  onClose();
                }}
                className="w-full p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-teal-500/50 transition-all text-left group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors truncate">
                      {preset.name[currentLang] || preset.name.kk}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        preset.difficulty === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : preset.difficulty === 'medium'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30'
                      }`}
                    >
                      {preset.difficulty}
                    </span>
                  </div>

                  <div className="font-mono text-xs text-teal-700 dark:text-teal-400 font-semibold tracking-wide">
                    {formatToUnicode(preset.equation)}
                  </div>

                  {preset.description?.[currentLang] && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                      {preset.description[currentLang]}
                    </p>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
