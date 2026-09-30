import React from 'react';
import { Delete, ArrowRight, Plus } from 'lucide-react';

interface ChemicalKeyboardProps {
  onInsert: (symbol: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

export const ChemicalKeyboard: React.FC<ChemicalKeyboardProps> = ({
  onInsert,
  onBackspace,
  onClear,
}) => {
  const commonOperators = [
    { label: '+', value: ' + ', icon: <Plus className="w-3.5 h-3.5" /> },
    { label: '→', value: ' = ', icon: <ArrowRight className="w-3.5 h-3.5" /> },
    { label: '(', value: '(' },
    { label: ')', value: ')' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '·', value: '·' },
  ];

  const commonCharges = [
    { label: '⁺', value: '^+' },
    { label: '⁻', value: '^-' },
    { label: '²⁺', value: '^2+' },
    { label: '³⁺', value: '^3+' },
    { label: '²⁻', value: '^2-' },
  ];

  const commonElements = [
    'H', 'O', 'C', 'N', 'Na', 'Cl', 'Fe', 'Cu', 'Al', 'Ca', 'S', 'K', 'P', 'Mg', 'Mn', 'Cr', 'Ag', 'Ba'
  ];

  return (
    <div className="bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/60 rounded-xl p-2.5 backdrop-blur-md shadow-sm space-y-2 select-none">
      {/* Top row: Operators, charges & actions */}
      <div className="flex flex-wrap items-center gap-1.5 justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 mr-1 hidden sm:inline">Символдар:</span>
          {commonOperators.map((op, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(op.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-800 dark:text-teal-300 border border-teal-500/30 transition-all active:scale-95 flex items-center justify-center min-w-[28px]"
              title={`Insert ${op.label}`}
            >
              {op.icon || op.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

          {commonCharges.map((ch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onInsert(ch.value)}
              className="px-2 py-1 text-xs font-semibold rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-800 dark:text-purple-300 border border-purple-500/30 transition-all active:scale-95"
              title={`Insert charge ${ch.label}`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={onBackspace}
            className="px-2 py-1 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all active:scale-95 flex items-center gap-1"
            title="Backspace"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-800 dark:text-rose-300 border border-rose-500/30 transition-all active:scale-95"
            title="Clear input"
          >
            Тазалау
          </button>
        </div>
      </div>

      {/* Elements row */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <span className="text-xs font-mono text-slate-600 dark:text-slate-400 mr-1 shrink-0 hidden sm:inline">Элементтер:</span>
        {commonElements.map((elem) => (
          <button
            key={elem}
            type="button"
            onClick={() => onInsert(elem)}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700/80 transition-all active:scale-95 shrink-0 shadow-xs"
          >
            {elem}
          </button>
        ))}
      </div>
    </div>
  );
};
