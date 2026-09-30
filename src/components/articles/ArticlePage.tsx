import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Bookmark, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { ARTICLES_DATA } from '../../data/articlesData';
import { ArticleSvgCover } from './ArticleSvgIllustrations';
import { ReactionBlock } from './ReactionBlock';
import { TryItBlock } from './TryItBlock';
import { ArticleQuiz } from './ArticleQuiz';
import { ShareButton } from './ShareButton';
import { RelatedArticles } from './RelatedArticles';
import { ReadingProgress } from './ReadingProgress';
import { TableOfContents } from './TableOfContents';
import { SEO } from '../ui/SEO';
import { FormulaText } from '../ui/FormulaText';

interface ArticlePageProps {
  lang: 'kk' | 'ru' | 'en';
  onOpenAiChat?: (topicContext?: string) => void;
}

const READ_STORAGE_KEY = 'chemlab:articles-read';
const FAVORITES_STORAGE_KEY = 'chemlab:articles-favorites';

export const ArticlePage: React.FC<ArticlePageProps> = ({ lang, onOpenAiChat }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = ARTICLES_DATA.find((a) => a.slug === slug);

  const [isFavorite, setIsFavorite] = useState(false);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);

  // Load read status & favorites
  useEffect(() => {
    if (!slug) return;

    try {
      // Mark current article as read in localStorage
      const savedRead = localStorage.getItem(READ_STORAGE_KEY);
      const readList: string[] = savedRead ? JSON.parse(savedRead) : [];
      if (!readList.includes(slug)) {
        readList.push(slug);
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readList));
      }
      setReadSlugs(readList);

      // Check favorite status
      const savedFav = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const favList: string[] = savedFav ? JSON.parse(savedFav) : [];
      setIsFavorite(favList.includes(slug));
    } catch {
      // Ignore storage errors
    }
  }, [slug]);

  const toggleFavorite = () => {
    if (!slug) return;
    try {
      const savedFav = localStorage.getItem(FAVORITES_STORAGE_KEY);
      let favList: string[] = savedFav ? JSON.parse(savedFav) : [];
      if (favList.includes(slug)) {
        favList = favList.filter((s) => s !== slug);
        setIsFavorite(false);
      } else {
        favList.push(slug);
        setIsFavorite(true);
      }
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favList));
    } catch {
      // Ignore
    }
  };

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {lang === 'kk' ? 'Мақала табылмады' : lang === 'ru' ? 'Статья не найдена' : 'Article Not Found'}
        </h2>
        <Link
          to={`/${lang}/articles`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'kk' ? 'Барлық мақалаларға қайту' : lang === 'ru' ? 'Назад к статьям' : 'Back to Articles'}</span>
        </Link>
      </div>
    );
  }

  const titleText = article.title[lang] || article.title.kk;
  const summaryText = article.summary[lang] || article.summary.kk;
  const bodyParagraphs = article.body[lang] || article.body.kk;

  const t = {
    back: lang === 'kk' ? 'Мақалалар каталогы' : lang === 'ru' ? 'Все статьи' : 'All Articles',
    askAi: lang === 'kk' ? 'Осы тақырып бойынша ИИ-көмекшіге сұрақ қою' : lang === 'ru' ? 'Спросить ИИ-помощника об этой теме' : 'Ask AI Assistant about this topic',
    didYouKnow: lang === 'kk' ? 'А сіз білдіңіз бе?' : lang === 'ru' ? 'А вы знали?' : 'Did You Know?',
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <ReadingProgress />

      <SEO
        title={`${titleText} | ChemLab`}
        description={summaryText}
        path={`articles/${article.slug}`}
      />

      {/* Back button */}
      <div className="mb-6">
        <Link
          to={`/${lang}/articles`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-500 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Main Content Area */}
        <article className="lg:col-span-3 space-y-8 bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-2xl">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                {article.topic}
              </span>

              <div className="flex items-center gap-3">
                <ShareButton title={titleText} lang={lang} />
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isFavorite
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-amber-500'
                  }`}
                  title="Сохранить в избранное"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              {titleText}
            </h1>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-500" />
                <span>
                  {article.readingTime} {lang === 'kk' ? 'минут' : lang === 'ru' ? 'минут чтения' : 'min read'}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>{article.date}</span>
              </div>
            </div>
          </div>

          {/* SVG Cover Illustration */}
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-slate-950 p-2">
            <ArticleSvgCover svgKey={article.coverSvgKey} />
          </div>

          {/* Article Summary Lead */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border-l-4 border-teal-500 text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {summaryText}
          </div>

          {/* Main Body Text */}
          <div id="body" className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {bodyParagraphs.map((para, idx) => (
              <p key={idx}>
                <FormulaText text={para} />
              </p>
            ))}
          </div>

          {/* Reaction Block */}
          {article.reaction && (
            <ReactionBlock reaction={article.reaction} lang={lang} />
          )}

          {/* Home Experiment Block */}
          {article.tryIt && (
            <TryItBlock tryIt={article.tryIt} lang={lang} />
          )}

          {/* Did You Know Box */}
          <div id="fact" className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{t.didYouKnow}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              <FormulaText text={article.didYouKnow[lang] || article.didYouKnow.kk} />
            </p>
          </div>

          {/* Ask AI Assistant Button */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-500/15 via-purple-500/15 to-indigo-500/15 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg">
            <div className="space-y-1">
              <span className="font-extrabold text-slate-900 dark:text-white text-base block flex items-center gap-2 justify-center sm:justify-start">
                <Bot className="w-5 h-5 text-teal-500" />
                <span>{t.askAi}</span>
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {lang === 'kk' ? 'ИИ-помощник осы мақала бойынша сұрақтарға жауап береді!' : lang === 'ru' ? 'ИИ-помощник ответит на любые дополнительные вопросы по этой теме!' : 'Our AI Assistant will answer any follow-up questions about this topic!'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenAiChat && onOpenAiChat(titleText)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all cursor-pointer shrink-0"
            >
              {lang === 'kk' ? 'Чатты ашу' : lang === 'ru' ? 'Открыть чат' : 'Open Chat'}
            </button>
          </div>

          {/* Mini-Quiz */}
          {article.quiz && article.quiz.length > 0 && (
            <ArticleQuiz quiz={article.quiz} lang={lang} />
          )}

          {/* Related Articles */}
          <RelatedArticles
            currentSlug={article.slug}
            topic={article.topic}
            articles={ARTICLES_DATA}
            lang={lang}
            readSlugs={readSlugs}
          />
        </article>

        {/* Sidebar Desktop Table of Contents */}
        <TableOfContents
          hasReaction={!!article.reaction}
          hasTryIt={!!article.tryIt}
          hasQuiz={!!article.quiz && article.quiz.length > 0}
          lang={lang}
        />
      </div>
    </div>
  );
};
