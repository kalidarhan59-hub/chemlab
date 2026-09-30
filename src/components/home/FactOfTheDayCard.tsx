import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Share2, Check, Lightbulb, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import factsData from '../../data/facts.json';
import { getTodayFact, getDayOfYear, tData } from '../../utils/helpers';
import { useLanguage } from '../../hooks/useLanguage';
import { ChemistryFact } from '../../types';

export const FactOfTheDayCard: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const facts = factsData as unknown as ChemistryFact[];
  const todayFact = getTodayFact(facts);
  const dayOfYear = getDayOfYear();

  const factText = todayFact[language] || todayFact.kk || todayFact.ru;
  const categoryName = tData(todayFact.category, language);

  const handleShare = async () => {
    const shareText = `🔬 ChemLab Fact of the Day: "${factText}" (${todayFact.formula}) #ChemLab`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChemLab - Химия фактісі',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card
          padding="lg"
          className="relative border-teal-500/30 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-transparent glow-teal"
        >
          {/* Top header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {t('factOfTheDay.badge')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {t('factOfTheDay.title')}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="purple" size="sm">
                {t('factOfTheDay.dayOfYear', { day: dayOfYear })}
              </Badge>
              {categoryName && (
                <Badge variant="amber" size="sm">
                  {categoryName}
                </Badge>
              )}
            </div>
          </div>

          {/* Main Fact Body */}
          <div className="my-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
            {todayFact.formula && (
              <div className="shrink-0 px-4 py-3 rounded-xl bg-gradient-to-tr from-teal-500 to-purple-600 text-white font-mono font-bold text-xl sm:text-2xl shadow-md min-w-[70px] text-center">
                {todayFact.formula}
              </div>
            )}
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              «{factText}»
            </p>
          </div>

          {/* Footer of Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('factOfTheDay.nextFactIn')}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            >
              {copied ? t('common.copied') : t('factOfTheDay.shareFact')}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};
