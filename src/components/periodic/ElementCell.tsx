import React, { memo } from 'react';
import { ChemicalElement, ElementState, HeatmapProperty } from '../../types/element';
import { Language } from '../../types';
import { CATEGORY_COLORS, calculateStateAtTemperature, getHeatmapStyle } from '../../utils/elementHelpers';

export interface ElementCellProps {
  element: ChemicalElement;
  language: Language;
  onClick: (el: ChemicalElement) => void;
  isSelected?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  temperatureK?: number;
  heatmapProperty?: HeatmapProperty;
  style?: React.CSSProperties;
  className?: string;
  isQuizTarget?: boolean;
}

export const ElementCell: React.FC<ElementCellProps> = memo(({
  element,
  language,
  onClick,
  isSelected = false,
  isDimmed = false,
  isHighlighted = false,
  temperatureK = 298.15,
  heatmapProperty = 'none',
  style,
  className = '',
}) => {
  const categoryVisual = CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown;
  const localizedName = element.name[language] || element.name.kk;

  // Temperature state at chosen temperature
  const currentState: ElementState = calculateStateAtTemperature(element, temperatureK);

  // Heatmap styling if active
  const isHeatmapActive = heatmapProperty !== 'none';
  const heatmapStyle = isHeatmapActive ? getHeatmapStyle(element, heatmapProperty) : null;

  // Display value on cell: if heatmap is active, show the property value with unit
  let bottomValue = element.atomicMass.toFixed(element.atomicMass < 10 ? 3 : 2);
  if (isHeatmapActive) {
    const rawVal = element[heatmapProperty];
    if (rawVal === null || typeof rawVal !== 'number') {
      bottomValue = '—';
    } else {
      bottomValue = rawVal > 1000 ? Math.round(rawVal).toString() : rawVal.toFixed(1);
    }
  }

  // State letter indicator
  const stateBadgeLetter = currentState === 'solid' ? 'S' : currentState === 'liquid' ? 'L' : currentState === 'gas' ? 'G' : '?';
  const stateColor = currentState === 'gas' ? 'text-purple-600 dark:text-purple-400' : currentState === 'liquid' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400';

  return (
    <button
      type="button"
      onClick={() => onClick(element)}
      style={{
        ...style,
        ...(heatmapStyle?.bg ? { backgroundColor: heatmapStyle.bg, color: heatmapStyle.text } : {}),
      }}
      aria-label={`${element.number}. ${localizedName} (${element.symbol})`}
      className={`
        relative flex flex-col justify-between p-1 sm:p-1.5 rounded-lg sm:rounded-xl border transition-all duration-200 select-none text-left cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:z-20
        ${!isHeatmapActive ? `${categoryVisual.bgLight} ${categoryVisual.bgDark} ${categoryVisual.borderLight} ${categoryVisual.borderDark}` : 'border-white/20 shadow-xs'}
        ${isSelected ? 'ring-2 ring-teal-400 shadow-lg scale-105 z-10 brightness-110' : ''}
        ${isHighlighted ? 'scale-105 shadow-md z-10 ring-1 ring-white/60' : ''}
        ${isDimmed ? 'opacity-25 grayscale-[60%] scale-95' : 'hover:scale-105 hover:z-10 hover:shadow-md'}
        ${className}
      `}
    >
      {/* Top row: atomic number & state indicator */}
      <div className="flex items-center justify-between w-full leading-none">
        <span className="text-[9px] sm:text-[11px] font-mono font-bold opacity-80">
          {element.number}
        </span>
        <span
          className={`text-[8px] sm:text-[9px] font-mono font-bold px-1 rounded ${stateColor} opacity-75`}
          title={`State: ${currentState}`}
        >
          {stateBadgeLetter}
        </span>
      </div>

      {/* Symbol */}
      <div className="my-auto text-center">
        <span className="font-extrabold text-xs sm:text-base md:text-lg tracking-tight leading-none block font-mono">
          {element.symbol}
        </span>
        <span className="text-[8px] sm:text-[9.5px] truncate max-w-full block leading-tight font-medium opacity-90 mt-0.5">
          {localizedName}
        </span>
      </div>

      {/* Bottom row: Atomic mass or Heatmap value */}
      <div className="text-right w-full leading-none">
        <span className="text-[8px] sm:text-[10px] font-mono opacity-75 truncate block">
          {bottomValue}
        </span>
      </div>
    </button>
  );
});

ElementCell.displayName = 'ElementCell';
