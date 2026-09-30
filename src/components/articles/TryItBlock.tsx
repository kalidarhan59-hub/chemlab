import React from 'react';
import { FlaskConical, AlertTriangle, CheckCircle } from 'lucide-react';
import { FormulaText } from '../ui/FormulaText';

interface TryItBlockProps {
  tryIt: {
    title: { kk: string; ru: string; en: string };
    itemsNeeded: { kk: string[]; ru: string[]; en: string[] };
    steps: { kk: string[]; ru: string[]; en: string[] };
    result: { kk: string; ru: string; en: string };
    explanation: { kk: string; ru: string; en: string };
    safetyWarning: { kk: string; ru: string; en: string };
  };
  lang: 'kk' | 'ru' | 'en';
}

export const TryItBlock: React.FC<TryItBlockProps> = ({ tryIt, lang }) => {
  const t = {
    badge: lang === 'kk' ? 'Өзің жасап көр: Қауіпсіз үйдегі тәжірибе' : lang === 'ru' ? 'Попробуй сам: Безопасный домашний опыт' : 'Try It Yourself: Safe Home Experiment',
    needed: lang === 'kk' ? 'Не қажет:' : lang === 'ru' ? 'Что понадобится:' : 'What you need:',
    steps: lang === 'kk' ? 'Іс-әрекет реті:' : lang === 'ru' ? 'Порядок действий:' : 'Steps to follow:',
    result: lang === 'kk' ? 'Нәтиже:' : lang === 'ru' ? 'Результат:' : 'Result:',
    why: lang === 'kk' ? 'Неге бұлай болды?' : lang === 'ru' ? 'Почему так происходит?' : 'Why does this happen?',
  };

  return (
    <div id="try-it" className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
        <FlaskConical className="w-5 h-5" />
        <span>{t.badge}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        {tryIt.title[lang] || tryIt.title.kk}
      </h3>

      {/* Safety Warning */}
      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
        <span>{tryIt.safetyWarning[lang] || tryIt.safetyWarning.kk}</span>
      </div>

      {/* What you need */}
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{t.needed}</span>
        <ul className="flex flex-wrap gap-2 pt-1">
          {(tryIt.itemsNeeded[lang] || tryIt.itemsNeeded.kk).map((item, idx) => (
            <li key={idx} className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-semibold">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{t.steps}</span>
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {(tryIt.steps[lang] || tryIt.steps.kk).map((step, idx) => (
            <p key={idx} className="leading-relaxed">
              {step}
            </p>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
        <div>
          <span className="font-bold block">{t.result}</span>
          <span>{tryIt.result[lang] || tryIt.result.kk}</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="text-xs text-slate-700 dark:text-slate-300">
        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">{t.why}</span>
        <FormulaText text={tryIt.explanation[lang] || tryIt.explanation.kk} />
      </div>
    </div>
  );
};
