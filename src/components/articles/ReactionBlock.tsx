import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FormulaText } from '../ui/FormulaText';

interface ReactionBlockProps {
  reaction: {
    equation: string;
    type: { kk: string; ru: string; en: string };
    explanation: { kk: string[]; ru: string[]; en: string[] };
    balancerEquation?: string;
  };
  lang: 'kk' | 'ru' | 'en';
}

export const ReactionBlock: React.FC<ReactionBlockProps> = ({ reaction, lang }) => {
  const t = {
    title: lang === 'kk' ? 'Бұл жерде қандай химиялық реакция жүреді?' : lang === 'ru' ? 'Какая здесь реакция?' : 'What Chemistry Reaction is Here?',
    openBalancer: lang === 'kk' ? 'Теңдестірушіде ашу' : lang === 'ru' ? 'Открыть в балансировщике' : 'Open in Balancer',
  };

  const balancerUrl = reaction.balancerEquation
    ? `/${lang}/balancer?eq=${encodeURIComponent(reaction.balancerEquation)}`
    : `/${lang}/balancer`;

  return (
    <div id="reaction" className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 via-purple-500/5 to-transparent border border-teal-500/30 shadow-xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-extrabold text-sm uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t.title}</span>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300">
          {reaction.type[lang] || reaction.type.kk}
        </span>
      </div>

      {/* Render Reaction Formula via FormulaText */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-teal-300 font-mono font-bold text-center text-base sm:text-lg overflow-x-auto shadow-inner border border-slate-200 dark:border-slate-800">
        <FormulaText text={reaction.equation} />
      </div>

      {/* Step by step breakdown */}
      <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        {(reaction.explanation[lang] || reaction.explanation.kk).map((step, idx) => (
          <p key={idx} className="leading-relaxed">
            <FormulaText text={step} />
          </p>
        ))}
      </div>

      {/* Button to open in Balancer */}
      <div className="pt-2 flex justify-end">
        <Link
          to={balancerUrl}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white shadow-md transition-all active:scale-95"
        >
          <span>{t.openBalancer}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
