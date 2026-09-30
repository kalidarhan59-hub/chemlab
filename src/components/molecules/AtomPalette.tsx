import React from 'react';
import { MousePointer, PlusCircle, Link as LinkIcon, Trash2, Sparkles, RotateCcw, RotateCw, Eraser } from 'lucide-react';
import elementsBasicData from '../../data/elementsBasic.json';
import { ElementData } from '../../types/molecule';

interface AtomPaletteProps {
  selectedElement: string;
  onSelectElement: (symbol: string) => void;
  activeTool: 'select' | 'add_atom' | 'bond' | 'delete';
  onChangeTool: (tool: 'select' | 'add_atom' | 'bond' | 'delete') => void;
  onAddHydrogens: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  lang: 'kk' | 'ru' | 'en';
}

const elementsList = elementsBasicData as ElementData[];

export const AtomPalette: React.FC<AtomPaletteProps> = ({
  selectedElement,
  onSelectElement,
  activeTool,
  onChangeTool,
  onAddHydrogens,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  lang,
}) => {
  const organogens = elementsList.filter((e) => ['H', 'C', 'N', 'O', 'P', 'S'].includes(e.symbol));
  const halogens = elementsList.filter((e) => ['F', 'Cl', 'Br', 'I'].includes(e.symbol));
  const metals = elementsList.filter((e) => ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'].includes(e.symbol));

  const t = {
    selectTool: lang === 'kk' ? 'Таңдау / Жылжыту' : lang === 'ru' ? 'Выбрать / Переместить' : 'Select / Move',
    addTool: lang === 'kk' ? 'Атом қосу' : lang === 'ru' ? 'Добавить атом' : 'Add Atom',
    bondTool: lang === 'kk' ? 'Байланыс орнату' : lang === 'ru' ? 'Связь (линия)' : 'Draw Bond',
    deleteTool: lang === 'kk' ? 'Өшіру құралы' : lang === 'ru' ? 'Удалить' : 'Delete',
    addH: lang === 'kk' ? '+ Сутектер қосу' : lang === 'ru' ? '+ Добавить водороды' : '+ Add Hydrogens',
    clear: lang === 'kk' ? 'Тазарту' : lang === 'ru' ? 'Очистить' : 'Clear',
    organogens: lang === 'kk' ? 'Органогендер' : lang === 'ru' ? 'Органогены' : 'Organogens',
    halogens: lang === 'kk' ? 'Галогендер' : lang === 'ru' ? 'Галогены' : 'Halogens',
    metals: lang === 'kk' ? 'Металдар (иондық)' : lang === 'ru' ? 'Металлы (ионные)' : 'Metals (ionic)',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          <button
            type="button"
            onClick={() => onChangeTool('select')}
            title={t.selectTool}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTool === 'select'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.selectTool}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTool('add_atom')}
            title={t.addTool}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTool === 'add_atom'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.addTool}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTool('bond')}
            title={t.bondTool}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTool === 'bond'
                ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.bondTool}</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTool('delete')}
            title={t.deleteTool}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTool === 'delete'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.deleteTool}</span>
          </button>
        </div>

        {/* Undo / Redo / Clear / Hydrogens */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Ctrl+Z"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Ctrl+Y"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onAddHydrogens}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm hover:shadow-teal-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.addH}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            title={t.clear}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Elements Groups */}
      <div className="space-y-3">
        {/* Organogens */}
        <div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
            {t.organogens}
          </span>
          <div className="grid grid-cols-6 gap-2">
            {organogens.map((el) => {
              const isSelected = selectedElement === el.symbol;
              return (
                <button
                  key={el.symbol}
                  type="button"
                  onClick={() => {
                    onSelectElement(el.symbol);
                    if (activeTool !== 'add_atom') onChangeTool('add_atom');
                  }}
                  className={`relative p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 mb-1 shadow-inner"
                    style={{ backgroundColor: el.cpkColor }}
                  />
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {el.name[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Halogens */}
        <div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
            {t.halogens}
          </span>
          <div className="grid grid-cols-4 gap-2">
            {halogens.map((el) => {
              const isSelected = selectedElement === el.symbol;
              return (
                <button
                  key={el.symbol}
                  type="button"
                  onClick={() => {
                    onSelectElement(el.symbol);
                    if (activeTool !== 'add_atom') onChangeTool('add_atom');
                  }}
                  className={`relative p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 mb-1 shadow-inner"
                    style={{ backgroundColor: el.cpkColor }}
                  />
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {el.name[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Metals */}
        <div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
            {t.metals}
          </span>
          <div className="grid grid-cols-6 gap-2">
            {metals.map((el) => {
              const isSelected = selectedElement === el.symbol;
              return (
                <button
                  key={el.symbol}
                  type="button"
                  onClick={() => {
                    onSelectElement(el.symbol);
                    if (activeTool !== 'add_atom') onChangeTool('add_atom');
                  }}
                  className={`relative p-2 rounded-xl flex flex-col items-center justify-center border transition-all ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 mb-1 shadow-inner"
                    style={{ backgroundColor: el.cpkColor }}
                  />
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white leading-none">
                    {el.symbol}
                  </span>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {el.name[lang]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
