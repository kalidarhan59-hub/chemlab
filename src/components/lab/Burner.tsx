import React from 'react';
import { useTranslation } from 'react-i18next';
import { Flame, Power } from 'lucide-react';

interface BurnerProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const Burner: React.FC<BurnerProps> = ({ isOn, onToggle, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Flame Animation Area */}
      <div className="h-20 w-16 relative flex items-end justify-center pb-0.5">
        {isOn && (
          <div className="relative flex items-end justify-center animate-in fade-in duration-300">
            {/* Outer Flame Glow */}
            <div className="absolute -inset-4 bg-amber-500/25 rounded-full blur-xl animate-pulse pointer-events-none" />

            {/* Outer Orange/Yellow Flame */}
            <div className="w-6 h-16 bg-gradient-to-t from-cyan-400 via-amber-400 to-orange-500 rounded-full blur-[1px] animate-flame-flicker opacity-90 shadow-lg shadow-amber-500/50" />

            {/* Inner Hot Blue Cone */}
            <div className="absolute bottom-0 w-3 h-8 bg-gradient-to-t from-blue-600 via-cyan-300 to-white rounded-full blur-[0.5px] opacity-95 animate-flame-flicker" />

            {/* Spark particles */}
            <span className="absolute -top-1 left-2 w-1 h-1 bg-amber-300 rounded-full animate-ping" />
            <span className="absolute -top-3 right-2 w-1 h-1 bg-orange-400 rounded-full animate-ping delay-150" />
          </div>
        )}
      </div>

      {/* Burner Chimney (Metal Tube) */}
      <div className="w-5 h-12 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 rounded-t-sm border border-slate-600 shadow-md relative">
        {/* Collar air holes */}
        <div className="absolute top-2 inset-x-0.5 h-1.5 bg-slate-900/60 rounded-xs" />
        <div className="absolute bottom-2 inset-x-0.5 h-1 bg-slate-900/60 rounded-xs" />
      </div>

      {/* Burner Heavy Base & Stand */}
      <div className="w-16 h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-800 rounded-t-md border border-slate-600 shadow-lg" />
      <div className="w-20 h-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-b-md shadow-xl" />

      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`mt-2.5 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
          isOn
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 ring-2 ring-amber-400/40 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isOn ? 'Спиртшамды сөндіру' : 'Спиртшамды жағу'}
      >
        <Power className={`w-3.5 h-3.5 ${isOn ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
        <span>{isOn ? t('lab.controls.burnerOn', 'Қыздыру қосулы') : t('lab.controls.burnerOff', 'Спиртшам')}</span>
      </button>
    </div>
  );
};
