import React from 'react';
import { ChemicalElement } from '../../types/element';

export interface ElectronShellDiagramProps {
  element: ChemicalElement;
  size?: number;
  className?: string;
}

export const ElectronShellDiagram: React.FC<ElectronShellDiagramProps> = ({
  element,
  size = 240,
  className = '',
}) => {
  const shells = element.shells || [element.number];
  const center = size / 2;
  const maxRadius = center - 16;
  const shellCount = shells.length;
  const step = shellCount > 1 ? maxRadius / (shellCount + 1) : maxRadius / 2;

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label={`Electron shell diagram for ${element.symbol}`}
      >
        {/* Central Nucleus */}
        <circle
          cx={center}
          cy={center}
          r={Math.max(14, step * 0.8)}
          fill="url(#nucleusGradient)"
          className="filter drop-shadow-md"
        />
        <text
          x={center}
          y={center + 4}
          textAnchor="middle"
          className="font-mono font-black text-xs sm:text-sm fill-white select-none pointer-events-none"
        >
          {element.symbol}
        </text>

        <defs>
          <radialGradient id="nucleusGradient" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </radialGradient>
        </defs>

        {/* Concentric Shells */}
        {shells.map((electronsInShell, idx) => {
          const r = (idx + 1) * step + 10;
          const letter = shellNames[idx] || (idx + 1).toString();

          return (
            <g key={idx}>
              {/* Shell Ring */}
              <circle
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                className="text-slate-300 dark:text-slate-700 opacity-80"
              />

              {/* Shell Label */}
              <text
                x={center}
                y={center - r + 3}
                textAnchor="middle"
                className="text-[9px] font-mono font-bold fill-slate-400 dark:fill-slate-500 pointer-events-none"
              >
                {letter}
              </text>

              {/* Distributed Electron Dots */}
              {Array.from({ length: electronsInShell }).map((_, eIdx) => {
                const angle = (eIdx / electronsInShell) * 2 * Math.PI - Math.PI / 2;
                const ex = center + r * Math.cos(angle);
                const ey = center + r * Math.sin(angle);

                return (
                  <circle
                    key={eIdx}
                    cx={ex}
                    cy={ey}
                    r={3}
                    className="fill-teal-500 dark:fill-teal-400 filter drop-shadow-[0_0_2px_rgba(20,184,166,0.8)]"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Shell counts footer badge */}
      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
        {shells.map((count, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold"
            title={`${shellNames[idx] || idx + 1}: ${count} electrons`}
          >
            {count}
          </span>
        ))}
      </div>
    </div>
  );
};
