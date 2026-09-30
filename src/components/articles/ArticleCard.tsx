import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Bookmark } from 'lucide-react';
import { ArticleData } from '../../types/article';
import { ArticleSvgCover } from './ArticleSvgIllustrations';

interface ArticleCardProps {
  article: ArticleData;
  lang: 'kk' | 'ru' | 'en';
  isRead: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
}

const TOPIC_LABELS: Record<string, { kk: string; ru: string; en: string }> = {
  kitchen: { kk: 'Асхана', ru: 'Кухня', en: 'Kitchen' },
  home: { kk: 'Үй', ru: 'Дом', en: 'Home' },
  nature: { kk: 'Табиғат', ru: 'Природа', en: 'Nature' },
  health: { kk: 'Денсаулық', ru: 'Здоровье', en: 'Health' },
  industry: { kk: 'Өнеркәсіп', ru: 'Промышленность', en: 'Industry' },
  kazakhstan: { kk: 'Қазақстан', ru: 'Казахстан', en: 'Kazakhstan' },
};

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  lang,
  isRead,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const topicLabel = TOPIC_LABELS[article.topic]?.[lang] || article.topic;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* SVG Cover Illustration */}
        <div className="relative overflow-hidden bg-slate-950 p-2">
          <ArticleSvgCover svgKey={article.coverSvgKey} />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/90 text-white backdrop-blur-md shadow-md">
              {topicLabel}
            </span>
            {isRead && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'kk' ? 'Оқылды' : lang === 'ru' ? 'Прочитано' : 'Read'}
              </span>
            )}
          </div>

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(article.slug);
              }}
              className={`absolute top-4 right-4 p-2 rounded-xl backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-900/60 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>
              {article.readingTime} {lang === 'kk' ? 'мин' : lang === 'ru' ? 'мин' : 'min'}
            </span>
            <span>•</span>
            <span>{article.date}</span>
          </div>

          <Link to={`/${lang}/articles/${article.slug}`} className="block">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors line-clamp-2 leading-snug">
              {article.title[lang] || article.title.kk}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {article.summary[lang] || article.summary.kk}
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          to={`/${lang}/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform"
        >
          <span>{lang === 'kk' ? 'Мақаланы оқу' : lang === 'ru' ? 'Читать статью' : 'Read Article'}</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};
