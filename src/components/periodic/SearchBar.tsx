import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('periodicTable.searchPlaceholder')}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all shadow-xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
