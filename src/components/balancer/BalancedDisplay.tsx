import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Share2, Sparkles, Flame, Atom } from 'lucide-react';
import { BalancedEquationResult } from '../../utils/balancer/matrixSolver';
import { classifyReaction } from '../../utils/balancer/reactionTypes';

interface BalancedDisplayProps {
  result: BalancedEquationResult;
  onSelectCompound?: (formula: string) => void;
}

export const BalancedDisplay: React.FC<BalancedDisplayProps> = ({ result, onSelectCompound }) => {
  const { t } = useTranslation();
  const [copiedType, setCopiedType] = useState<'text' | 'latex' | 'share' | null>(null);

  const classification = classifyReaction(result.reactants, result.products);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(result.fullEquationUnicode);
      setCopiedType('text');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLatex = async () => {
    try {
      // Build LaTeX representation
      const left = result.reactants
        .map((r, i) => `${result.reactantCoefficients[i] > 1 ? result.reactantCoefficients[i] : ''}\\text{${r.formula}}`)
        .join(' + ');
      const right = result.products
        .map((p, i) => `${result.productCoefficients[i] > 1 ? result.productCoefficients[i] : ''}\\text{${p.formula}}`)
        .join(' + ');
      const latex = `${left} \\longrightarrow ${right}`;

      await navigator.clipboard.writeText(latex);
      setCopiedType('latex');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);
      // Clean eq param
      const rawEq = `${result.reactants.map((r) => r.formula).join('+')}=${result.products.map((p) => p.formula).join('+')}`;
      url.searchParams.set('eq', rawEq);
      await navigator.clipboard.writeText(url.toString());
      setCopiedType('share');
      setTimeout(() => setCopiedType(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-white/90 dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-950/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header tags */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Reaction Type Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            {t(`balancer.reactionTypes.${classification.typeKey}`, classification.typeKey)}
          </span>

          {classification.isRedox && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              {t('balancer.types.redoxBadge', 'Тотығу-тотықсыздану (ОВР)')}
            </span>
          )}

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
            <Atom className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            {t('balancer.status.balancedSuccess', 'Теңестірілді')}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title={t('balancer.actions.copyEquation', 'Теңдеуді көшіру')}
          >
            {copiedType === 'text' ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedType === 'text' ? t('common.copied', 'Көшірілді!') : t('common.copy', 'Көшіру')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLatex}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all hidden sm:flex items-center gap-1.5 shadow-sm font-mono cursor-pointer"
            title="Copy LaTeX"
          >
            {copiedType === 'latex' ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <span className="text-[11px] font-bold">TeX</span>}
            <span>LaTeX</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            title={t('common.share', 'Бөлісу')}
          >
            {copiedType === 'share' ? <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{t('common.share', 'Бөлісу')}</span>
          </button>
        </div>
      </div>

      {/* Main Formula display */}
      <div className="relative z-10 py-3 sm:py-5 flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-3 font-mono text-xl sm:text-2xl md:text-3xl text-center select-text">
        {/* Reactants */}
        {result.reactants.map((reactant, idx) => {
          const coeff = result.reactantCoefficients[idx];
          return (
            <React.Fragment key={`r-${idx}`}>
              {idx > 0 && <span className="text-slate-600 dark:text-slate-400 font-sans mx-1 sm:mx-2">+</span>}
              <button
                type="button"
                onClick={() => onSelectCompound?.(reactant.formula)}
                className="group relative inline-flex items-center hover:scale-105 transition-transform cursor-pointer"
                title={`${t('balancer.calculators.molarMass')}: ${reactant.molarMass} g/mol`}
              >
                {coeff > 1 && (
                  <span className="text-teal-600 dark:text-teal-400 font-extrabold mr-0.5 tracking-tight group-hover:text-teal-500 dark:group-hover:text-teal-300">
                    {coeff}
                  </span>
                )}
                <span
                  className="text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-200 underline decoration-teal-500/40 underline-offset-4"
                  dangerouslySetInnerHTML={{ __html: reactant.formattedHtml }}
                />
              </button>
            </React.Fragment>
          );
        })}

        {/* Reaction arrow */}
        <span className="text-teal-600 dark:text-teal-400 font-extrabold mx-2 sm:mx-4 tracking-wider">&rarr;</span>

        {/* Products */}
        {result.products.map((product, idx) => {
          const coeff = result.productCoefficients[idx];
          return (
            <React.Fragment key={`p-${idx}`}>
              {idx > 0 && <span className="text-slate-600 dark:text-slate-400 font-sans mx-1 sm:mx-2">+</span>}
              <button
                type="button"
                onClick={() => onSelectCompound?.(product.formula)}
                className="group relative inline-flex items-center hover:scale-105 transition-transform cursor-pointer"
                title={`${t('balancer.calculators.molarMass')}: ${product.molarMass} g/mol`}
              >
                {coeff > 1 && (
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold mr-0.5 tracking-tight group-hover:text-purple-500 dark:group-hover:text-purple-300">
                    {coeff}
                  </span>
                )}
                <span
                  className="text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-200 underline decoration-purple-500/40 underline-offset-4"
                  dangerouslySetInnerHTML={{ __html: product.formattedHtml }}
                />
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Participant Molar Mass Badges */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-medium mr-1 text-[11px] uppercase tracking-wider">
          {t('balancer.calculators.molarMasses', 'Молярлық массалар')}:
        </span>
        {[...result.reactants, ...result.products].map((comp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectCompound?.(comp.formula)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <span dangerouslySetInnerHTML={{ __html: comp.formattedHtml }} />
            <span className="text-slate-400 dark:text-slate-500">:</span>
            <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">{comp.molarMass}</span>
            <span className="text-[10px] text-slate-500">г/моль</span>
          </button>
        ))}
      </div>
    </div>
  );
};
