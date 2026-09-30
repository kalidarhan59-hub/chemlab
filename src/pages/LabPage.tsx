import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import {
  VesselState,
  createEmptyVessel,
  processVesselState,
  REAGENTS_MAP,
  REACTIONS_LIST,
  Reagent,
  LabReaction,
} from '../utils/lab/reactionEngine';
import { LabScene } from '../components/lab/LabScene';
import { ReagentShelf } from '../components/lab/ReagentShelf';
import { ResultPanel } from '../components/lab/ResultPanel';
import { LabControls } from '../components/lab/LabControls';
import { SafetyModal } from '../components/lab/SafetyModal';
import { ExperimentLogModal, LogEntry } from '../components/lab/ExperimentLogModal';
import { TaskMode, LabTask } from '../components/lab/TaskMode';
import { useLocalStorage } from '../hooks/useLocalStorage';
import labTasksData from '../data/labTasks.json';

const INITIAL_VESSELS: VesselState[] = [
  createEmptyVessel('tube_1', 'test_tube', { kk: '1-Сынауық', ru: 'Пробирка 1', en: 'Tube 1' }),
  createEmptyVessel('tube_2', 'test_tube', { kk: '2-Сынауық', ru: 'Пробирка 2', en: 'Tube 2' }),
  createEmptyVessel('tube_3', 'test_tube', { kk: '3-Сынауық', ru: 'Пробирка 3', en: 'Tube 3' }),
  createEmptyVessel('tube_4', 'test_tube', { kk: '4-Сынауық', ru: 'Пробирка 4', en: 'Tube 4' }),
  createEmptyVessel('flask', 'flask', { kk: 'Колба', ru: 'Колба', en: 'Flask' }),
];

