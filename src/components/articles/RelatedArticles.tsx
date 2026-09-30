import React from 'react';
import { ArticleData } from '../../types/article';
import { ArticleCard } from './ArticleCard';

interface RelatedArticlesProps {
  currentSlug: string;
  topic: string;
  articles: ArticleData[];
  lang: 'kk' | 'ru' | 'en';
  readSlugs: string[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({
  currentSlug,
  topic,
  articles,
  lang,
  readSlugs,
}) => {
  // Find up to 3 articles in same topic or random
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .sort((a, b) => (a.topic === topic ? -1 : 1))
    .slice(0, 3);

  const t = {
    title: lang === 'kk' ? 'Ұқсас мақалалар' : lang === 'ru' ? 'Похожие статьи' : 'Related Articles',
  };

  if (related.length === 0) return null;

  return (
    <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
        {t.title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((art) => (
          <ArticleCard
            key={art.slug}
            article={art}
            lang={lang}
            isRead={readSlugs.includes(art.slug)}
          />
        ))}
      </div>
    </div>
  );
};
