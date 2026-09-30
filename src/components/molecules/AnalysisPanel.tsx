import React from 'react';
import {
  Activity,
  Layers,
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Atom,
  HelpCircle,
} from 'lucide-react';
import { MoleculeGraph } from '../../types/molecule';
import { generateHillFormula, formatFormulaSubscripts } from '../../utils/mol/formula';
import { calculateMolarMass } from '../../utils/mol/molarMass';
import { analyzeBonds, getBondCategoryName, getBondCategoryColor } from '../../utils/mol/bondType';
import { identifyMolecule } from '../../utils/mol/naming';
import { checkValences } from '../../utils/mol/valence';

interface AnalysisPanelProps {
  graph: MoleculeGraph;
  lang: 'kk' | 'ru' | 'en';
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ graph, lang }) => {
  const hillFormula = generateHillFormula(graph);
  const formattedFormula = formatFormulaSubscripts(hillFormula);
  const { totalMass, breakdown } = calculateMolarMass(graph);
  const bondAnalysis = analyzeBonds(graph);
  const identification = identifyMolecule(graph);
  const valenceWarnings = checkValences(graph);
  const hasExceeded = valenceWarnings.some((w) => w.isExceeded);

  const t = {
    title: lang === 'kk' ? 'Молекулалық талдау' : lang === 'ru' ? 'Анализ молекулы' : 'Molecular Analysis',
    formula: lang === 'kk' ? 'Молекулалық формула' : lang === 'ru' ? 'Молекулярная формула' : 'Molecular Formula',
    substanceName: lang === 'kk' ? 'Заттың атауы' : lang === 'ru' ? 'Название вещества' : 'Substance Name',
    notIdentified: lang === 'kk' ? 'Номенклатурада табылмады' : lang === 'ru' ? 'Название не найдено' : 'Name not identified',
    molarMass: lang === 'kk' ? 'Молярлық масса' : lang === 'ru' ? 'Молярная масса' : 'Molar Mass',
    massBreakdown: lang === 'kk' ? 'Элементтік үлес (W%)' : lang === 'ru' ? 'Массовые доли (W%)' : 'Mass Percentages (W%)',
    bondsTitle: lang === 'kk' ? 'Байланыстар сипаттамасы' : lang === 'ru' ? 'Типы химических связей' : 'Chemical Bonds',
    hybridization: lang === 'kk' ? 'Гибридтену' : lang === 'ru' ? 'Гибридизация' : 'Hybridization',
    geometry: lang === 'kk' ? 'Геометрия' : lang === 'ru' ? 'Геометрия' : 'Geometry',
    polarity: lang === 'kk' ? 'Полярлылығы' : lang === 'ru' ? 'Полярность' : 'Polarity',
    polar: lang === 'kk' ? 'Полярлы молекула' : lang === 'ru' ? 'Полярная молекула' : 'Polar molecule',
    nonpolar: lang === 'kk' ? 'Полярсыз молекула' : lang === 'ru' ? 'Неполярная молекула' : 'Nonpolar molecule',
    valenceValid: lang === 'kk' ? 'Валенттіліктер дұрыс' : lang === 'ru' ? 'Все валентности соблюдены' : 'All valences satisfied',
    valenceAlert: lang === 'kk' ? 'Валенттілік асып кетті!' : lang === 'ru' ? 'Превышена валентность!' : 'Valence limit exceeded!',
    emptyState: lang === 'kk' ? 'Холстқа атомдар қосыңыз' : lang === 'ru' ? 'Добавьте атомы на холст' : 'Add atoms to the canvas',
    facts: lang === 'kk' ? 'Қызықты дерек' : lang === 'ru' ? 'Интересный факт' : 'Fun Fact',
  };

  if (!graph.atoms || graph.atoms.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center min-h-[300px]">
        <Atom className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3 animate-spin-slow" />
        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">{t.title}</h4>
        <p className="text-sm text-slate-500 max-w-xs">{t.emptyState}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header with Title and Valence status */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">{t.title}</h3>
        </div>

        {hasExceeded ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.valenceAlert}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.valenceValid}</span>
          </div>
        )}
      </div>

      {/* Main Identity: Formula & Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Hill Formula */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.formula}
          </span>
          <div className="font-mono font-extrabold text-2xl text-teal-600 dark:text-teal-400">
            {formattedFormula || '—'}
          </div>
        </div>

        {/* Identified Name */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            {t.substanceName}
          </span>
          <div className="font-semibold text-base text-slate-900 dark:text-white line-clamp-2">
            {identification.name ? identification.name[lang] : t.notIdentified}
          </div>
        </div>
      </div>

      {/* Molar Mass & Elemental Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-400">{t.molarMass}:</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
            {totalMass} <span className="text-xs font-normal text-slate-500">г/моль</span>
          </span>
        </div>

        {/* Multi-segment percentage bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
          {breakdown.map((item) => (
            <div
              key={item.element}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              title={`${item.element}: ${item.percentage}%`}
              className="h-full transition-all"
            />
          ))}
        </div>

        {/* Breakdown Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {breakdown.map((b) => (
            <div
              key={b.element}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: b.color }}
              />
              <span className="font-mono font-bold">{b.element}</span>
              <span className="text-slate-500">×{b.count}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{b.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chemical Bonds Classification */}
      <div className="space-y-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          {t.bondsTitle} ({bondAnalysis.counts.total})
        </span>

        <div className="grid grid-cols-3 gap-2">
          {/* Nonpolar */}
          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-center">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">
              {getBondCategoryName('covalent_nonpolar', lang)}
            </span>
            <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
              {bondAnalysis.typeCounts.nonpolar}
            </span>
          </div>

          {/* Polar */}
          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 text-center">
            <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium block">
              {getBondCategoryName('covalent_polar', lang)}
            </span>
            <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
              {bondAnalysis.typeCounts.polar}
            </span>
          </div>

          {/* Ionic */}
          <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/40 text-center">
            <span className="text-[10px] text-purple-700 dark:text-purple-400 font-medium block">
              {getBondCategoryName('ionic', lang)}
            </span>
            <span className="font-mono font-bold text-lg text-purple-600 dark:text-purple-400">
              {bondAnalysis.typeCounts.ionic}
            </span>
          </div>
        </div>
      </div>

      {/* Geometry, Hybridization, Polarity */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-600 dark:text-slate-400 block mb-0.5">{t.hybridization}</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {identification.hybridization}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-600 dark:text-slate-400 block mb-0.5">{t.geometry}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
            {identification.geometry[lang]}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-600 dark:text-slate-400 block mb-0.5">{t.polarity}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {identification.polarity === 'polar' ? t.polar : t.nonpolar}
          </span>
        </div>
      </div>

      {/* Preset fact if matched */}
      {identification.preset?.fact && (
        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.facts}</span>
          </div>
          <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
            {identification.preset.fact[lang]}
          </p>
        </div>
      )}
    </div>
  );
};