export const LabPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';

  // Persistence
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('chemlab:lab-log', []);
  const [completedTasks, setCompletedTasks] = useLocalStorage<
    Record<string, { stars: number; timestamp: number }>
  >('chemlab:lab-tasks', {});
  const [hasPledgedSafety, setHasPledgedSafety] = useLocalStorage<boolean>(
    'chemlab:lab-safety-pledge',
    false
  );

  // Vessels State
  const [vessels, setVessels] = useState<VesselState[]>(INITIAL_VESSELS);
  const [activeVesselId, setActiveVesselId] = useState<string>('tube_1');
  const [isBurnerOn, setIsBurnerOn] = useState<boolean>(false);
  const [selectedReagentId, setSelectedReagentId] = useState<string | null>(null);

  // Modals & Panels
  const [isSafetyOpen, setIsSafetyOpen] = useState<boolean>(false);
  const [isLogOpen, setIsLogOpen] = useState<boolean>(false);
  const [isTasksOpen, setIsTasksOpen] = useState<boolean>(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [taskSuccessBanner, setTaskSuccessBanner] = useState<string | null>(null);
  const [snapshotCopied, setSnapshotCopied] = useState<boolean>(false);

  // Show safety modal on first entry
  useEffect(() => {
    if (!hasPledgedSafety) {
      setIsSafetyOpen(true);
    }
  }, [hasPledgedSafety]);

  const activeVessel = vessels.find((v) => v.id === activeVesselId) || vessels[0];

  // Helper to check task completion
  const checkTaskCompletion = useCallback(
    (reaction: LabReaction, vessel: VesselState) => {
      const allTasks: LabTask[] = labTasksData as LabTask[];

      allTasks.forEach((task) => {
        if (completedTasks[task.id]) return; // already done

        let isCompleted = false;

        switch (task.target.type) {
          case 'precipitateColor':
            if (vessel.precipitate?.color === task.target.value) isCompleted = true;
            break;
          case 'gasWithoutPrecipitate':
            if (vessel.gas && !vessel.precipitate) isCompleted = true;
            break;
          case 'reactionId':
            const targetIds = Array.isArray(task.target.value) ? task.target.value : [task.target.value];
            if (targetIds.includes(reaction.id)) isCompleted = true;
            break;
          case 'gasProduced':
            if (vessel.gas?.formula === task.target.gas) isCompleted = true;
            break;
          case 'indicatorColor':
            if (
              vessel.currentSubstances.includes(task.target.indicator || '') &&
              reaction.type === 'indicator'
            ) {
              isCompleted = true;
            }
            break;
          default:
            break;
        }

        if (isCompleted) {
          setCompletedTasks((prev) => ({
            ...prev,
            [task.id]: { stars: 3, timestamp: Date.now() },
          }));
          setTaskSuccessBanner(task.title[currentLang] || task.title.kk);
          setTimeout(() => setTaskSuccessBanner(null), 5000);
        }
      });
    },
    [completedTasks, currentLang, setCompletedTasks]
  );

  // Add reagent to a vessel
  const handleAddReagent = useCallback(
    (vesselId: string, reagentId: string) => {
      setVessels((prevVessels) =>
        prevVessels.map((v) => {
          if (v.id !== vesselId) return v;

          const updated = processVesselState(v, reagentId, 5, isBurnerOn);

          // If reaction triggered, log it and check task
          if (updated.lastReaction && updated.lastReaction.id !== v.lastReaction?.id) {
            const newLog: LogEntry = {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              timestamp: Date.now(),
              reagents: [...updated.currentSubstances],
              reaction: updated.lastReaction,
            };
            setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
            checkTaskCompletion(updated.lastReaction, updated);
          }

          return updated;
        })
      );
    },
    [isBurnerOn, setLogs, checkTaskCompletion]
  );

  // Click on reagent in shelf
  const handleSelectReagent = (reagent: Reagent) => {
    setSelectedReagentId(reagent.id);
    // Add to active vessel immediately
    handleAddReagent(activeVesselId, reagent.id);
  };

  // Toggle Bunsen burner
  const handleToggleBurner = () => {
    const nextBurnerState = !isBurnerOn;
    setIsBurnerOn(nextBurnerState);

    // Apply thermal reaction check to active vessel
    setVessels((prev) =>
      prev.map((v) => {
        if (v.id !== activeVesselId) return v;

        const updated = processVesselState(v, undefined, 0, nextBurnerState);
        if (updated.lastReaction && updated.lastReaction.id !== v.lastReaction?.id) {
          const newLog: LogEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            timestamp: Date.now(),
            reagents: [...updated.currentSubstances],
            reaction: updated.lastReaction,
          };
          setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
          checkTaskCompletion(updated.lastReaction, updated);
        }
        return updated;
      })
    );
  };

  // Undo last reagent in active vessel
  const handleUndo = () => {
    setVessels((prev) =>
      prev.map((v) => {
        if (v.id !== activeVesselId || v.reagentsAdded.length === 0) return v;

        const copyReagents = [...v.reagentsAdded];
        copyReagents.pop();

        let reconstructed = createEmptyVessel(v.id, v.type, v.name);
        copyReagents.forEach((item) => {
          reconstructed = processVesselState(reconstructed, item.reagentId, item.amountMl, isBurnerOn);
        });

        return reconstructed;
      })
    );
  };

  // Clear active vessel
  const handleClearActive = () => {
    setVessels((prev) =>
      prev.map((v) => (v.id === activeVesselId ? createEmptyVessel(v.id, v.type, v.name) : v))
    );
  };

  // Clear all vessels
  const handleClearAll = () => {
    setVessels(INITIAL_VESSELS);
    setIsBurnerOn(false);
  };

  // Random preset experience
  const handleRandomExperiment = () => {
    // Pick an exciting reaction
    const excitingReactions = REACTIONS_LIST.filter(
      (r) => r.effects.precipitate || r.effects.gas || r.type === 'complex'
    );
    const chosen = excitingReactions[Math.floor(Math.random() * excitingReactions.length)];
    if (!chosen) return;

    // Reset active vessel and add reagents sequentially
    let nextVessel = createEmptyVessel(activeVessel.id, activeVessel.type, activeVessel.name);
    chosen.reactants.forEach((rId) => {
      if (REAGENTS_MAP[rId]) {
        nextVessel = processVesselState(nextVessel, rId, 5, chosen.requiresHeating || false);
      }
    });

    if (chosen.requiresHeating) {
      setIsBurnerOn(true);
    }

    setVessels((prev) => prev.map((v) => (v.id === activeVesselId ? nextVessel : v)));

    if (nextVessel.lastReaction) {
      const newLog: LogEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        reagents: [...nextVessel.currentSubstances],
        reaction: nextVessel.lastReaction,
      };
      setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
      checkTaskCompletion(nextVessel.lastReaction, nextVessel);
    }
  };

  // Export report summary
  const handleExportSnapshot = async () => {
    try {
      const activeText = activeVessel.lastReaction
        ? `ChemLab Тәжірибе:\nЫдыс: ${activeVessel.name[currentLang]}\nРеагенттер: ${activeVessel.currentSubstances.join(' + ')}\nТеңдеу: ${activeVessel.lastReaction.equations.molecular}\nТүсініктеме: ${activeVessel.lastReaction.explanation[currentLang]}`
        : `ChemLab Ыдыс: ${activeVessel.name[currentLang]} (${activeVessel.volumeMl} мл)`;

      await navigator.clipboard.writeText(activeText);
      setSnapshotCopied(true);
      setTimeout(() => setSnapshotCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={t('lab.seo.title', 'Виртуалды химиялық зертхана | ChemLab')}
        description={t(
          'lab.seo.description',
          'Интерактивті химиялық зертхана: реактивтермен тәжірибе жасау, тұнба мен газдар бөлінуі, индикаторлар, қауіпсіз симуляция және 15 білім беру тапсырмасы.'
        )}
      />

      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 backdrop-blur-md shadow-sm">
          <FlaskConical className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{t('lab.hero.badge', '⚗️ Виртуалды қауіпсіз зертхана')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('lab.hero.title', 'Химиялық эксперименттер')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-700 to-purple-700 dark:from-teal-400 dark:via-cyan-400 dark:to-purple-400">
            {t('lab.hero.titleGradient', 'интерактивті зертханада')}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {t(
            'lab.hero.subtitle',
            'Нақты реактивтерді араластырыңыз, тұнбалар мен газдардың бөлінуін бақылаңыз, индикаторлармен ортаны анықтаңыз және спиртшаммен қыздыру тәжірибелерін жасаңыз.'
          )}
        </p>
      </div>

      {/* Task Completion Celebration Banner */}
      {taskSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-sm font-semibold flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-emerald-900 dark:text-emerald-300 font-bold block">
                {t('lab.tasks.completeTitle', 'Тапсырма сәтті орындалды!')}
              </span>
              <span className="text-xs text-emerald-800 dark:text-emerald-200">«{taskSuccessBanner}»</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
            +50 {t('lab.tasks.earned', 'ұпай')}
          </span>
        </div>
      )}

      {/* Snapshot copied notification */}
      {snapshotCopied && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 border border-teal-500/50 text-teal-300 text-xs font-semibold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-teal-400" />
          <span>Тәжірибе мәліметтері буферге көшірілді!</span>
        </div>
      )}

      {/* Top Laboratory Toolbar Controls */}
      <LabControls
        onClearActive={handleClearActive}
        onClearAll={handleClearAll}
        onUndo={handleUndo}
        onRandomExperiment={handleRandomExperiment}
        onOpenLog={() => setIsLogOpen(true)}
        onToggleTasks={() => setIsTasksOpen(!isTasksOpen)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onExportSnapshot={handleExportSnapshot}
        isTasksActive={isTasksOpen}
        canUndo={activeVessel.reagentsAdded.length > 0}
        hasReagents={activeVessel.reagentsAdded.length > 0}
      />

      {/* Active Task Mode Panel (collapsible) */}
      {isTasksOpen && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-200">
          <TaskMode
            activeTaskId={activeTaskId}
            completedTasks={completedTasks}
            onSelectTask={(taskId) => {
              setActiveTaskId(taskId);
              setIsTasksOpen(false);
            }}
            onClose={() => setIsTasksOpen(false)}
          />
        </div>
      )}

      {/* Main Interactive Laboratory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lab Bench Glassware Scene (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <LabScene
            vessels={vessels}
            activeVesselId={activeVesselId}
            onSelectVessel={(id) => setActiveVesselId(id)}
            onDropReagent={(vesselId, reagentId) => handleAddReagent(vesselId, reagentId)}
            isBurnerOn={isBurnerOn}
            onToggleBurner={handleToggleBurner}
          />

          {/* Reaction Results Panel below bench */}
          <ResultPanel vessel={activeVessel} />
        </div>

        {/* Right Column: Reagent Shelf (5 cols) */}
        <div className="lg:col-span-5">
          <ReagentShelf
            selectedReagentId={selectedReagentId}
            onSelectReagent={handleSelectReagent}
            onQuickAdd={(rId) => handleAddReagent(activeVesselId, rId)}
          />
        </div>
      </div>

      {/* Safety Pledge Modal */}
      <SafetyModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        onAcceptPledge={() => setHasPledgedSafety(true)}
      />

      {/* Experiment Journal Log Modal */}
      <ExperimentLogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />
    </div>
  );
};

export default LabPage;
