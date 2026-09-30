import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { ArticleTopic, ArticleData } from '../../types/article';
import { ARTICLES_DATA } from '../../data/articlesData';
import { ArticleCard } from './ArticleCard';
import { TopicFilter } from './TopicFilter';
import { ArticleSearch } from './ArticleSearch';
import { SEO } from '../ui/SEO';

interface ArticleListProps {
  lang: 'kk' | 'ru' | 'en';
}

const READ_STORAGE_KEY = 'chemlab:articles-read';
const FAVORITES_STORAGE_KEY = 'chemlab:articles-favorites';

export const ArticleList: React.FC<ArticleListProps> = ({ lang }) => {
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopic | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'shortest' | 'popular'>('newest');

  // Read status from localStorage
  const [readSlugs, setReadSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites status from localStorage
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (slug: string) => {
    setFavoriteSlugs((prev) => {
      const updated = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Filter & sort articles
  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter((article) => {
      // Topic filter
      if (selectedTopic !== 'all' && article.topic !== selectedTopic) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (article.title[lang] || article.title.kk).toLowerCase();
        const summary = (article.summary[lang] || article.summary.kk).toLowerCase();
        const bodyText = (article.body[lang] || article.body.kk).join(' ').toLowerCase();
        return title.includes(q) || summary.includes(q) || bodyText.includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'shortest') {
        return a.readingTime - b.readingTime;
      }
      if (sortBy === 'popular') {
        return (favoriteSlugs.includes(b.slug) ? 1 : 0) - (favoriteSlugs.includes(a.slug) ? 1 : 0);
      }
      // Newest
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [selectedTopic, searchQuery, sortBy, lang, favoriteSlugs]);

  const t = {
    seoTitle:
      lang === 'kk'
        ? 'Химия біздің айналамызда — Тұрмыстағы химия мақалалары | ChemLab'
        : lang === 'ru'
        ? 'Химия вокруг нас — Статьи о химии в быту и природе | ChemLab'
        : 'Chemistry Around Us — Real-life Chemistry Articles | ChemLab',
    seoDesc:
      lang === 'kk'
        ? 'Тамақ дайындау, денсаулық, табиғат пен өнеркәсіптегі химиялық құбылыстар туралы қызықты мақалалар және қауіпсіз үйдегі тәжірибелер.'
        : lang === 'ru'
        ? 'Увлекательные статьи о химии в быту, природе, кулинарии и промышленности с безопасными домашними опытами.'
        : 'Fascinating articles about chemistry in kitchen, nature, health, and industry with safe home experiments.',
    heroBadge: lang === 'kk' ? '🧪 Тұрмыстық химия кітапханасы' : lang === 'ru' ? '🧪 Библиотека бытовой химии' : '🧪 Everyday Chemistry Library',
    heroTitle: lang === 'kk' ? 'Химия біздің ' : lang === 'ru' ? 'Химия вокруг ' : 'Chemistry All ',
    heroGradient: lang === 'kk' ? 'айналамызда' : lang === 'ru' ? 'нас каждый день' : 'Around Us',
    readCounter:
      lang === 'kk'
        ? `Оқылды: ${readSlugs.length} / ${ARTICLES_DATA.length}`
        : lang === 'ru'
        ? `Прочитано ${readSlugs.length} из ${ARTICLES_DATA.length}`
        : `Read ${readSlugs.length} of ${ARTICLES_DATA.length}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <SEO title={t.seoTitle} description={t.seoDesc} path="articles" />

      {/* Hero Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold shadow-sm">
          <BookOpen className="w-4 h-4" />
          <span>{t.heroBadge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.heroTitle}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-700 via-purple-700 to-indigo-700 dark:from-teal-400 dark:via-purple-400 dark:to-indigo-400">
            {t.heroGradient}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {t.seoDesc}
        </p>

        {/* Read Progress counter */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t.readCounter}</span>
        </div>
      </div>

      {/* Search & Topic Filters */}
      <div className="space-y-4 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-lg">
        <ArticleSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          lang={lang}
        />
        <TopicFilter
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          lang={lang}
        />
      </div>

      {/* Article Cards Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              lang={lang}
              isRead={readSlugs.includes(article.slug)}
              isFavorite={favoriteSlugs.includes(article.slug)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500">
          <p className="text-sm font-semibold">
            {lang === 'kk' ? 'Ештеңе табылмады. Басқа кілт сөзді енгізіп көріңіз.' : lang === 'ru' ? 'Ничего не найдено. Попробуйте другой запрос.' : 'No articles found. Try another search.'}
          </p>
        </div>
      )}
    </div>
  );
};
