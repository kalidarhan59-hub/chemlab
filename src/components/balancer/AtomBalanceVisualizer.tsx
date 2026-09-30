import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, CheckCircle2, AlertCircle } from 'lucide-react';
import { EquationElementRow } from '../../utils/balancer/matrixSolver';
import elementsData from '../../data/elements.json';

interface AtomBalanceVisualizerProps {
  elementVerification: EquationElementRow[];
}

const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  H: { bg: 'bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-500/40' },
  C: { bg: 'bg-zinc-500/20', text: 'text-zinc-700 dark:text-zinc-300', border: 'border-zinc-500/40' },
  O: { bg: 'bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500/40' },
  N: { bg: 'bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-500/40' },
  Cl: { bg: 'bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500/40' },
  S: { bg: 'bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500/40' },
  Fe: { bg: 'bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500/40' },
  Cu: { bg: 'bg-amber-600/20', text: 'text-amber-800 dark:text-amber-400', border: 'border-amber-600/40' },
  Na: { bg: 'bg-violet-500/20', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-500/40' },
  K: { bg: 'bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-500/40' },
  Ca: { bg: 'bg-teal-500/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-500/40' },
  Mg: { bg: 'bg-emerald-600/20', text: 'text-emerald-800 dark:text-emerald-400', border: 'border-emerald-600/40' },
  Al: { bg: 'bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500/40' },
  P: { bg: 'bg-orange-600/20', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-600/40' },
  Charge: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-700 dark:text-fuchsia-300', border: 'border-fuchsia-500/40' },
};

export const AtomBalanceVisualizer: React.FC<AtomBalanceVisualizerProps> = ({ elementVerification }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  // Helper to get element name
  const getElementName = (sym: string) => {
    if (sym === 'Charge') {
      return t('balancer.visualizer.electricalCharge', 'Зарядтар балансы');
    }
    const found = (elementsData as any[]).find((el) => el.symbol === sym);
    return found?.name?.[currentLang] || sym;
  };

  const allBalanced = elementVerification.every((e) => e.isBalanced);

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {t('balancer.visualizer.title', 'Атомдардың сақталу таразысы')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t('balancer.visualizer.subtitle', 'Реагенттер мен өнімдер арасындағы атомдар мен зарядтардың теңдігі')}
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
          allBalanced 
            ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30' 
            : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
        }`}>
          {allBalanced ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('balancer.visualizer.allBalanced', 'Теңдік толық сақталған')}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t('balancer.visualizer.notBalanced', 'Теңсіздік анықталды')}</span>
            </>
          )}
        </div>
      </div>

      {/* Grid of elements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {elementVerification.map((row) => {
          const color = ELEMENT_COLORS[row.symbol] || {
            bg: 'bg-slate-100 dark:bg-slate-800',
            text: 'text-slate-700 dark:text-slate-300',
            border: 'border-slate-200 dark:border-slate-700',
          };
          const maxVal = Math.max(row.reactantsTotal, row.productsTotal, 1);
          const rPercent = (row.reactantsTotal / maxVal) * 100;
          const pPercent = (row.productsTotal / maxVal) * 100;

          return (
            <div
              key={row.symbol}
              className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${color.bg} ${color.border} border flex items-center justify-center font-bold text-xs ${color.text}`}>
                    {row.symbol}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block leading-tight">
                      {getElementName(row.symbol)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      {row.symbol !== 'Charge' ? `${t('balancer.visualizer.element', 'Элемент')} ${row.symbol}` : 'Net Charge'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">{row.reactantsTotal}</span>
                  <span className="text-slate-400">=</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{row.productsTotal}</span>
                  {row.isBalanced && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 ml-1" />
                  )}
                </div>
              </div>

              {/* Balance bar comparison */}
              <div className="space-y-1 mt-1 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-teal-600 dark:text-teal-400 w-12 truncate font-semibold">{t('balancer.visualizer.left', 'Сол (Р)')}:</span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${rPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 w-4 text-right">{row.reactantsTotal}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400 w-12 truncate font-semibold">{t('balancer.visualizer.right', 'Оң (Ө)')}:</span>
                  <div className="flex-1 bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pPercent}%` }}
                    />
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 w-4 text-right">{row.productsTotal}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
