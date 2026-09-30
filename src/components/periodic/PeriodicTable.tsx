import React, { useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChemicalElement, ElementCategory, HeatmapProperty } from '../../types/element';
import { Language } from '../../types';
import { ElementCell } from './ElementCell';
import { getElementGridPosition } from '../../utils/elementHelpers';

export interface PeriodicTableProps {
  elements: ChemicalElement[];
  language: Language;
  onSelectElement: (el: ChemicalElement) => void;
  selectedElement: ChemicalElement | null;
  activeCategory: ElementCategory | 'all';
  temperatureK: number;
  heatmapProperty: HeatmapProperty;
  searchFilterMatches: Set<number>;
  isSearchActive: boolean;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  elements,
  language,
  onSelectElement,
  selectedElement,
  activeCategory,
  temperatureK,
  heatmapProperty,
  searchFilterMatches,
  isSearchActive,
}) => {
  const { t } = useTranslation();
  const tableRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation across the grid
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedElement) return;

      let nextNumber = selectedElement.number;
      if (e.key === 'ArrowRight') {
        nextNumber = Math.min(118, selectedElement.number + 1);
      } else if (e.key === 'ArrowLeft') {
        nextNumber = Math.max(1, selectedElement.number - 1);
      } else if (e.key === 'ArrowDown') {
        // Jump approx 1 period down
        const nextInGroup = elements.find(
          (el) => el.group === selectedElement.group && el.period === selectedElement.period + 1
        );
        if (nextInGroup) nextNumber = nextInGroup.number;
      } else if (e.key === 'ArrowUp') {
        // Jump approx 1 period up
        const prevInGroup = elements.find(
          (el) => el.group === selectedElement.group && el.period === selectedElement.period - 1
        );
        if (prevInGroup) nextNumber = prevInGroup.number;
      } else if (e.key === 'Enter') {
        onSelectElement(selectedElement);
        return;
      } else {
        return;
      }

      e.preventDefault();
      const target = elements.find((el) => el.number === nextNumber);
      if (target) onSelectElement(target);
    },
    [selectedElement, elements, onSelectElement]
  );

  const groups = Array.from({ length: 18 }, (_, i) => i + 1);
  const periods = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      ref={tableRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full overflow-x-auto pb-6 outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-2xl select-none"
      aria-label="Periodic Table Grid"
    >
      <div className="min-w-[980px] lg:min-w-[1100px] p-2 sm:p-4 rounded-3xl glass-panel border border-slate-200/80 dark:border-white/10 relative">
        {/* Main 18-column grid */}
        <div
          className="grid gap-1.5 sm:gap-2"
          style={{
            gridTemplateColumns: '32px repeat(18, minmax(0, 1fr))',
            gridTemplateRows: '24px repeat(7, minmax(68px, 1fr)) 16px repeat(2, minmax(68px, 1fr))',
          }}
        >
          {/* Top Corner Empty */}
          <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center">
            P\G
          </div>

          {/* Group Column Headers (1 to 18) */}
          {groups.map((g) => (
            <div
              key={`group-${g}`}
              className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 text-center flex items-center justify-center"
            >
              {g}
            </div>
          ))}

          {/* Period Row Headers (1 to 7) */}
          {periods.map((p) => (
            <div
              key={`period-${p}`}
              style={{ gridRow: p + 1, gridColumn: 1 }}
              className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center"
            >
              {p}
            </div>
          ))}

          {/* Lanthanide Placeholder Marker (Row 7 = Period 6, Col 4 = Group 3) */}
          <div
            style={{ gridRow: 7, gridColumn: 4 }}
            className="rounded-lg sm:rounded-xl border border-dashed border-pink-400/60 bg-pink-500/10 flex flex-col items-center justify-center p-1 text-center text-pink-600 dark:text-pink-300 pointer-events-none"
          >
            <span className="text-[10px] sm:text-xs font-mono font-bold">57-71</span>
            <span className="text-[9px] font-semibold truncate leading-tight">La-Lu</span>
          </div>

          {/* Actinide Placeholder Marker (Row 8 = Period 7, Col 4 = Group 3) */}
          <div
            style={{ gridRow: 8, gridColumn: 4 }}
            className="rounded-lg sm:rounded-xl border border-dashed border-fuchsia-400/60 bg-fuchsia-500/10 flex flex-col items-center justify-center p-1 text-center text-fuchsia-600 dark:text-fuchsia-300 pointer-events-none"
          >
            <span className="text-[10px] sm:text-xs font-mono font-bold">89-103</span>
            <span className="text-[9px] font-semibold truncate leading-tight">Ac-Lr</span>
          </div>

          {/* Spacer row indicator for Lanthanides/Actinides */}
          <div
            style={{ gridRow: 9, gridColumn: '2 / span 18' }}
            className="h-2"
          />

          {/* f-block label labels on the left */}
          <div
            style={{ gridRow: 10, gridColumn: 1 }}
            className="text-[10px] font-mono font-bold text-pink-500 flex items-center justify-center"
          >
            *
          </div>
          <div
            style={{ gridRow: 11, gridColumn: 1 }}
            className="text-[10px] font-mono font-bold text-fuchsia-500 flex items-center justify-center"
          >
            **
          </div>

          {/* Chemical Element Cells */}
          {elements.map((el) => {
            const pos = getElementGridPosition(el);
            // row in CSS grid is pos.row + 1 because row 1 is group header, and f-block has a spacer row
            const gridRow = pos.row > 7 ? pos.row + 2 : pos.row + 1;
            const gridCol = pos.col + 1; // col 1 is period row header

            const isSelected = selectedElement?.number === el.number;
            const isCategoryDimmed = activeCategory !== 'all' && el.category !== activeCategory;
            const isSearchDimmed = isSearchActive && !searchFilterMatches.has(el.number);
            const isDimmed = isCategoryDimmed || isSearchDimmed;
            const isHighlighted = isSearchActive && searchFilterMatches.has(el.number);

            return (
              <ElementCell
                key={`el-cell-${el.number}`}
                element={el}
                language={language}
                onClick={onSelectElement}
                isSelected={isSelected}
                isDimmed={isDimmed}
                isHighlighted={isHighlighted}
                temperatureK={temperatureK}
                heatmapProperty={heatmapProperty}
                style={{
                  gridRow,
                  gridColumn: gridCol,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
