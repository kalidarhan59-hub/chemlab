import React from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Flame, Snowflake, Sun } from 'lucide-react';
import { ChemicalElement } from '../../types/element';
import { calculateStateAtTemperature } from '../../utils/elementHelpers';

export interface TemperatureSliderProps {
  temperatureK: number;
  onChange: (val: number) => void;
  elements: ChemicalElement[];
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({
  temperatureK,
  onChange,
  elements,
}) => {
  const { t } = useTranslation();

  const celsius = (temperatureK - 273.15).toFixed(1);

  // Compute counts at this temperature
  let solidCount = 0;
  let liquidCount = 0;
  let gasCount = 0;
  let unknownCount = 0;

  elements.forEach((el) => {
    const s = calculateStateAtTemperature(el, temperatureK);
    if (s === 'solid') solidCount++;
    else if (s === 'liquid') liquidCount++;
    else if (s === 'gas') gasCount++;
    else unknownCount++;
  });

  const presets = [
    { label: '0 K', temp: 0, title: t('periodicTable.temperature.presets.absoluteZero') },
    { label: '273 K (0°C)', temp: 273.15, title: t('periodicTable.temperature.presets.icePoint') },
    { label: '298 K (25°C)', temp: 298.15, title: t('periodicTable.temperature.presets.room') },
    { label: '373 K (100°C)', temp: 373.15, title: t('periodicTable.temperature.presets.waterBoiling') },
    { label: '5778 K', temp: 5778, title: t('periodicTable.temperature.presets.sunSurface') },
  ];

  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-200/80 dark:border-white/10 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-500">
            <Thermometer className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            {t('periodicTable.temperature.label')}
          </span>
        </div>

        {/* Readout */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-sm sm:text-base font-black text-teal-600 dark:text-teal-400">
            {Math.round(temperatureK)} K
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({celsius} °C)
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="6000"
          step="5"
          value={temperatureK}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-blue-500 via-teal-400 via-amber-400 to-rose-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
          aria-label="Temperature slider"
        />
      </div>

      {/* Preset Quick Buttons & Counts */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Preset buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {presets.map((p) => (
            <button
              key={p.temp}
              type="button"
              onClick={() => onChange(p.temp)}
              title={p.title}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                Math.abs(temperatureK - p.temp) < 2
                  ? 'bg-teal-500 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* State distribution badge */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-700 dark:text-slate-300">
            <strong>{solidCount}</strong> {t('periodicTable.states.solid')}
          </span>
          <span>•</span>
          <span className="text-blue-500">
            <strong>{liquidCount}</strong> {t('periodicTable.states.liquid')}
          </span>
          <span>•</span>
          <span className="text-purple-500">
            <strong>{gasCount}</strong> {t('periodicTable.states.gas')}
          </span>
        </div>
      </div>
    </div>
  );
};
