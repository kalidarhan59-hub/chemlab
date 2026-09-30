import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Calculator, Droplets, Wind, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { BalancedEquationResult } from '../../utils/balancer/matrixSolver';
import { parseCompound, ParsedCompound } from '../../utils/balancer/chemicalFormula';
import {
  calculateStoichiometry,
  calculateYieldPercentage,
  calculateMassFraction,
  calculateMolarity,
  calculateDilution,
  solveIdealGas,
  AmountUnit,
} from '../../utils/balancer/chemicalCalculations';
import elementsData from '../../data/elements.json';

interface CalculatorsSectionProps {
  balancedResult?: BalancedEquationResult | null;
  selectedFormula?: string | null;
}

export const CalculatorsSection: React.FC<CalculatorsSectionProps> = ({
  balancedResult,
  selectedFormula,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const [activeTab, setActiveTab] = useState<'molar' | 'stoichiometry' | 'solutions' | 'gas'>('stoichiometry');

  // Molar mass standalone state
  const [customFormula, setCustomFormula] = useState<string>('H2SO4');

  // Sync selected formula from outside
  useEffect(() => {
    if (selectedFormula) {
      setCustomFormula(selectedFormula);
      setActiveTab('molar');
    }
  }, [selectedFormula]);

  // Recalculate compound whenever formula changes
  const currentMolarCompound = React.useMemo<ParsedCompound | null>(() => {
    try {
      if (customFormula.trim()) {
        return parseCompound(customFormula.trim());
      }
    } catch {
      // Ignore intermediate parse errors
    }
    return null;
  }, [customFormula]);

  // Stoichiometry State
  const [reactantInputs, setReactantInputs] = useState<Record<number, { value: string; unit: AmountUnit }>>({});
  const [actualProductMass, setActualProductMass] = useState<string>('');
  const [actualProductIndex, setActualProductIndex] = useState<number>(0);

  // Solutions State
  const [soluteMass, setSoluteMass] = useState<string>('10');
  const [solutionMass, setSolutionMass] = useState<string>('200');
  const [soluteMolarMass, setSoluteMolarMass] = useState<string>('58.44'); // NaCl
  const [solutionVolumeLiters, setSolutionVolumeLiters] = useState<string>('0.5');

  // Dilution state: C1*V1 = C2*V2
  const [dilutionC1, setDilutionC1] = useState<string>('2');
  const [dilutionV1, setDilutionV1] = useState<string>('100');
  const [dilutionC2, setDilutionC2] = useState<string>('0.5');
  const [dilutionV2, setDilutionV2] = useState<string>('');

  // Gas State: PV = nRT
  const [gasPressure, setGasPressure] = useState<string>('101.325');
  const [gasVolume, setGasVolume] = useState<string>('22.414');
  const [gasMoles, setGasMoles] = useState<string>('1');
  const [gasTempC, setGasTempC] = useState<string>('0');

  // Helper to get element name
  const getElementName = (sym: string) => {
    const found = (elementsData as any[]).find((el) => el.symbol === sym);
    return found?.name?.[currentLang] || sym;
  };

  // Compute stoichiometry results if equation is balanced
  const stoichiometryResult = React.useMemo(() => {
    if (!balancedResult || !balancedResult.isSuccess) return null;

    const inputs = Object.entries(reactantInputs)
      .map(([idxStr, val]) => ({
        index: parseInt(idxStr, 10),
        value: parseFloat(val.value) || 0,
        unit: val.unit,
      }))
      .filter((i) => i.value > 0);

    if (inputs.length === 0) return null;

    return calculateStoichiometry(
      balancedResult.reactants,
      balancedResult.reactantCoefficients,
      balancedResult.products,
      balancedResult.productCoefficients,
      inputs
    );
  }, [balancedResult, reactantInputs]);

  // Handle unit or value changes for reactant inputs
  const handleReactantChange = (index: number, value: string, unit?: AmountUnit) => {
    setReactantInputs((prev) => ({
      ...prev,
      [index]: {
        value,
        unit: unit || prev[index]?.unit || 'g',
      },
    }));
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('stoichiometry')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'stoichiometry'
              ? 'border-teal-500 text-teal-700 dark:text-teal-300 bg-teal-500/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t('balancer.calculators.stoichiometryTab', 'Стехиометрия және шектеуші реагент')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('molar')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'molar'
              ? 'border-purple-500 text-purple-700 dark:text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{t('balancer.calculators.molarTab', 'Молярлық масса және W% құрамы')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('solutions')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'solutions'
              ? 'border-blue-500 text-blue-700 dark:text-blue-300 bg-blue-500/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>{t('balancer.calculators.solutionsTab', 'Ерітінділер және сұйылту')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gas')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
            activeTab === 'gas'
              ? 'border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>{t('balancer.calculators.gasTab', 'Газдар және PV=nRT')}</span>
        </button>
      </div>

      <div className="p-5 sm:p-7">
        {/* ============================================================== */}
        {/* TAB 1: STOICHIOMETRY & LIMITING REAGENT */}
        {/* ============================================================== */}
        {activeTab === 'stoichiometry' && (
          <div className="space-y-6">
            {!balancedResult || !balancedResult.isSuccess ? (
              <div className="p-6 text-center text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800">
                <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  {t('balancer.calculators.needBalancedEquation', 'Алдымен реакция теңдеуін теңестіріңіз')}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {t('balancer.calculators.needBalancedDesc', 'Стехиометриялық есептеулер теңдестірілген коэффициенттер негізінде жүргізіледі.')}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                      {t('balancer.calculators.enterReactantAmounts', 'Реагенттердің бастапқы мөлшерін енгізіңіз')}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {t('balancer.calculators.limitingReagentExplanation', 'Егер бірнеше реагент берілсе, шектеуші реагент автоматты түрде анықталады.')}
                    </p>
                  </div>
                </div>

                {/* Reactants inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {balancedResult.reactants.map((reactant, idx) => {
                    const currentVal = reactantInputs[idx]?.value || '';
                    const currentUnit = reactantInputs[idx]?.unit || 'g';
                    const isLimiting = stoichiometryResult?.limitingIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isLimiting
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100"
                            dangerouslySetInnerHTML={{ __html: reactant.formattedHtml }}
                          />
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            M = {reactant.molarMass} г/моль
                          </span>
                        </div>

                        {isLimiting && (
                          <div className="mb-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {t('balancer.calculators.limitingReagentBadge', 'Шектеуші реагент (жетіспейді)')}
                          </div>
                        )}

                        <div className="flex gap-1.5">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="0.0"
                            value={currentVal}
                            onChange={(e) => handleReactantChange(idx, e.target.value)}
                            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
                          />
                          <select
                            value={currentUnit}
                            onChange={(e) => handleReactantChange(idx, currentVal, e.target.value as AmountUnit)}
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-teal-500"
                          >
                            <option value="g">г (грамм)</option>
                            <option value="kg">кг</option>
                            <option value="mg">мг</option>
                            <option value="mol">моль</option>
                            <option value="mmol">ммоль</option>
                            <option value="L_stp">л (н.ж.)</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation Output */}
                {stoichiometryResult && (
                  <div className="space-y-4 pt-2">
                    {/* Products theoretical yield table */}
                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-teal-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <h5 className="text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300">
                          {t('balancer.calculators.theoreticalYield', 'Өнімдердің теориялық түзілуі (Теориялық шығым)')}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stoichiometryResult.products.map((prod, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span
                                className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm"
                                dangerouslySetInnerHTML={{ __html: prod.compound.formattedHtml }}
                              />
                              <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">
                                {prod.moles.toFixed(4)} моль
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono">
                              <span>{t('balancer.calculators.mass', 'Масса')}:</span>
                              <span className="text-teal-600 dark:text-teal-400 font-bold">{prod.massGrams.toFixed(2)} г</span>
                            </div>

                            {prod.volumeLitersStp !== undefined && (
                              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono">
                                <span>{t('balancer.calculators.volumeStp', 'Көлем (н.ж.)')}:</span>
                                <span className="text-sky-600 dark:text-sky-400 font-bold">{prod.volumeLitersStp.toFixed(2)} л</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Excess Reactants Section */}
                    {stoichiometryResult.excessReactants.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs space-y-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                          {t('balancer.calculators.excessReactantsTitle', 'Артық қалған реагенттер (жұмсалмаған)')}:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {stoichiometryResult.excessReactants.map((excess, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900/50 p-2.5 rounded-lg font-mono border border-slate-200 dark:border-slate-800">
                              <span className="text-slate-900 dark:text-slate-100" dangerouslySetInnerHTML={{ __html: excess.compound.formattedHtml }} />
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                +{excess.remainingMassGrams.toFixed(2)} г ({excess.remainingMoles.toFixed(4)} моль)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Practical Yield (%) Calculator */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300">
                          {t('balancer.calculators.reactionYieldCalculator', 'Реакцияның практикалық шығымы (η, %)')}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          η = (m_практ / m_теор) &times; 100%
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {t('balancer.calculators.selectProduct', 'Өнім')}:
                          </label>
                          <select
                            value={actualProductIndex}
                            onChange={(e) => setActualProductIndex(parseInt(e.target.value, 10))}
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
                          >
                            {stoichiometryResult.products.map((p, i) => (
                              <option key={i} value={i}>
                                {p.compound.formula} (теор: {p.massGrams.toFixed(2)} г)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {t('balancer.calculators.actualMass', 'Практикалық масса (г)')}:
                          </label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="0.0"
                            value={actualProductMass}
                            onChange={(e) => setActualProductMass(e.target.value)}
                            className="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
                          />
                        </div>

                        {actualProductMass && parseFloat(actualProductMass) > 0 && (
                          <div className="ml-auto px-3 py-1 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 font-mono font-bold text-xs sm:text-sm border border-teal-500/40">
                            Шығым: {calculateYieldPercentage(
                              parseFloat(actualProductMass),
                              stoichiometryResult.products[actualProductIndex]?.massGrams || 1
                            )}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: MOLAR MASS & MASS FRACTION */}
        {/* ============================================================== */}
        {activeTab === 'molar' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {t('balancer.calculators.molarTitle', 'Молярлық масса және пайыздық үлестер')}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {t('balancer.calculators.molarSubtitle', 'Кез келген химиялық формуланы енгізіп, оның дәл массасы мен элементтік құрамын есептеңіз.')}
                </p>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {['H2SO4', 'KMnO4', 'Ca3(PO4)2', 'C6H12O6', 'CuSO4*5H2O'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCustomFormula(preset)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customFormula}
                onChange={(e) => setCustomFormula(e.target.value)}
                placeholder="Мысалы: Ca(OH)2, KMnO4, CuSO4*5H2O..."
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-sm sm:text-base text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {currentMolarCompound && (
              <div className="space-y-5">
                {/* Result header banner */}
                <div className="p-4 rounded-xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/30 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span
                      className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100"
                      dangerouslySetInnerHTML={{ __html: currentMolarCompound.formattedHtml }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                      {currentMolarCompound.raw}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-purple-700 dark:text-purple-300 uppercase tracking-wider block font-semibold">
                      {t('balancer.calculators.molarMass', 'Молярлық масса')} (M):
                    </span>
                    <span className="font-mono text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                      {currentMolarCompound.molarMass}{' '}
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-sans">г/моль</span>
                    </span>
                  </div>
                </div>

                {/* Percentage composition visual bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-medium">{t('balancer.calculators.massComposition', 'Массалық үлестер (W%)')}:</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">100.00%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 flex overflow-hidden border border-slate-300 dark:border-slate-700/60">
                    {currentMolarCompound.breakdown.map((item, idx) => {
                      const colors = [
                        'bg-teal-500', 'bg-purple-500', 'bg-amber-500',
                        'bg-rose-500', 'bg-sky-500', 'bg-emerald-500',
                      ];
                      const color = colors[idx % colors.length];
                      return (
                        <div
                          key={item.symbol}
                          className={`${color} h-full transition-all duration-500`}
                          style={{ width: `${item.massPercent}%` }}
                          title={`${item.symbol}: ${item.massPercent}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Breakdown Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Элемент</th>
                        <th className="py-2.5 px-3">Атауы</th>
                        <th className="py-2.5 px-3 text-center">Саны (n)</th>
                        <th className="py-2.5 px-3 text-right">Ar (а.м.б.)</th>
                        <th className="py-2.5 px-3 text-right">Массасы (г/моль)</th>
                        <th className="py-2.5 px-3 text-right">W (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                      {currentMolarCompound.breakdown.map((item) => (
                        <tr key={item.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-teal-600 dark:text-teal-400">{item.symbol}</td>
                          <td className="py-2.5 px-3 font-sans text-slate-800 dark:text-slate-200">{getElementName(item.symbol)}</td>
                          <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300">&times;{item.count}</td>
                          <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">{item.atomicMass.toFixed(3)}</td>
                          <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200 font-semibold">{item.totalMass.toFixed(3)}</td>
                          <td className="py-2.5 px-3 text-right text-purple-600 dark:text-purple-400 font-bold">{item.massPercent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SOLUTIONS & DILUTION */}
        {/* ============================================================== */}
        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {t('balancer.calculators.solutionsTitle', 'Ерітінділердің концентрациясы және сұйылту')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('balancer.calculators.solutionsSubtitle', 'Массалық үлес (ω), молярлық концентрация (C_M) және ерітіндіні сұйылту ережесі.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: Mass fraction & Molarity */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  1. Массалық үлес (ω) және Молярлық концентрация
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Еріген заттың массасы (m_зат, г):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={soluteMass}
                      onChange={(e) => setSoluteMass(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Жалпы ерітіндінің массасы (m_ерітінді, г):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={solutionMass}
                      onChange={(e) => setSolutionMass(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Еріген заттың молярлық массасы (M, г/моль):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={soluteMolarMass}
                      onChange={(e) => setSoluteMolarMass(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Ерітіндінің көлемі (V, литр):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={solutionVolumeLiters}
                      onChange={(e) => setSolutionVolumeLiters(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Массалық үлес (ω):</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {calculateMassFraction(parseFloat(soluteMass) || 0, parseFloat(solutionMass) || 1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Молярлық концентрация (C_M):</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                      {calculateMolarity(
                        parseFloat(soluteMass) || 0,
                        parseFloat(soluteMolarMass) || 1,
                        parseFloat(solutionVolumeLiters) || 1
                      )}{' '}
                      моль/л (M)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Dilution formula C1*V1 = C2*V2 */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-4">
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider block">
                  2. Сұйылту ережесі: C₁ &times; V₁ = C₂ &times; V₂
                </span>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Бастапқы концентрация (C₁):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={dilutionC1}
                      onChange={(e) => setDilutionC1(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Бастапқы көлем (V₁, мл немесе л):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={dilutionV1}
                      onChange={(e) => setDilutionV1(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Қажетті концентрация (C₂):</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={dilutionC2}
                      onChange={(e) => setDilutionC2(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-sans">Қажетті жалпы көлем (V₂):</span>
                    <span className="text-teal-600 dark:text-teal-400 font-bold text-sm">
                      {calculateDilution(parseFloat(dilutionC1) || 0, parseFloat(dilutionV1) || 0, parseFloat(dilutionC2) || 0).v2 || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-sans">
                    <span>Қосылатын су көлемі (V_су):</span>
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      {Math.max(
                        0,
                        (calculateDilution(parseFloat(dilutionC1) || 0, parseFloat(dilutionV1) || 0, parseFloat(dilutionC2) || 0).v2 || 0) -
                          (parseFloat(dilutionV1) || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GAS LAWS (STP & PV=nRT) */}
        {/* ============================================================== */}
        {activeTab === 'gas' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {t('balancer.calculators.gasTitle', 'Газдар: Қалыпты жағдай (н.ж.) және Менделеев-Клапейрон теңдеуі')}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('balancer.calculators.gasSubtitle', 'P &times; V = n &times; R &times; T заңы бойынша газдың қысымын, көлемін немесе зат мөлшерін есептеңіз.')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Қысым (P, кПа):</label>
                <input
                  type="number"
                  step="any"
                  value={gasPressure}
                  onChange={(e) => setGasPressure(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-mono block">1 атм = 101.325 кПа</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Көлем (V, литр):</label>
                <input
                  type="number"
                  step="any"
                  value={gasVolume}
                  onChange={(e) => setGasVolume(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-mono block">н.ж. 1 моль = 22.414 л</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Зат мөлшері (n, моль):</label>
                <input
                  type="number"
                  step="any"
                  value={gasMoles}
                  onChange={(e) => setGasMoles(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-mono block">n = V / 22.4 (н.ж.)</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-medium">Температура (T, °C):</label>
                <input
                  type="number"
                  step="any"
                  value={gasTempC}
                  onChange={(e) => setGasTempC(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100"
                />
                <span className="text-[10px] text-slate-500 font-mono block">
                  T(K) = {(parseFloat(gasTempC) || 0) + 273.15} K
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <span className="text-slate-700 dark:text-slate-300 font-sans">
                  R = 8.314 Дж/(моль&times;К) &bull; Қалыпты жағдай: T = 0 °C (273.15 K), P = 101.325 кПа
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
