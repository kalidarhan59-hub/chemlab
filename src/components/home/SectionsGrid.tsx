import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table2,
  Scale,
  FlaskConical,
  Atom,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { SectionTitle } from '../ui/SectionTitle';
import { useLanguage } from '../../hooks/useLanguage';
import { MODULES_CONFIG } from '../../utils/constants';
import { ModuleKey } from '../../types';

export const SectionsGrid: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const iconMap: Record<string, React.ReactNode> = {
    Table2: <Table2 className="w-6 h-6" />,
    Scale: <Scale className="w-6 h-6" />,
    FlaskConical: <FlaskConical className="w-6 h-6" />,
    Atom: <Atom className="w-6 h-6" />,
    BookOpen: <BookOpen className="w-6 h-6" />,
    Trophy: <Trophy className="w-6 h-6" />,
  };

  return (
    <section id="modules" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t('common.explore')}
          title={t('sections.title')}
          subtitle={t('sections.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MODULES_CONFIG.map((mod) => {
            const key = mod.key as ModuleKey;
            const title = t(`sections.${key}.title`);
            const shortDesc = t(`sections.${key}.shortDesc`);
            const badge = t(`sections.${key}.badge`);
            const targetUrl = `/${language}/${mod.path}`;

            return (
              <Link
                key={mod.key}
                to={targetUrl}
                className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-2xl block"
              >
                <Card
                  hoverable
                  padding="lg"
                  className="h-full flex flex-col justify-between border-slate-200/80 dark:border-white/10 group-hover:border-teal-500/40 transition-all duration-300"
                >
                  <div>
                    {/* Top row with icon & badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${mod.gradient} flex items-center justify-center text-white shadow-md shadow-black/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {iconMap[mod.iconName]}
                      </div>
                      <Badge variant="teal" size="sm">
                        {badge}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2.5">
                      {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {shortDesc}
                    </p>
                  </div>

                  {/* Bottom link indicator */}
                  <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('common.learnMore')}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
