import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table2, ListFilter, Trophy, Sparkles } from 'lucide-react';
import elementsData from '../data/elements.json';
import { ChemicalElement, ElementCategory, ElementState, FilterOptions, HeatmapProperty, TableViewMode } from '../types/element';
import { useLanguage } from '../hooks/useLanguage';
import { PeriodicTable } from '../components/periodic/PeriodicTable';
import { ElementListView } from '../components/periodic/ElementListView';
import { ElementQuiz } from '../components/periodic/ElementQuiz';
import { ElementModal } from '../components/periodic/ElementModal';
import { SearchBar } from '../components/periodic/SearchBar';
import { TemperatureSlider } from '../components/periodic/TemperatureSlider';
import { HeatmapControl } from '../components/periodic/HeatmapControl';
import { Legend } from '../components/periodic/Legend';
import { Filters } from '../components/periodic/Filters';
import { Tabs } from '../components/ui/Tabs';
import { PageTransition } from '../components/ui/PageTransition';
import { SEO } from '../components/ui/SEO';
import { filterElements } from '../utils/elementHelpers';

const INITIAL_FILTERS: FilterOptions = {
  search: '',
  category: 'all',
  state: 'all',
  block: 'all',
  temperature: 298.15, // Room temp 25 °C
  heatmap: 'none',
  discoveryYearRange: [-5000, 2026],
};

const ALL_ELEMENTS = elementsData as unknown as ChemicalElement[];

export const PeriodicTablePage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const allElements = ALL_ELEMENTS;

  // Active view mode: table, list, or quiz
  const [viewMode, setViewMode] = useState<TableViewMode>(() => {
    const v = searchParams.get('view');
    return v === 'list' || v === 'quiz' ? v : 'table';
  });

  // State Filters
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const heatParam = searchParams.get('heat') as HeatmapProperty;
    const validHeat = heatParam && ['electronegativity', 'atomicMass', 'density', 'meltingPoint', 'boilingPoint'].includes(heatParam)
      ? heatParam
      : 'none';
    return {
      ...INITIAL_FILTERS,
      heatmap: validHeat,
    };
  });

  // Selected element for detail modal
  const [selectedElement, setSelectedElement] = useState<ChemicalElement | null>(null);

  // Selected element specifically for the Quiz guess
  const [quizGuessElement, setQuizGuessElement] = useState<ChemicalElement | null>(null);

  // Sync element from URL parameter (?el=Fe or ?el=26)
  useEffect(() => {
    const elParam = searchParams.get('el');
    if (elParam) {
      const found = ALL_ELEMENTS.find(
        (e) =>
          e.symbol.toLowerCase() === elParam.toLowerCase() ||
          e.number.toString() === elParam ||
          e.name.en.toLowerCase() === elParam.toLowerCase()
      );
      if (found) {
        setSelectedElement((prev) => (prev?.symbol === found.symbol ? prev : found));
      }
    }
  }, [searchParams]);

  // Handle element selection (opens modal in table/list mode, or answers in quiz mode)
  const handleElementClick = useCallback(
    (el: ChemicalElement) => {
      if (viewMode === 'quiz') {
        setQuizGuessElement(el);
      } else {
        setSelectedElement(el);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('el', el.symbol);
        setSearchParams(newParams, { replace: true });
      }
    },
    [viewMode, searchParams, setSearchParams]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedElement(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('el');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Filtered elements matching current criteria
  const filteredElements = useMemo(() => {
    return filterElements(allElements, filters, language);
  }, [allElements, filters, language]);

  // Set of matching element numbers for highlighting on the table grid
  const searchFilterMatches = useMemo(() => {
    return new Set(filteredElements.map((e) => e.number));
  }, [filteredElements]);

  const isSearchActive = Boolean(
    filters.search.trim() ||
      filters.state !== 'all' ||
      filters.block !== 'all' ||
      filters.discoveryYearRange[1] < 2026
  );

  // View tabs
  const viewTabs = [
    { id: 'table', label: t('periodicTable.views.table'), icon: <Table2 className="w-4 h-4" /> },
    { id: 'list', label: t('periodicTable.views.list'), icon: <ListFilter className="w-4 h-4" /> },
    { id: 'quiz', label: t('periodicTable.views.quiz'), icon: <Trophy className="w-4 h-4" /> },
  ];

  const handleTabChange = (tabId: string) => {
    const mode = tabId as TableViewMode;
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams);
    if (mode === 'table') {
      newParams.delete('view');
    } else {
      newParams.set('view', mode);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleHeatmapChange = (heat: HeatmapProperty) => {
    setFilters((prev) => ({ ...prev, heatmap: heat }));
    const newParams = new URLSearchParams(searchParams);
    if (heat === 'none') {
      newParams.delete('heat');
    } else {
      newParams.set('heat', heat);
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <PageTransition>
      <SEO
        title={t('periodicTable.title')}
        description={t('periodicTable.subtitle')}
        path="periodic-table"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header: Title, Subtitle, and View Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-2">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>118 IUPAC Elements</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('periodicTable.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {t('periodicTable.subtitle')}
            </p>
          </div>

          {/* Mode Switcher: Table | List | Quiz */}
          <div className="shrink-0">
            <Tabs tabs={viewTabs} activeTab={viewMode} onChange={handleTabChange} />
          </div>
        </div>

        {/* Quiz Banner if in Quiz mode */}
        {viewMode === 'quiz' && (
          <ElementQuiz
            elements={allElements}
            language={language}
            onCellClickTarget={handleElementClick}
            selectedElementForQuiz={quizGuessElement}
          />
        )}

        {/* Control Toolbar: Search bar, Temperature Simulator, Heatmap, Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Search Bar */}
          <div className="md:col-span-4">
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
            />
          </div>

          {/* Temperature Slider Simulator */}
          <div className="md:col-span-4">
            <TemperatureSlider
              temperatureK={filters.temperature}
              onChange={(temperature) => setFilters((prev) => ({ ...prev, temperature }))}
              elements={allElements}
            />
          </div>

          {/* Heatmap Mode Controller */}
          <div className="md:col-span-4">
            <HeatmapControl
              currentProperty={filters.heatmap}
              onChange={handleHeatmapChange}
            />
          </div>
        </div>

        {/* Category Legend & Block Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <Legend
              activeCategory={filters.category}
              onSelectCategory={(category: ElementCategory | 'all') =>
                setFilters((prev) => ({ ...prev, category }))
              }
            />
          </div>

          <div className="lg:col-span-5">
            <Filters
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(INITIAL_FILTERS)}
            />
          </div>
        </div>

        {/* Main Content Area: Table View or List View */}
        {viewMode === 'table' || viewMode === 'quiz' ? (
          <PeriodicTable
            elements={allElements}
            language={language}
            onSelectElement={handleElementClick}
            selectedElement={selectedElement}
            activeCategory={filters.category}
            temperatureK={filters.temperature}
            heatmapProperty={filters.heatmap}
            searchFilterMatches={searchFilterMatches}
            isSearchActive={isSearchActive}
          />
        ) : (
          <ElementListView
            elements={filteredElements}
            language={language}
            onSelectElement={handleElementClick}
          />
        )}

        {/* Element Detail Modal / Bottom Drawer */}
        <ElementModal
          element={selectedElement}
          onClose={handleCloseModal}
          onSelectElement={setSelectedElement}
          allElements={allElements}
          language={language}
        />
      </div>
    </PageTransition>
  );
};

export default PeriodicTablePage;
