import React from 'react';
import { PrecipitateInfo, GasInfo } from '../../utils/lab/reactionEngine';

interface EffectsLayerProps {
  volumeMl: number;
  maxVolumeMl?: number;
  liquidColor: string;
  precipitate: PrecipitateInfo | null;
  gas: GasInfo | null;
  isHeating: boolean;
  shape: 'tube' | 'flask';
}

export const EffectsLayer: React.FC<EffectsLayerProps> = ({
  volumeMl,
  maxVolumeMl = 50,
  liquidColor,
  precipitate,
  gas,
  isHeating,
  shape,
}) => {
  if (volumeMl <= 0 && !precipitate) return null;

  const fillPercent = Math.min(85, Math.max(12, (volumeMl / maxVolumeMl) * 75));

  // Bubble count based on gas intensity
  const bubbleCount = gas ? (gas.intensity === 'violent' ? 16 : gas.intensity === 'high' ? 10 : 5) : 0;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Liquid container with bottom alignment */}
      <div
        className="absolute bottom-0 inset-x-0 transition-all duration-700 ease-out"
        style={{ height: `${fillPercent}%` }}
      >
        {/* Liquid body */}
        <div
          className="w-full h-full relative transition-colors duration-700"
          style={{ backgroundColor: liquidColor }}
        >
          {/* Surface Meniscus */}
          <div
            className="absolute top-0 inset-x-0 h-2 -translate-y-1/2 rounded-full opacity-60 shadow-sm"
            style={{
              backgroundColor: liquidColor,
              filter: 'brightness(1.15)',
            }}
          />

          {/* Liquid internal reflection highlight */}
          <div className="absolute top-0 bottom-0 left-1 w-1 bg-white/20 rounded-full blur-[0.5px]" />

          {/* Precipitate layer at the bottom */}
          {precipitate && (
            <div
              className="absolute bottom-0 inset-x-0 h-4 sm:h-5 transition-all duration-700 animate-in fade-in rounded-b-xl shadow-md overflow-hidden"
              style={{ backgroundColor: precipitate.hex }}
            >
              {/* Irregular precipitate granules / texture */}
              <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-black" />
            </div>
          )}

          {/* Gas Bubbles Animation */}
          {gas && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: bubbleCount }).map((_, i) => {
                const leftPos = 15 + ((i * 19) % 70);
                const delaySec = (i * 0.18) % 1.5;
                const durationSec = gas.intensity === 'violent' ? 0.7 : gas.intensity === 'high' ? 1.0 : 1.5;
                const sizePx = 3 + (i % 4) * 1.5;

                return (
                  <span
                    key={i}
                    className="absolute bottom-1 rounded-full bg-white/70 border border-white/90 shadow-sm animate-bubble"
                    style={{
                      left: `${leftPos}%`,
                      width: `${sizePx}px`,
                      height: `${sizePx}px`,
                      animationDuration: `${durationSec}s`,
                      animationDelay: `${delaySec}s`,
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Steam / Vapor rising when heating */}
      {isHeating && volumeMl > 0 && (
        <div className="absolute top-2 inset-x-0 flex justify-center gap-1.5 opacity-70">
          <span className="w-1.5 h-6 bg-white/40 rounded-full blur-[2px] animate-pulse" />
          <span className="w-2 h-8 bg-white/30 rounded-full blur-[2px] animate-pulse delay-100" />
          <span className="w-1.5 h-5 bg-white/40 rounded-full blur-[2px] animate-pulse delay-200" />
        </div>
      )}
    </div>
  );
};
