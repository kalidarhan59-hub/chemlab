import React from 'react';
import { useTranslation } from 'react-i18next';
import { VesselState } from '../../utils/lab/reactionEngine';
import { TestTube } from './TestTube';
import { Flask } from './Flask';
import { Burner } from './Burner';

interface LabSceneProps {
  vessels: VesselState[];
  activeVesselId: string;
  onSelectVessel: (id: string) => void;
  onDropReagent: (vesselId: string, reagentId: string) => void;
  isBurnerOn: boolean;
  onToggleBurner: () => void;
}

export const LabScene: React.FC<LabSceneProps> = ({
  vessels,
  activeVesselId,
  onSelectVessel,
  onDropReagent,
  isBurnerOn,
  onToggleBurner,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  const testTubes = vessels.filter((v) => v.type === 'test_tube');
  const flask = vessels.find((v) => v.type === 'flask');

  return (
    <div className="relative w-full rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl overflow-hidden">
      {/* Background Lab Glow */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top instruction line */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>{t('lab.scene.labBench', 'Зертханалық үстел мен штатив')}</span>
        </span>

        <span className="text-[11px] text-slate-400">
          {t('lab.scene.clickHint', 'Сынауықты таңдау үшін үстінен басыңыз')}
        </span>
      </div>

      {/* Main Glassware Bench Layout */}
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 sm:gap-12 pt-4 pb-2">
        {/* Test Tube Rack (Штатив) with 4 test tubes */}
        <div className="relative flex flex-col items-center">
          {/* Glass Tubes Row */}
          <div className="flex items-end gap-3 sm:gap-6 px-4 z-10 relative">
            {testTubes.map((tube) => (
              <TestTube
                key={tube.id}
                vessel={tube}
                isActive={activeVesselId === tube.id}
                onSelect={onSelectVessel}
                onDropReagent={(reagentId) => onDropReagent(tube.id, reagentId)}
              />
            ))}
          </div>

          {/* Wooden/Metallic Test Tube Rack Stand SVG Structure */}
          <div className="w-full -mt-24 pt-24 relative select-none pointer-events-none">
            {/* Top Holder Beam with holes */}
            <div className="h-4 w-full bg-gradient-to-r from-amber-900/60 via-amber-800/80 to-amber-900/60 border border-amber-700/60 rounded-lg shadow-md relative">
              <div className="absolute inset-y-0 inset-x-4 flex justify-between items-center opacity-40">
                <span className="w-6 h-2 bg-black rounded-full" />
                <span className="w-6 h-2 bg-black rounded-full" />
                <span className="w-6 h-2 bg-black rounded-full" />
                <span className="w-6 h-2 bg-black rounded-full" />
              </div>
            </div>

            {/* Vertical Supports */}
            <div className="h-28 w-full flex justify-between px-2">
              <div className="w-2.5 h-full bg-amber-900/80 border-x border-amber-700/50 shadow-inner" />
              <div className="w-2.5 h-full bg-amber-900/80 border-x border-amber-700/50 shadow-inner" />
            </div>

            {/* Bottom Base Plank */}
            <div className="h-4 w-full bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 border border-amber-700/60 rounded-md shadow-xl" />
          </div>
        </div>

        {/* Center: Bunsen Burner */}
        <div className="flex flex-col items-center justify-end z-10">
          <Burner
            isOn={isBurnerOn}
            onToggle={onToggleBurner}
          />
        </div>

        {/* Right side: Erlenmeyer Flask */}
        {flask && (
          <div className="flex flex-col items-center justify-end z-10">
            <Flask
              vessel={flask}
              isActive={activeVesselId === flask.id}
              onSelect={onSelectVessel}
              onDropReagent={(reagentId) => onDropReagent(flask.id, reagentId)}
            />
          </div>
        )}
      </div>

      {/* Laboratory Bench Surface Tabletop */}
      <div className="w-full h-3 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t border-slate-600/70 rounded-full mt-2 shadow-2xl" />
      <div className="w-full h-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
    </div>
  );
};
