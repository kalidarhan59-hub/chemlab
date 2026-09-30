import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Users,
  ShieldAlert,
  Mail,
  Sparkles,
  CheckCircle,
  FlaskConical,
  Award,
  Layers,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SectionTitle } from '../components/ui/SectionTitle';
import { PageTransition } from '../components/ui/PageTransition';
import { SEO } from '../components/ui/SEO';
import { useLanguage } from '../hooks/useLanguage';
import { MODULES_CONFIG } from '../utils/constants';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const audienceIcons = [
    <GraduationCap className="w-6 h-6 text-teal-500" />,
    <Award className="w-6 h-6 text-purple-500" />,
    <Users className="w-6 h-6 text-blue-500" />,
    <FlaskConical className="w-6 h-6 text-amber-500" />,
  ];

  const rawAudiences = t('about.audiences', { returnObjects: true });
  const audiencesList = Array.isArray(rawAudiences) ? rawAudiences : [];
  const audiences: Array<{ icon: React.ReactNode; role: string; desc: string }> = audiencesList.map((item, idx) => ({
    icon: audienceIcons[idx % audienceIcons.length],
    role: typeof item === 'object' && item?.role ? item.role : String(item),
    desc: typeof item === 'object' && item?.desc ? item.desc : '',
  }));

  const rawSafetyRules = t('about.safetyRules', { returnObjects: true });
  const safetyRules: string[] = Array.isArray(rawSafetyRules) ? rawSafetyRules : [];

  return (
    <PageTransition>
      <SEO
        title={t('about.title')}
        description={t('about.subtitle')}
        path="about"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-24">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="teal" size="md">
            {t('nav.about')}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Statement */}
        <Card padding="lg" className="border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-purple-500/5 to-transparent glow-teal">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-teal-500/20 text-teal-500">
              <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t('about.missionTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {t('about.missionText')}
            </p>
          </div>
        </Card>

        {/* Target Audience */}
        <div>
          <SectionTitle
            badge={t('about.audienceTitle')}
            title={t('about.audienceTitle')}
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {audiences.map((item, idx) => (
              <Card key={idx} hoverable padding="lg" className="border-slate-200/80 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                    {item.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Modules Overview */}
        <div>
          <SectionTitle
            badge={t('common.explore')}
            title={t('sections.title')}
            subtitle={t('sections.subtitle')}
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES_CONFIG.map((mod) => (
              <Card key={mod.key} padding="md" className="border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${mod.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {t(`sections.${mod.key}.title`)}
                  </h4>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t(`sections.${mod.key}.shortDesc`)}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Laboratory Safety Rules */}
        <div id="safety">
          <Card padding="lg" className="border-amber-500/30 bg-amber-500/5">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-500 shrink-0">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <Badge variant="amber" size="sm" className="mb-2">
                    {t('common.safetyFirst')}
                  </Badge>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t('about.safetyTitle')}
                  </h2>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {t('about.safetySubtitle')}
                  </p>
                </div>

                <ul className="space-y-3 pt-2">
                  {safetyRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200">
                      <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Authorship Attribution */}
        <Card padding="lg" className="border-purple-500/30 text-center max-w-2xl mx-auto bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-500 flex items-center justify-center mx-auto mb-4 font-black text-xl">
            A
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Akbobek
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </Card>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
