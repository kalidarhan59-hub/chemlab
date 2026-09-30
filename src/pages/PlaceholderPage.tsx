import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  CheckCircle2,
  Bell,
  ArrowLeft,
  Mail,
  Clock,
  Layers,
  Check,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/ui/PageTransition';
import { SEO } from '../components/ui/SEO';
import { useLanguage } from '../hooks/useLanguage';
import { isValidEmail } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';
import { ModuleKey } from '../types';

export interface PlaceholderPageProps {
  moduleKey: ModuleKey;
  icon: React.ReactNode;
  gradient: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  moduleKey,
  icon,
  gradient,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}:${moduleKey}`);
      return Boolean(stored);
    } catch {
      return false;
    }
  });
  const [error, setError] = useState(false);

  const moduleTitle = t(`sections.${moduleKey}.title`);
  const plannedItems: string[] = (t(`modulesPlanned.${moduleKey}`, { returnObjects: true }) as string[]) || [];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError(true);
      return;
    }
    try {
      localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}:${moduleKey}`, email);
      setSubscribed(true);
      setError(false);
    } catch {
      // ignore
    }
  };

  return (
    <PageTransition>
      <SEO
        title={moduleTitle}
        description={t(`sections.${moduleKey}.shortDesc`)}
        path={moduleKey}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Back Link */}
        <Link
          to={`/${language}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('placeholder.backToHome')}</span>
        </Link>

        {/* Hero Card */}
        <Card padding="lg" className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-purple-500/5 to-transparent glow-teal">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-xl shrink-0`}>
              {icon}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="teal" size="sm" dot>
                  {t('placeholder.badge')}
                </Badge>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2026</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('placeholder.title', { module: moduleTitle })}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t('placeholder.description')}
              </p>
            </div>
          </div>
        </Card>

        {/* Planned Features List */}
        <Card padding="lg" className="border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2.5 mb-6">
            <Layers className="w-5 h-5 text-teal-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('placeholder.featuresTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plannedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200/70 dark:border-white/5 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Subscribe for Notification */}
        <Card padding="lg" className="border-purple-500/20 bg-purple-500/5 glow-purple">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-500 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('placeholder.notifyTitle')}
            </h3>

            {subscribed ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>{t('placeholder.notifySuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder={t('placeholder.notifyPlaceholder')}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                      error ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                    }`}
                  />
                </div>
                <Button variant="gradient" size="md" type="submit">
                  {t('placeholder.notifyButton')}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};
