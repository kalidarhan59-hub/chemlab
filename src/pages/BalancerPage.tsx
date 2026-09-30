import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  BookOpen,
  Keyboard,
  RotateCcw,
  Shuffle,
  AlertCircle,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { balanceChemicalEquation, BalancedEquationResult } from '../utils/balancer/matrixSolver';
import { BalancedDisplay } from '../components/balancer/BalancedDisplay';
import { AtomBalanceVisualizer } from '../components/balancer/AtomBalanceVisualizer';
import { StepByStepExplanation } from '../components/balancer/StepByStepExplanation';
import { CalculatorsSection } from '../components/balancer/CalculatorsSection';
import { ChemicalKeyboard } from '../components/balancer/ChemicalKeyboard';
import { PresetsModal } from '../components/balancer/PresetsModal';
import { ReactionHistory, HistoryItem } from '../components/balancer/ReactionHistory';
import { REACTION_PRESETS } from '../utils/balancer/presets';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEFAULT_EQUATION = 'KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O';

export const BalancerPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // History in localStorage
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('chemlab:balancer:history', []);

  // Equation input state
  const [inputEquation, setInputEquation] = useState<string>(() => {
    return searchParams.get('eq') || DEFAULT_EQUATION;
  });

  const [balancedResult, setBalancedResult] = useState<BalancedEquationResult | null>(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [selectedFormulaForMolar, setSelectedFormulaForMolar] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Perform equation balance
  const handleBalance = useCallback(
    (equationToBalance?: string) => {
      const eq = (equationToBalance !== undefined ? equationToBalance : inputEquation).trim();
      if (!eq) return;

      const result = balanceChemicalEquation(eq);
      setBalancedResult(result);

      // If balanced, save to history
      if (result.isSuccess) {
        setHistory((prev) => {
          // Avoid immediate duplicates
          const filtered = prev.filter((item) => item.equation !== eq);
          const newItem: HistoryItem = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            equation: eq,
            balancedUnicode: result.fullEquationUnicode,
            timestamp: Date.now(),
          };
          return [newItem, ...filtered].slice(0, 30);
        });

        // Update URL param
        setSearchParams({ eq }, { replace: true });
      }
    },
    [inputEquation, setHistory, setSearchParams]
  );

  // Balance on initial load
  useEffect(() => {
    const urlEq = searchParams.get('eq');
    if (urlEq) {
      setInputEquation(urlEq);
      handleBalance(urlEq);
    } else {
      handleBalance(DEFAULT_EQUATION);
    }
  }, []); // Run once on mount

  // Key shortcuts (Enter to balance)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBalance();
    }
  };

  // Virtual keyboard insertions
  const handleKeyboardInsert = (symbol: string) => {
    const input = inputRef.current;
    if (!input) {
      setInputEquation((prev) => prev + symbol);
      return;
    }

    const start = input.selectionStart || inputEquation.length;
    const end = input.selectionEnd || inputEquation.length;
    const nextVal = inputEquation.slice(0, start) + symbol + inputEquation.slice(end);
    setInputEquation(nextVal);

    setTimeout(() => {
      input.focus();
      const nextPos = start + symbol.length;
      input.setSelectionRange(nextPos, nextPos);
    }, 0);
  };

  const handleKeyboardBackspace = () => {
    const input = inputRef.current;
    if (!input) {
      setInputEquation((prev) => prev.slice(0, -1));
      return;
    }

    const start = input.selectionStart || inputEquation.length;
    const end = input.selectionEnd || inputEquation.length;

    if (start === end && start > 0) {
      const nextVal = inputEquation.slice(0, start - 1) + inputEquation.slice(end);
      setInputEquation(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start - 1, start - 1);
      }, 0);
    } else if (start !== end) {
      const nextVal = inputEquation.slice(0, start) + inputEquation.slice(end);
      setInputEquation(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, start);
      }, 0);
    }
  };

  const handleKeyboardClear = () => {
    setInputEquation('');
    setBalancedResult(null);
    inputRef.current?.focus();
  };

  // Random preset generator
  const handleRandomPreset = () => {
    const randomIndex = Math.floor(Math.random() * REACTION_PRESETS.length);
    const chosen = REACTION_PRESETS[randomIndex];
    setInputEquation(chosen.equation);
    handleBalance(chosen.equation);
  };

  // Select reaction from library or history
  const handleSelectEquation = (eq: string) => {
    setInputEquation(eq);
    handleBalance(eq);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Toggle star in history
  const handleToggleStar = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={t('balancer.seo.title', 'Химиялық реакцияларды теңестіруші және калькуляторлар | ChemLab')}
        description={t(
          'balancer.seo.description',
          'Химиялық реакция теңдеулерін математикалық дәлдікпен теңестіру, қадамдық түсіндірме, шектеуші реагент, молярлық массалар және стехиометриялық есептеулер.'
        )}
      />

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 backdrop-blur-md shadow-sm">
          <Scale className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{t('balancer.hero.badge', '🔬 Интеллектуалды химиялық есептегіш')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('balancer.hero.title', 'Химиялық реакцияларды теңестіру')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-700 to-purple-700 dark:from-teal-400 dark:via-cyan-400 dark:to-purple-400">
            {t('balancer.hero.titleGradient', 'математикалық дәлдікпен')}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {t(
            'balancer.hero.subtitle',
            'Кез келген қиындықтағы химиялық теңдеулерді Гаусс әдісімен теңестіріңіз, қадамдық түсіндірмесін оқыңыз және стехиометрия, шектеуші реагент, ерітінділер калькуляторларын қолданыңыз.'
          )}
        </p>
      </div>

      {/* Main Input Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            <span>{t('balancer.input.label', 'Химиялық реакция теңдеуін енгізіңіз')}</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPresetsOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t('balancer.input.presetsBtn', 'Реакциялар кітапханасы')}</span>
            </button>

            <button
              type="button"
              onClick={handleRandomPreset}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              title="Случайная реакция"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">{t('balancer.input.randomBtn', 'Кездейсоқ')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                isKeyboardOpen
                  ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">{t('balancer.input.keyboardToggle', 'Пернетақта')}</span>
            </button>
          </div>
        </div>

        {/* Input box and Balance button */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputEquation}
              onChange={(e) => setInputEquation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('balancer.input.placeholder', 'Мысалы: KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O')}
              className="w-full bg-slate-50 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 rounded-2xl px-4 sm:px-5 py-3.5 font-mono text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => handleBalance()}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white dark:text-slate-950 bg-teal-600 dark:bg-gradient-to-r dark:from-teal-400 dark:to-cyan-400 hover:bg-teal-700 dark:hover:from-teal-300 dark:hover:to-cyan-300 transition-all transform active:scale-95 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Scale className="w-4 h-4" />
            <span>{t('balancer.input.balanceBtn', 'Теңестіру')}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <p className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t('balancer.input.hint', 'Кеңес: «+», «=» немесе «->» қолданыңыз. Иондар: Fe^3+, SO4^2-, гидраттар: CuSO4*5H2O.')}</span>
          </p>
        </div>

        {/* Chemical Virtual Keyboard Drawer */}
        {isKeyboardOpen && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <ChemicalKeyboard
              onInsert={handleKeyboardInsert}
              onBackspace={handleKeyboardBackspace}
              onClear={handleKeyboardClear}
            />
          </div>
        )}
      </div>

      {/* Error state */}
      {balancedResult && !balancedResult.isSuccess && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start gap-3 backdrop-blur-md animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-rose-300 block">
              {t('common.errorOccurred', 'Қате орын алды')}
            </span>
            <p>
              {balancedResult.errorKey
                ? t(balancedResult.errorKey, balancedResult.errorMessage || '')
                : balancedResult.errorMessage || t('balancer.errors.generic', 'Теңдеуді теңестіру кезінде қате орын алды.')}
            </p>
          </div>
        </div>
      )}

      {/* Success Results */}
      {balancedResult && balancedResult.isSuccess && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Main Balanced Card */}
          <BalancedDisplay
            result={balancedResult}
            onSelectCompound={(formula) => {
              setSelectedFormulaForMolar(formula);
              // scroll down to calculators
              const el = document.getElementById('chemical-calculators-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Visual Balance Scales and Element comparison */}
          <AtomBalanceVisualizer elementVerification={balancedResult.elementVerification} />

          {/* Step-by-Step Mathematical Explanation */}
          <StepByStepExplanation result={balancedResult} />

          {/* Chemical Calculators Section */}
          <div id="chemical-calculators-section">
            <CalculatorsSection
              balancedResult={balancedResult}
              selectedFormula={selectedFormulaForMolar}
            />
          </div>
        </div>
      )}

      {/* Reaction History */}
      <ReactionHistory
        history={history}
        onSelect={handleSelectEquation}
        onToggleStar={handleToggleStar}
        onClear={handleClearHistory}
      />

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectReaction={handleSelectEquation}
      />
    </div>
  );
};

export default BalancerPage;
