import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Atom,
  Box,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  Undo2,
  Redo2,
  Trash2,
  Maximize2,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { MoleculeGraph, PresetMolecule } from '../types/molecule';
import { MoleculeCanvas2D } from '../components/molecules/MoleculeCanvas2D';
import { MoleculeViewer3D, MoleculeViewer3DRef } from '../components/molecules/MoleculeViewer3D';
import { AtomPalette } from '../components/molecules/AtomPalette';
import { AnalysisPanel } from '../components/molecules/AnalysisPanel';
import { MoleculeLibraryModal } from '../components/molecules/MoleculeLibraryModal';
import { MoleculeQuiz } from '../components/molecules/MoleculeQuiz';
import { ExportButtons } from '../components/molecules/ExportButtons';
import { SEO } from '../components/ui/SEO';
import { addHydrogensToMolecule, checkValences } from '../utils/mol/valence';

// Default initial molecule: Water (H₂O)
const INITIAL_WATER: MoleculeGraph = {
  atoms: [
    { id: 'O1', element: 'O', x: 0, y: 0, z: 0 },
    { id: 'H1', element: 'H', x: -55, y: 45, z: 0 },
    { id: 'H2', element: 'H', x: 55, y: 45, z: 0 },
  ],
  bonds: [
    { a: 'O1', b: 'H1', order: 1 },
    { a: 'O1', b: 'H2', order: 1 },
  ],
};

