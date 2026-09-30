import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, BookOpen, Check, Cpu } from 'lucide-react';
import { BalancedEquationResult } from '../../utils/balancer/matrixSolver';

interface StepByStepExplanationProps {
  result: BalancedEquationResult;
}

export const StepByStepExplanation: React.FC<StepByStepExplanationProps> = ({ result }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  if (!result.isSuccess) return null;

  return (
    <div className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-md transition-all shadow-lg">
      {/* Accordion header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {t('balancer.steps.title', 'Қадамдық түсіндірме және теңдестіру логикасы')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('balancer.steps.subtitle', 'Математикалық матрицалық әдіс және атомдардың сақталу заңы')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300 font-medium">
          <span className="hidden sm:inline">
            {isOpen ? t('common.close', 'Жабу') : t('balancer.steps.showSteps', 'Қадамдарды ашу')}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion body */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6 divide-y divide-slate-200 dark:divide-slate-800">
          {/* Step 1: Assign variables */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-400">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>{t('balancer.steps.step1Title', 'Айнымалыларды тағайындау және қосылыстарды талдау')}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t('balancer.steps.step1Desc', 'Әрбір затқа белгісіз коэффициент (a, b, c, ...) тағайындап, құрамындағы элементтер санын анықтаймыз:')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                <span className="text-[11px] font-sans font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                  {t('balancer.steps.reactants', 'Реагенттер (Бастапқы заттар)')}:
                </span>
                {result.reactants.map((r, i) => {
                  const varName = 'abcdefghijklmnopqrstuvwxyz'[i] || `x${i + 1}`;
                  return (
                    <div key={i} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                      <span>{varName} &times; <span dangerouslySetInnerHTML={{ __html: r.formattedHtml }} /></span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {Object.entries(r.elementCounts).map(([el, cnt]) => `${cnt}${el}`).join(', ')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                <span className="text-[11px] font-sans font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">
                  {t('balancer.steps.products', 'Өнімдер (Түзілген заттар)')}:
                </span>
                {result.products.map((p, i) => {
                  const varName = 'abcdefghijklmnopqrstuvwxyz'[result.reactants.length + i] || `x${result.reactants.length + i + 1}`;
                  return (
                    <div key={i} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                      <span>{varName} &times; <span dangerouslySetInnerHTML={{ __html: p.formattedHtml }} /></span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {Object.entries(p.elementCounts).map(([el, cnt]) => `${cnt}${el}`).join(', ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2: Conservation equations */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-700 dark:text-purple-400">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>{t('balancer.steps.step2Title', 'Атомдардың сақталу теңдеулер жүйесін құру')}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t('balancer.steps.step2Desc', 'Массаның сақталу заңына сәйкес, әрбір элемент атомының саны реакцияға дейін және одан кейін тең болуы шарт:')}
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm space-y-1.5 text-slate-800 dark:text-slate-200">
              {result.algebraicEquations.map((eq, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Matrix elimination */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>{t('balancer.steps.step3Title', 'Гаусс әдісімен нөлдік кеңістікті шешу')}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t('balancer.steps.step3Desc', 'Сызықтық алгебралық Гаусс әдісі арқылы ранг пен ядроның минималды бүтін оң сандық шешімі анықталады:')}
            </p>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 block">
                    {t('balancer.steps.stoichiometricRatio', 'Стехиометриялық коэффициенттер қатынасы')}:
                  </span>
                  <span className="font-mono text-sm sm:text-base text-indigo-700 dark:text-indigo-300 font-bold">
                    ({result.reactantCoefficients.join(' : ')} &rarr; {result.productCoefficients.join(' : ')})
                  </span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-xs border border-indigo-200 dark:border-indigo-500/20 font-mono font-semibold">
                GCD = 1 &bull; Minimal Integers
              </div>
            </div>
          </div>

          {/* Step 4: Verification */}
          <div className="pt-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>{t('balancer.steps.step4Title', 'Қорытынды тексеру және нәтиже')}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t('balancer.steps.step4Desc', 'Барлық атомдар екі жақта да толық теңестірілді:')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              {result.elementVerification.map((v) => (
                <div
                  key={v.symbol}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-emerald-500/30 p-2.5 rounded-lg flex items-center justify-between text-slate-800 dark:text-slate-200"
                >
                  <span className="font-bold text-teal-600 dark:text-teal-400">{v.symbol}</span>
                  <div className="flex items-center gap-1">
                    <span>{v.reactantsTotal} = {v.productsTotal}</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
