import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Flame, Award, CheckCircle2, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useProgress } from '../../hooks/useProgress';
import { useLanguage } from '../../hooks/useLanguage';

export const UserProgressCard: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { progress } = useProgress();

  const points = progress?.points || 0;
  const streak = progress?.streak || 0;
  const solvedCount = progress?.solvedCount || 0;
  const level = progress?.level || 1;

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 2) return t('progressTracker.levelNovice');
    if (lvl <= 5) return t('progressTracker.levelIntermediate');
    return t('progressTracker.levelPro');
  };

  const isZero = points === 0 && streak === 0 && solvedCount === 0;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card padding="lg" className="border-purple-500/20 glow-purple">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('progressTracker.title')}
                </h3>
                <Badge variant="purple" size="sm">
                  {getLevelTitle(level)}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal">
                {t('progressTracker.subtitle')}
              </p>
            </div>

            <Link to={`/${language}/trainer`}>
              <Button
                variant="gradient"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                {t('progressTracker.continueQuiz')}
              </Button>
            </Link>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Streak */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {streak} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">{t('common.days')}</span>
                </div>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {t('progressTracker.streakLabel')}
                </div>
              </div>
            </div>

            {/* Points */}
            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-teal-500/20 text-teal-500 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {points}
                </div>
                <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {t('progressTracker.pointsLabel')}
                </div>
              </div>
            </div>

            {/* Solved Tasks */}
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {solvedCount}
                </div>
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {t('progressTracker.solvedLabel')}
                </div>
              </div>
            </div>
          </div>

          {/* Zero State message if user hasn't completed any quizzes yet */}
          {isZero && (
            <div className="mt-5 p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 text-center text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('progressTracker.zeroState')}</span>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
