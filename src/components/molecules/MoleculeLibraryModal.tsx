import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import moleculesData from '../../data/molecules.json';
import { MoleculeGraph, PresetMolecule } from '../../types/molecule';
import { formatFormulaSubscripts } from '../../utils/mol/formula';

interface MoleculeLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMolecule: (graph: MoleculeGraph) => void;
  lang: 'kk' | 'ru' | 'en';
}

const presets = moleculesData as PresetMolecule[];

export const MoleculeLibraryModal: React.FC<MoleculeLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMolecule,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: { kk: 'Барлығы', ru: 'Все', en: 'All' } },
    { id: 'inorganic', label: { kk: 'Бейорганикалық', ru: 'Неорганика', en: 'Inorganic' } },
    { id: 'organic', label: { kk: 'Органикалық', ru: 'Органика', en: 'Organic' } },
    { id: 'acid', label: { kk: 'Қышқылдар', ru: 'Кислоты', en: 'Acids' } },
    { id: 'salt', label: { kk: 'Тұздар', ru: 'Соли', en: 'Salts' } },
    { id: 'medicine', label: { kk: 'Медицина', ru: 'Медицина', en: 'Medicine' } },
  ];

  const filteredMolecules = useMemo(() => {
    return presets.filter((mol) => {
      // Category filter
      if (selectedCategory !== 'all' && mol.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          mol.name.kk.toLowerCase().includes(q) ||
          mol.name.ru.toLowerCase().includes(q) ||
          mol.name.en.toLowerCase().includes(q);
        const matchesFormula = mol.formula.toLowerCase().includes(q);
        return matchesName || matchesFormula;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const t = {
    title: lang === 'kk' ? 'Молекулалар кітапханасы' : lang === 'ru' ? 'Библиотека молекул' : 'Molecule Library',
    searchPlaceholder: lang === 'kk' ? 'Атауы немесе формуласы бойынша іздеу...' : lang === 'ru' ? 'Поиск по названию или формуле...' : 'Search by name or formula...',
    loadBtn: lang === 'kk' ? 'Редакторға жүктеу' : lang === 'ru' ? 'Загрузить в редактор' : 'Load into Editor',
    noResults: lang === 'kk' ? 'Молекула табылмады' : lang === 'ru' ? 'Молекул не найдено' : 'No molecules found',
    atomsCount: lang === 'kk' ? 'атом' : lang === 'ru' ? 'атомов' : 'atoms',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.title}</h2>
              <span className="text-xs text-slate-500">{presets.length} молекул в базе</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {cat.label[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Molecules Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMolecules.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              {t.noResults}
            </div>
          ) : (
            filteredMolecules.map((mol) => (
              <div
                key={mol.id}
                className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50 bg-white dark:bg-slate-850 hover:bg-teal-50/20 dark:hover:bg-teal-950/10 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-lg text-teal-600 dark:text-teal-400">
                      {formatFormulaSubscripts(mol.formula)}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {mol.atoms.length} {t.atomsCount}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {mol.name[lang]}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {mol.description[lang]}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectMolecule({ atoms: mol.atoms, bonds: mol.bonds });
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-teal-500 group-hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t.loadBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