export const MoleculesPage: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['kk', 'ru', 'en'].includes(language) ? language : 'kk') as 'kk' | 'ru' | 'en';

  // Active view tab
  const [activeTab, setActiveTab] = useState<'editor2d' | 'view3d' | 'quiz'>('editor2d');

  // Palette & Tool states
  const [selectedElement, setSelectedElement] = useState<string>('C');
  const [activeTool, setActiveTool] = useState<'select' | 'add_atom' | 'bond' | 'delete'>('select');

  // Library modal state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<MoleculeGraph[]>([INITIAL_WATER]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Current working molecule graph
  const currentGraph = history[historyIndex] || INITIAL_WATER;

  // 3D viewer ref for image export
  const viewer3DRef = useRef<MoleculeViewer3DRef | null>(null);

  // Parse molecule from URL hash if provided
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#mol=')) {
        const rawJson = decodeURIComponent(hash.substring(5));
        const parsed = JSON.parse(rawJson);
        if (parsed.atoms && parsed.bonds) {
          setHistory([parsed]);
          setHistoryIndex(0);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Update graph with history push
  const handleGraphChange = useCallback(
    (newGraph: MoleculeGraph) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newGraph];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleClear = () => {
    handleGraphChange({ atoms: [], bonds: [] });
  };

  const handleAddHydrogens = () => {
    const saturated = addHydrogensToMolecule(currentGraph);
    handleGraphChange(saturated);
  };

  const handleLoadPreset = (mol: PresetMolecule | MoleculeGraph) => {
    handleGraphChange({ atoms: mol.atoms, bonds: mol.bonds });
    setActiveTab('editor2d');
  };

  const valenceWarnings = checkValences(currentGraph);

  const t = {
    seoTitle:
      lang === 'kk'
        ? 'Молекулалар конструкторы | ChemLab'
        : lang === 'ru'
        ? 'Конструктор молекул 2D/3D | ChemLab'
        : 'Molecule Builder 2D/3D | ChemLab',
    seoDesc:
      lang === 'kk'
        ? 'Интерактивті 2D/3D химиялық молекула құрастырушысы. Валенттілікті тексеру, IUPAC номенклатурасы және молярлық масса.'
        : lang === 'ru'
        ? 'Интерактивный конструктор молекул в 2D и 3D. Расчёт валентности, молярной массы, номенклатуры IUPAC и викторина.'
        : 'Interactive 2D & 3D chemical molecule builder with valence validation, IUPAC naming, and chemical properties.',
    heroBadge:
      lang === 'kk'
        ? '🧪 2D & 3D Интерактивті конструктор'
        : lang === 'ru'
        ? '🧪 Интерактивный 2D & 3D Конструктор'
        : '🧪 Interactive 2D & 3D Builder',
    heroTitlePart1:
      lang === 'kk' ? 'Молекулаларды өз қолыңызбен ' : lang === 'ru' ? 'Создавайте молекулы ' : 'Build molecules ',
    heroTitleGradient:
      lang === 'kk' ? 'құрастырыңыз және зерттеңіз' : lang === 'ru' ? 'своими руками' : 'with your own hands',
    heroSubtitle:
      lang === 'kk'
        ? 'Атомдарды байланыстырыңыз, нақты уақытта валенттілік пен молярлық массаны есептеңіз, 3D пішінін зерттеңіз.'
        : lang === 'ru'
        ? 'Соединяйте атомы, проверяйте валентность в реальном времени, исследуйте трёхмерную геометрию и проверяйте знания в викторине.'
        : 'Connect atoms, validate chemical valences in real-time, inspect 3D geometries, and test knowledge in quiz mode.',
    tabEditor2D: lang === 'kk' ? '2D Редактор' : lang === 'ru' ? '2D Редактор' : '2D Editor',
    tabView3D: lang === 'kk' ? '3D Кеңістік' : lang === 'ru' ? '3D Просмотр' : '3D Viewer',
    tabQuiz: lang === 'kk' ? 'Викторина' : lang === 'ru' ? 'Викторина' : 'Quiz Mode',
    openLibrary: lang === 'kk' ? 'Кітапхана (30+)' : lang === 'ru' ? 'Библиотека молекул' : 'Library (30+)',
  };

  return (
    <>
      <SEO title={t.seoTitle} description={t.seoDesc} />

      <div className="min-h-screen pb-16 pt-6 px-4 max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-900/80 p-6 md:p-8 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                {t.heroBadge}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.heroTitlePart1}{' '}
                <span className="bg-gradient-to-r from-teal-700 via-sky-700 to-purple-700 dark:from-teal-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {t.heroTitleGradient}
                </span>
              </h1>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.openLibrary}</span>
              </button>

              <ExportButtons
                graph={currentGraph}
                onGet3DSnapshot={() => viewer3DRef.current?.getSnapshotDataUrl() || null}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('editor2d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'editor2d'
                  ? 'bg-white dark:bg-slate-750 text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>{t.tabEditor2D}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('view3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'view3d'
                  ? 'bg-white dark:bg-slate-750 text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{t.tabView3D}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-slate-750 text-teal-600 dark:text-teal-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t.tabQuiz}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: 2D Editor View */}
        {activeTab === 'editor2d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Atom Palette & Tools */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <AtomPalette
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                activeTool={activeTool}
                onChangeTool={setActiveTool}
                onAddHydrogens={handleAddHydrogens}
                onClear={handleClear}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                lang={lang}
              />
            </div>

            {/* Center: 2D SVG Canvas */}
            <div className="lg:col-span-8 xl:col-span-5 space-y-4">
              <MoleculeCanvas2D
                graph={currentGraph}
                onChangeGraph={handleGraphChange}
                selectedElement={selectedElement}
                activeTool={activeTool}
                valenceWarnings={valenceWarnings}
                lang={lang}
              />
            </div>

            {/* Right: Real-time Analysis Panel */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-4">
              <AnalysisPanel graph={currentGraph} lang={lang} />
            </div>
          </div>
        )}

        {/* Tab 2: 3D View */}
        {activeTab === 'view3d' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <MoleculeViewer3D ref={viewer3DRef} graph={currentGraph} lang={lang} />
            </div>

            <div className="lg:col-span-4 space-y-4">
              <AnalysisPanel graph={currentGraph} lang={lang} />
            </div>
          </div>
        )}

        {/* Tab 3: Molecule Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <MoleculeQuiz lang={lang} onLoadMoleculeToEditor={handleLoadPreset} />
          </div>
        )}

        {/* Preset Molecule Library Modal */}
        <MoleculeLibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          onSelectMolecule={handleLoadPreset}
          lang={lang}
        />
      </div>
    </>
  );
};

export default MoleculesPage;
