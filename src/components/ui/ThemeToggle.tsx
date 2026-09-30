import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === 'dark';
  const label = isDark ? t('common.themeLight') : t('common.themeDark');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`
        relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none
        border border-slate-300/60 dark:border-white/10
        bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700/80
        text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
        min-w-[44px] min-h-[44px] flex items-center justify-center
        ${className}
      `}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
