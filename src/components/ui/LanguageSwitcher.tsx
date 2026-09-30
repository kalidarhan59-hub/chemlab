import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Language } from '../../types';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  const labels: Record<Language, { short: string; full: string }> = {
    kk: { short: 'KK', full: 'Қазақша' },
    ru: { short: 'RU', full: 'Русский' },
    en: { short: 'EN', full: 'English' },
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300/60 dark:border-white/10 ${className}`}
    >
      {supportedLanguages.map((lang) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-pressed={isActive}
            title={labels[lang].full}
            className={`
              px-2.5 py-1.5 min-w-[38px] min-h-[36px] sm:min-w-[42px] sm:min-h-[38px] rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer select-none flex items-center justify-center
              focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
              ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }
            `}
          >
            {labels[lang].short}
          </button>
        );
      })}
    </div>
  );
};
