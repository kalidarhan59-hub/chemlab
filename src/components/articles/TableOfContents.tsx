import React from 'react';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  hasReaction: boolean;
  hasTryIt: boolean;
  hasQuiz: boolean;
  lang: 'kk' | 'ru' | 'en';
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  hasReaction,
  hasTryIt,
  hasQuiz,
  lang,
}) => {
  const t = {
    toc: lang === 'kk' ? 'Мазмұны' : lang === 'ru' ? 'Оглавление' : 'Table of Contents',
    overview: lang === 'kk' ? 'Түсіндірме' : lang === 'ru' ? 'Объяснение' : 'Overview',
    reaction: lang === 'kk' ? 'Реакция теңдеуі' : lang === 'ru' ? 'Какая здесь реакция?' : 'Reaction Equation',
    experiment: lang === 'kk' ? 'Үйдегі тәжірибе' : lang === 'ru' ? 'Попробуй сам' : 'Home Experiment',
    fact: lang === 'kk' ? 'А сіз білдіңіз бе?' : lang === 'ru' ? 'А вы знали?' : 'Did You Know?',
    quiz: lang === 'kk' ? 'Мини-тест' : lang === 'ru' ? 'Мини-тест' : 'Mini-Quiz',
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden lg:block sticky top-24 p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-lg space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pb-2 border-b border-slate-200 dark:border-slate-800">
        <List className="w-4 h-4 text-teal-500" />
        <span>{t.toc}</span>
      </div>

      <nav className="space-y-2">
        <button
          type="button"
          onClick={() => scrollToSection('body')}
          className="block hover:text-teal-500 transition-colors text-left w-full cursor-pointer"
        >
          • {t.overview}
        </button>

        {hasReaction && (
          <button
            type="button"
            onClick={() => scrollToSection('reaction')}
            className="block hover:text-teal-500 transition-colors text-left w-full cursor-pointer"
          >
            • {t.reaction}
          </button>
        )}

        {hasTryIt && (
          <button
            type="button"
            onClick={() => scrollToSection('try-it')}
            className="block hover:text-teal-500 transition-colors text-left w-full cursor-pointer"
          >
            • {t.experiment}
          </button>
        )}

        <button
          type="button"
          onClick={() => scrollToSection('fact')}
          className="block hover:text-teal-500 transition-colors text-left w-full cursor-pointer"
        >
          • {t.fact}
        </button>

        {hasQuiz && (
          <button
            type="button"
            onClick={() => scrollToSection('quiz')}
            className="block hover:text-teal-500 transition-colors text-left w-full cursor-pointer"
          >
            • {t.quiz}
          </button>
        )}
      </nav>
    </div>
  );
};
