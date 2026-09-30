import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Button } from '../ui/Button';
import { MoleculeCanvas } from './MoleculeCanvas';
import { useLanguage } from '../../hooks/useLanguage';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-6 pb-14 sm:pb-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {t('hero.titlePart1')}
              <span className="text-gradient mx-1">{t('hero.titleGradient')}</span>
              {t('hero.titlePart2')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('hero.subtitle')}
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to={`/${language}/periodic-table`} className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5 ml-1" />}
                  className="w-full sm:w-auto shadow-xl"
                >
                  {t('hero.ctaStart')}
                </Button>
              </Link>

              <a href="#modules" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Layers className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {t('hero.ctaExplore')}
                </Button>
              </a>
            </div>

            {/* Quick Stats bar */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-3 gap-3 sm:gap-6 text-center lg:text-left">
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
                  {t('hero.statsElements')}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  IUPAC 1-118
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                  {t('hero.statsReactions')}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  ОВР & Стехиометрия
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-mono">
                  {t('hero.statsInteractive')}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  {t('hero.activeUsers')}
                </div>
              </div>
            </div>
          </div>

          {/* Right 3D Molecule Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl glass-panel p-2 shadow-2xl border border-teal-500/20 glow-teal overflow-hidden group">
              <MoleculeCanvas />

              {/* Molecule Info Label at bottom corner */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 dark:bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                  <span className="font-mono font-semibold text-teal-300">3D Interactive</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {language === 'kk' ? 'Тышқанмен айналдырыңыз' : language === 'ru' ? 'Вращайте мышью' : 'Drag to rotate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
