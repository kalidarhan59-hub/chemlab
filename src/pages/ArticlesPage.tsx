import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { ArticleList } from '../components/articles/ArticleList';
import { ArticlePage } from '../components/articles/ArticlePage';
import { useLanguage } from '../hooks/useLanguage';

interface OutletContextType {
  openAiChatWithContext?: (context?: string) => void;
}

export const ArticlesPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { language } = useLanguage();
  const lang = (['kk', 'ru', 'en'].includes(language) ? language : 'kk') as 'kk' | 'ru' | 'en';

  const outletContext = useOutletContext<OutletContextType>();

  if (slug) {
    return (
      <ArticlePage
        lang={lang}
        onOpenAiChat={(topicContext) => {
          if (outletContext?.openAiChatWithContext) {
            outletContext.openAiChatWithContext(topicContext);
          }
        }}
      />
    );
  }

  return <ArticleList lang={lang} />;
};

export default ArticlesPage;
