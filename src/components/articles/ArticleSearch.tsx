import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

interface ArticleSearchProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'newest' | 'shortest' | 'popular';
  onSortChange: (sort: 'newest' | 'shortest' | 'popular') => void;
  lang: 'kk' | 'ru' | 'en';
}

export const ArticleSearch: React.FC<ArticleSearchProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  lang,
}) => {
  const t = {
    searchPlaceholder:
      lang === 'kk'
        ? 'Мақалаларды іздеу...'
        : lang === 'ru'
        ? 'Поиск статей по заголовку и тексту...'
        : 'Search articles by title or topic...',
    newest: lang === 'kk' ? 'Жаңадан бастап' : lang === 'ru' ? 'Сначала новые' : 'Newest',
    shortest: lang === 'kk' ? 'Қысқа мақалалар' : lang === 'ru' ? 'Короткое время чтения' : 'Shortest read',
    popular: lang === 'kk' ? 'Популярлы' : lang === 'ru' ? 'Популярные' : 'Popular',
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
        />
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="px-3 py-2.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-sm w-full sm:w-auto"
        >
          <option value="newest">{t.newest}</option>
          <option value="shortest">{t.shortest}</option>
          <option value="popular">{t.popular}</option>
        </select>
      </div>
    </div>
  );
};
