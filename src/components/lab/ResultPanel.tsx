import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  Copy,
  Check,
  Flame,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Wind,
  Layers,
  Thermometer,
} from 'lucide-react';
import { VesselState, LabReaction } from '../../utils/lab/reactionEngine';

interface ResultPanelProps {
  vessel: VesselState;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ vessel }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';
  const [copied, setCopied] = useState<boolean>(false);

  const reaction = vessel.lastReaction;
  const impossible = vessel.impossibleNotice;

  const handleCopyEquation = async () => {
    if (!reaction) return;
    try {
      await navigator.clipboard.writeText(
        `${reaction.equations.molecular}\nИондық қысқаша: ${reaction.equations.netIonic}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // State 1: A reaction has completed
  if (reaction) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/70 border border-teal-500/30 dark:border-teal-500/40 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4 animate-in fade-in duration-300 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {t(`lab.reactionTypes.${reaction.type}`, reaction.type)}
            </span>

            {reaction.effects.precipitate && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/50"
                  style={{ backgroundColor: reaction.effects.precipitate.hex }}
                />
                <span>{reaction.effects.precipitate.name[currentLang]}</span>
              </span>
            )}

            {reaction.effects.gas && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{reaction.effects.gas.name[currentLang]}</span>
              </span>
            )}

            {reaction.effects.temperature === 'exothermic' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>{t('lab.effects.exothermic', 'Экзотермиялық (жылу бөлінді)')}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyEquation}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('common.copied', 'Көшірілді!') : t('common.copy', 'Көшіру')}</span>
          </button>
        </div>

        {/* Chemical Equations */}
        <div className="space-y-2 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-sans font-bold tracking-wider">
            {t('lab.results.molecularEquation', 'Молекулалық теңдеу')}:
          </div>
          <div className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base tracking-wide">
            {reaction.equations.molecular}
          </div>

          {reaction.equations.netIonic && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-sans font-bold tracking-wider block">
                {t('lab.results.netIonicEquation', 'Қысқаша иондық теңдеу')}:
              </span>
              <span className="text-teal-700 dark:text-teal-300 text-xs sm:text-sm font-semibold">
                {reaction.equations.netIonic}
              </span>
            </div>
          )}
        </div>

        {/* Plain Language Explanation */}
        <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">
            {t('lab.results.explanationTitle', 'Тәжірибе нәтижесі')}:
          </span>
          <p>{reaction.explanation[currentLang] || reaction.explanation.kk}</p>
        </div>

        {/* Real-World Practical Fact */}
        {reaction.practicalFact && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-teal-500/10 border border-amber-500/30 flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-amber-800 dark:text-amber-300 block text-[11px] uppercase tracking-wider">
                {t('lab.results.factTitle', 'Енді білесіз бе?')}
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {reaction.practicalFact[currentLang] || reaction.practicalFact.kk}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // State 2: Reaction did not occur (impossible notice)
  if (impossible) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/60 border border-amber-500/40 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-3 animate-in fade-in duration-200">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{t('lab.results.noReactionTitle', 'Реакция жүрмейді')}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {impossible[currentLang] || impossible.kk}
        </p>
      </div>
    );
  }

  // State 3: Empty vessel or single reagent added
  return (
    <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center text-slate-600 dark:text-slate-400 backdrop-blur-md space-y-2">
      <Droplets className="w-7 h-7 mx-auto text-slate-400 dark:text-slate-500" />
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {t('lab.results.idleTitle', 'Тәжірибені бастаңыз')}
      </h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
        {t(
          'lab.results.idleSubtitle',
          'Сөреден екінші реактивті сынауыққа тартып әкеліңіз немесе спиртшамды қосып қыздырыңыз.'
        )}
      </p>
    </div>
  );
};
