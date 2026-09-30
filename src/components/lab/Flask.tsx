import React from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Flame } from 'lucide-react';
import { VesselState } from '../../utils/lab/reactionEngine';
import { EffectsLayer } from './EffectsLayer';

interface FlaskProps {
  vessel: VesselState;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDropReagent?: (reagentId: string) => void;
  isDragOver?: boolean;
}

export const Flask: React.FC<FlaskProps> = ({
  vessel,
  isActive,
  onSelect,
  onDropReagent,
  isDragOver = false,
}) => {
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const reagentId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/chemlab-reagent');
    if (reagentId && onDropReagent) {
      onDropReagent(reagentId);
    }
  };

  const isHot = vessel.temperatureC > 35;

  return (
    <div
      onClick={() => onSelect(vessel.id)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(vessel.id);
        }
      }}
      className={`relative flex flex-col items-center cursor-pointer select-none group focus:outline-none transition-transform duration-200 active:scale-95 ${
        isActive ? 'scale-105' : 'hover:-translate-y-1'
      }`}
      aria-label={`${vessel.name[currentLang]}, ${vessel.volumeMl} ml`}
      aria-selected={isActive}
    >
      {/* Top indicator */}
      <div className="h-6 flex items-center justify-center mb-1">
        {vessel.isHeating ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{vessel.temperatureC}°C</span>
          </span>
        ) : isHot ? (
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded-full border border-rose-500/30">
            <Thermometer className="w-3 h-3 text-rose-400" />
            <span>{vessel.temperatureC}°C</span>
          </span>
        ) : isActive ? (
          <span className="w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 animate-ping" />
        ) : null}
      </div>

      {/* Erlenmeyer Flask Body (Conical with Neck) */}
      <div className="relative flex flex-col items-center">
        {/* Flask Narrow Neck */}
        <div
          className={`w-9 h-12 border-x-2 border-t-2 rounded-t-sm transition-all duration-300 relative z-10 ${
            isActive
              ? 'border-teal-400 bg-slate-900/40'
              : isDragOver
              ? 'border-teal-300 bg-teal-500/10'
              : 'border-slate-500/50 bg-slate-900/25'
          }`}
        >
          {/* Rim */}
          <div className="absolute -top-1 -inset-x-1 h-2 bg-gradient-to-r from-slate-400/40 via-white/50 to-slate-400/40 rounded-full border border-white/40 shadow-sm" />
          {/* Neck Highlight */}
          <div className="absolute top-1 bottom-0 left-1 w-0.5 bg-white/30 rounded-full" />
        </div>

        {/* Flask Triangular Base */}
        <div
          className={`relative w-28 sm:w-32 h-36 sm:h-40 -mt-1 rounded-b-3xl border-2 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col justify-end ${
            isActive
              ? 'border-teal-400 shadow-2xl shadow-teal-500/25 bg-slate-900/40 ring-2 ring-teal-400/30'
              : isDragOver
              ? 'border-teal-300 bg-teal-500/10 ring-4 ring-teal-400/40'
              : 'border-slate-500/50 hover:border-slate-400 bg-slate-900/25'
          }`}
          style={{
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          }}
        >
          {/* Highlight along diagonal glass edge */}
          <div className="absolute inset-y-0 left-2 w-1 bg-white/20 blur-[0.5px] pointer-events-none" />

          {/* Liquid Effects */}
          <EffectsLayer
            volumeMl={vessel.volumeMl}
            maxVolumeMl={60}
            liquidColor={vessel.liquidColor}
            precipitate={vessel.precipitate}
            gas={vessel.gas}
            isHeating={vessel.isHeating}
            shape="flask"
          />
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <span
          className={`text-xs font-bold block transition-colors ${
            isActive ? 'text-teal-600 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
          }`}
        >
          {vessel.name[currentLang] || vessel.id}
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          {vessel.volumeMl > 0 ? `${vessel.volumeMl} мл` : 'Бос (пусто)'}
        </span>
      </div>
    </div>
  );
};
