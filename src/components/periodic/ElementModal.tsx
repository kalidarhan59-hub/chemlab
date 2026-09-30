import React, { useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  Sparkles,
  Layers,
  Thermometer,
  Compass,
  Cpu,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChemicalElement } from '../../types/element';
import { Language } from '../../types';
import { ElectronShellDiagram } from './ElectronShellDiagram';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { CATEGORY_COLORS } from '../../utils/elementHelpers';

// Lazy load 3D atom model for high performance
const AtomModel3D = lazy(() =>
  import('./AtomModel3D').then((m) => ({ default: m.AtomModel3D }))
);

export interface ElementModalProps {
  element: ChemicalElement | null;
  onClose: () => void;
  onSelectElement: (el: ChemicalElement) => void;
  allElements: ChemicalElement[];
  language: Language;
}

export const ElementModal: React.FC<ElementModalProps> = ({
  element,
  onClose,
  onSelectElement,
  allElements,
  language,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'info' | 'model' | 'history'>('info');
  const [copied, setCopied] = useState(false);

  if (!element) return null;

  const categoryVisual = CATEGORY_COLORS[element.category] || CATEGORY_COLORS.unknown;
  const categoryLabel = t(`periodicTable.categories.${element.category}`);

  // Navigation: Previous & Next
  const currentIndex = allElements.findIndex((e) => e.number === element.number);
  const prevElement = currentIndex > 0 ? allElements[currentIndex - 1] : allElements[allElements.length - 1];
  const nextElement = currentIndex < allElements.length - 1 ? allElements[currentIndex + 1] : allElements[0];

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('el', element.symbol);
    const textToShare = `${element.number}. ${element.name[language]} (${element.symbol}) - ChemLab`;

    if (navigator.share) {
      navigator.share({ title: textToShare, text: textToShare, url: url.toString() }).catch(() => {
        navigator.clipboard.writeText(url.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Temperature conversions K to °C
  const kelvinToCelsius = (k: number | null) => {
    if (k === null) return t('periodicTable.details.noData');
    return `${k} K (${(k - 273.15).toFixed(1)} °C)`;
  };

  const modalTabs = [
    { id: 'info', label: t('periodicTable.details.category'), icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'model', label: '3D Atom', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'history', label: t('periodicTable.details.uses'), icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window / Mobile Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl glass-panel bg-white/95 dark:bg-[#131C2E]/95 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-5 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Top Bar: Prev / Next, Share, Close */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectElement(prevElement)}
                title={`${prevElement.number}. ${prevElement.name[language]}`}
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                <span className="font-mono font-bold">{prevElement.symbol}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectElement(nextElement)}
                title={`${nextElement.number}. ${nextElement.name[language]}`}
              >
                <span className="font-mono font-bold">{nextElement.symbol}</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              >
                {copied ? t('periodicTable.details.linkCopied') : t('periodicTable.details.share')}
              </Button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Header with Symbol Tile & Multilingual Names */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-4">
              {/* Giant Symbol Block */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center border shadow-lg ${categoryVisual.bgLight} ${categoryVisual.bgDark} ${categoryVisual.borderLight} ${categoryVisual.borderDark}`}
              >
                <span className="text-xs font-mono font-bold opacity-75">{element.number}</span>
                <span className="text-3xl sm:text-4xl font-mono font-black tracking-tight">{element.symbol}</span>
                <span className="text-[10px] font-mono opacity-80">{element.atomicMass.toFixed(2)}</span>
              </div>

              {/* Names in 3 Languages */}
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryVisual.badgeBg} ${categoryVisual.badgeText}`}>
                    {categoryLabel}
                  </span>
                  <Badge variant="teal" size="sm">
                    {element.block.toUpperCase()}-block
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {element.name[language]}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>KK: <strong>{element.name.kk}</strong></span>
                  <span>•</span>
                  <span>RU: <strong>{element.name.ru}</strong></span>
                  <span>•</span>
                  <span>EN: <strong>{element.name.en}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex sm:flex-col gap-2 text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('periodicTable.details.period')}: <strong className="text-slate-900 dark:text-white font-mono">{element.period}</strong> | {t('periodicTable.details.group')}: <strong className="text-slate-900 dark:text-white font-mono">{element.group || '—'}</strong>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t('periodicTable.details.electronegativity')}: <strong className="text-teal-600 dark:text-teal-400 font-mono">{element.electronegativity ?? '—'}</strong>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mb-6">
            <Tabs
              tabs={modalTabs}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as 'info' | 'model' | 'history')}
            />
          </div>

          {/* Tab 1: Physical & Chemical Properties with SVG Shell Diagram */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Properties Grid */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium block mb-0.5">{t('periodicTable.details.state')}</span>
                    <strong className="text-sm text-slate-900 dark:text-white capitalize">{t(`periodicTable.states.${element.state}`)}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium block mb-0.5">{t('periodicTable.details.density')}</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{element.density ? `${element.density} g/cm³` : t('periodicTable.details.noData')}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium block mb-0.5">{t('periodicTable.details.meltingPoint')}</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{kelvinToCelsius(element.meltingPoint)}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <span className="text-slate-600 dark:text-slate-400 font-medium block mb-0.5">{t('periodicTable.details.boilingPoint')}</span>
                    <strong className="text-sm font-mono text-slate-900 dark:text-white">{kelvinToCelsius(element.boilingPoint)}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mb-1">{t('periodicTable.details.electronConfig')}</span>
                  <strong className="text-sm font-mono text-teal-600 dark:text-teal-400 tracking-wide">{element.electronConfiguration}</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mb-1">{t('periodicTable.details.oxidationStates')}</span>
                  <strong className="text-sm font-mono text-slate-900 dark:text-white">{element.oxidationStates || '—'}</strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mb-1">{t('periodicTable.details.description')}</span>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {element.description[language] || element.description.kk}
                  </p>
                </div>
              </div>

              {/* Electron Shell SVG Diagram */}
              <div className="md:col-span-5 p-4 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('periodicTable.details.shells')}
                </span>
                <ElectronShellDiagram element={element} size={210} />
              </div>
            </div>
          )}

          {/* Tab 2: 3D Atom Model (Bohr) with Drag Orbit Controls */}
          {activeTab === 'model' && (
            <div className="rounded-2xl bg-slate-950 p-4 border border-teal-500/30 text-center relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('periodicTable.details.model3DTitle')}</span>
                </span>
                <span>{t('periodicTable.details.dragToRotate')}</span>
              </div>

              <Suspense
                fallback={
                  <div className="h-[280px] flex items-center justify-center text-teal-400 text-xs">
                    Loading 3D atom model...
                  </div>
                }
              >
                <AtomModel3D element={element} />
              </Suspense>

              <div className="mt-2 text-[11px] text-slate-400">
                🔴 {element.number} Protons (p⁺) | 🔵 Neutrons (n⁰) | 🟢 {element.shells?.reduce((a, b) => a + b, 0)} Electrons (e⁻)
              </div>
            </div>
          )}

          {/* Tab 3: Industrial Uses and Discovery History */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <h4 className="text-sm font-bold text-teal-700 dark:text-teal-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('periodicTable.details.uses')}</span>
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {element.uses[language] || element.uses.kk}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mb-1">{t('periodicTable.details.discoveredBy')}</span>
                  <strong className="text-base text-slate-900 dark:text-white">
                    {element.discoveredBy[language] || element.discoveredBy.kk}
                  </strong>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mb-1">{t('periodicTable.details.discoveryYear')}</span>
                  <strong className="text-base font-mono text-teal-600 dark:text-teal-400">
                    {element.discoveryYear === 'Ancient' ? t('periodicTable.discovery.ancient') : element.discoveryYear}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
