import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FlaskConical, ShieldCheck, Heart, Sparkles, Mail } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const links = [
    { label: t('nav.periodicTable'), path: `/${language}/periodic-table` },
    { label: t('nav.balancer'), path: `/${language}/balancer` },
    { label: t('nav.lab'), path: `/${language}/lab` },
    { label: t('nav.molecules'), path: `/${language}/molecules` },
    { label: t('nav.articles'), path: `/${language}/articles` },
    { label: t('nav.trainer'), path: `/${language}/trainer` },
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-white/10 bg-slate-100/60 dark:bg-[#0B1220]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link to={`/${language}`} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-purple-600 p-[2px]">
                <div className="w-full h-full bg-white dark:bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                  <FlaskConical className="w-4 h-4 text-teal-500" />
                </div>
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                Chem<span className="text-teal-500 dark:text-teal-400">Lab</span>
              </span>
            </Link>
            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md leading-relaxed font-normal">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-400 pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('about.safetyTitle')}</span>
              <span className="text-slate-400">•</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{t('footer.openSource')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              {t('common.explore')}
            </h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Authorship */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              {t('nav.about')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to={`/${language}/about`}
                  className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-colors font-medium"
                >
                  {t('about.missionTitle')}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${language}/about#safety`}
                  className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-colors font-medium"
                >
                  {t('common.safetyFirst')}
                </Link>
              </li>
              <li className="pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">
                <span>Akbobek</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <p>© {currentYear} ChemLab. {t('footer.rights')}</p>
          <div className="flex items-center gap-1.5">
            <span>{t('footer.madeWith')}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
