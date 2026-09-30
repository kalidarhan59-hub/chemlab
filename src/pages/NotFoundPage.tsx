import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { SEO } from '../components/ui/SEO';
import { useLanguage } from '../hooks/useLanguage';

export const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <PageTransition>
      <SEO
        title={t('notFound.title')}
        description={t('notFound.description')}
      />

      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <Card
          padding="lg"
          className="max-w-md w-full text-center border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent glow-amber"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest">
            HTTP 404 Error
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 mb-3">
            {t('notFound.title')}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {t('notFound.description')}
          </p>

          <Link to={`/${language}`}>
            <Button
              variant="gradient"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full"
            >
              {t('notFound.cta')}
            </Button>
          </Link>
        </Card>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
