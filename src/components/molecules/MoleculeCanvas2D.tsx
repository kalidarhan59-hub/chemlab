import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid } from 'lucide-react';
import { MoleculeAtom, MoleculeBond, MoleculeGraph, ValenceWarning } from '../../types/molecule';
import elementsBasicData from '../../data/elementsBasic.json';
import { ElementData } from '../../types/molecule';

interface MoleculeCanvas2DProps {
  graph: MoleculeGraph;
  onChangeGraph: (newGraph: MoleculeGraph) => void;
  selectedElement: string;
  activeTool: 'select' | 'add_atom' | 'bond' | 'delete';
  valenceWarnings: ValenceWarning[];
  lang: 'kk' | 'ru' | 'en';
}

const elementsMap = new Map<string, ElementData>(
  (elementsBasicData as ElementData[]).map((e) => [e.symbol, e])
);

export const MoleculeCanvas2D: React.FC<MoleculeCanvas2DProps> = ({
  graph,
  onChangeGraph,
  selectedElement,
  activeTool,
  valenceWarnings,
  lang,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Viewport transformation: zoom & pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [snapToGrid, setSnapToGrid] = useState(false);

  // Interaction states
  const [draggedAtomId, setDraggedAtomId] = useState<string | null>(null);
  const [bondStartAtomId, setBondStartAtomId] = useState<string | null>(null);
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Convert screen coordinates to SVG canvas space coordinates
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rawX = clientX - rect.left;
      const rawY = clientY - rect.top;

      const centeredX = rawX - rect.width / 2;
      const centeredY = rawY - rect.height / 2;

      let x = (centeredX - pan.x) / zoom;
      let y = (centeredY - pan.y) / zoom;

      if (snapToGrid) {
        x = Math.round(x / 20) * 20;
        y = Math.round(y / 20) * 20;
      }

      return { x: Math.round(x), y: Math.round(y) };
    },
    [pan, zoom, snapToGrid]
  );

  // Canvas click to add atom
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'add_atom') {
      const coords = getCanvasCoords(e);
      const newId = `${selectedElement}_${Date.now()}`;
      const newAtom: MoleculeAtom = {
        id: newId,
        element: selectedElement,
        x: coords.x,
        y: coords.y,
        z: 0,
      };

      onChangeGraph({
        atoms: [...graph.atoms, newAtom],
        bonds: graph.bonds,
      });
      setSelectedAtomId(newId);
    } else if (activeTool === 'select') {
      setSelectedAtomId(null);
    }
  };

  // Atom interaction
  const handleAtomMouseDown = (e: React.MouseEvent, atom: MoleculeAtom) => {
    e.stopPropagation();

    if (activeTool === 'delete') {
      // Delete atom and all attached bonds
      onChangeGraph({
        atoms: graph.atoms.filter((a) => a.id !== atom.id),
        bonds: graph.bonds.filter((b) => b.a !== atom.id && b.b !== atom.id),
      });
      return;
    }

    if (activeTool === 'bond') {
      setBondStartAtomId(atom.id);
      setDragCurrentPos({ x: atom.x, y: atom.y });
      return;
    }

    // Default select / move
    setSelectedAtomId(atom.id);
    setDraggedAtomId(atom.id);
  };

  // Bond click: Cycle order: 1 -> 2 -> 3 -> delete
  const handleBondClick = (e: React.MouseEvent, bondIndex: number) => {
    e.stopPropagation();

    if (activeTool === 'delete') {
      const newBonds = graph.bonds.filter((_, idx) => idx !== bondIndex);
      onChangeGraph({ atoms: graph.atoms, bonds: newBonds });
      return;
    }

    const currentBond = graph.bonds[bondIndex];
    if (currentBond.order === 1) {
      const updated = graph.bonds.map((b, i) => (i === bondIndex ? { ...b, order: 2 as const } : b));
      onChangeGraph({ atoms: graph.atoms, bonds: updated });
    } else if (currentBond.order === 2) {
      const updated = graph.bonds.map((b, i) => (i === bondIndex ? { ...b, order: 3 as const } : b));
      onChangeGraph({ atoms: graph.atoms, bonds: updated });
    } else {
      // order 3 -> cycle delete
      const filtered = graph.bonds.filter((_, i) => i !== bondIndex);
      onChangeGraph({ atoms: graph.atoms, bonds: filtered });
    }
  };

  // Global mouse move / mouse up handling on window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedAtomId) {
        const coords = getCanvasCoords(e);
        const updated = graph.atoms.map((a) =>
          a.id === draggedAtomId ? { ...a, x: coords.x, y: coords.y } : a
        );
        onChangeGraph({ atoms: updated, bonds: graph.bonds });
      } else if (bondStartAtomId) {
        const coords = getCanvasCoords(e);
        setDragCurrentPos(coords);
      } else if (isPanning) {
        setPan((prev) => ({
          x: prev.x + (e.clientX - panStart.x),
          y: prev.y + (e.clientY - panStart.y),
        }));
        setPanStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (bondStartAtomId) {
        // Check if cursor ended over another atom
        const coords = getCanvasCoords(e);
        const target = graph.atoms.find(
          (a) => a.id !== bondStartAtomId && Math.hypot(a.x - coords.x, a.y - coords.y) < 26
        );

        if (target) {
          // Check if bond already exists
          const existingIndex = graph.bonds.findIndex(
            (b) =>
              (b.a === bondStartAtomId && b.b === target.id) ||
              (b.a === target.id && b.b === bondStartAtomId)
          );

          if (existingIndex !== -1) {
            // Cycle bond order
            const current = graph.bonds[existingIndex];
            const nextOrder = current.order === 1 ? 2 : current.order === 2 ? 3 : 1;
            const updated = graph.bonds.map((b, i) =>
              i === existingIndex ? { ...b, order: nextOrder as 1 | 2 | 3 } : b
            );
            onChangeGraph({ atoms: graph.atoms, bonds: updated });
          } else {
            // Add new bond
            onChangeGraph({
              atoms: graph.atoms,
              bonds: [
                ...graph.bonds,
                { a: bondStartAtomId, b: target.id, order: 1 },
              ],
            });
          }
        }
        setBondStartAtomId(null);
        setDragCurrentPos(null);
      }

      setDraggedAtomId(null);
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedAtomId, bondStartAtomId, isPanning, panStart, getCanvasCoords, graph, onChangeGraph]);

  // Keyboard shortcut: Delete or Backspace to delete selected atom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedAtomId) {
        onChangeGraph({
          atoms: graph.atoms.filter((a) => a.id !== selectedAtomId),
          bonds: graph.bonds.filter((b) => b.a !== selectedAtomId && b.b !== selectedAtomId),
        });
        setSelectedAtomId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAtomId, graph, onChangeGraph]);

  const atomMap = new Map(graph.atoms.map((a) => [a.id, a]));

  const renderBondLines = (bond: MoleculeBond, index: number) => {
    const a1 = atomMap.get(bond.a);
    const a2 = atomMap.get(bond.b);
    if (!a1 || !a2) return null;

    const dx = a2.x - a1.x;
    const dy = a2.y - a1.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist;
    const ny = dx / dist;

    const offset = 4;

    let lines: React.ReactElement[] = [];

    if (bond.order === 1) {
      lines.push(
        <line
          key={`b1-${index}`}
          x1={a1.x}
          y1={a1.y}
          x2={a2.x}
          y2={a2.y}
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500 transition-colors"
        />
      );
    } else if (bond.order === 2) {
      lines.push(
        <line
          key={`b2_1-${index}`}
          x1={a1.x + nx * offset}
          y1={a1.y + ny * offset}
          x2={a2.x + nx * offset}
          y2={a2.y + ny * offset}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500 transition-colors"
        />,
        <line
          key={`b2_2-${index}`}
          x1={a1.x - nx * offset}
          y1={a1.y - ny * offset}
          x2={a2.x - nx * offset}
          y2={a2.y - ny * offset}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500 transition-colors"
        />
      );
    } else {
      lines.push(
        <line
          key={`b3_1-${index}`}
          x1={a1.x}
          y1={a1.y}
          x2={a2.x}
          y2={a2.y}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500"
        />,
        <line
          key={`b3_2-${index}`}
          x1={a1.x + nx * (offset * 1.6)}
          y1={a1.y + ny * (offset * 1.6)}
          x2={a2.x + nx * (offset * 1.6)}
          y2={a2.y + ny * (offset * 1.6)}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500"
        />,
        <line
          key={`b3_3-${index}`}
          x1={a1.x - nx * (offset * 1.6)}
          y1={a1.y - ny * (offset * 1.6)}
          x2={a2.x - nx * (offset * 1.6)}
          y2={a2.y - ny * (offset * 1.6)}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-500"
        />
      );
    }

    return (
      <g
        key={`bond-group-${index}`}
        className="cursor-pointer group"
        onClick={(e) => handleBondClick(e, index)}
      >
        {/* Invisible thick stroke for easier clicking */}
        <line
          x1={a1.x}
          y1={a1.y}
          x2={a2.x}
          y2={a2.y}
          stroke="transparent"
          strokeWidth="16"
          className="hover:stroke-teal-400/20"
        />
        {lines}
      </g>
    );
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 shadow-2xl flex flex-col select-none">
      {/* Canvas Top Bar Controls */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
          title="Zoom In"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
          title="Zoom Out"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset View"
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-teal-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={() => setSnapToGrid((s) => !s)}
          title="Snap to Grid"
          className={`p-1.5 rounded-lg transition-colors ${
            snapToGrid
              ? 'text-teal-500 bg-teal-50 dark:bg-teal-950/40'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>

      {/* Mode hint badge */}
      <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-md text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span>
          {activeTool === 'add_atom' && (lang === 'kk' ? 'Атом қосу: Бос жерді басыңыз' : lang === 'ru' ? 'Кликните на холст для добавления атома' : 'Click to place atom')}
          {activeTool === 'bond' && (lang === 'kk' ? 'Байланыс: Бір атомнан екіншісіне тартыңыз' : lang === 'ru' ? 'Протяните линию между атомами' : 'Drag line between atoms')}
          {activeTool === 'select' && (lang === 'kk' ? 'Таңдау: Атомды сүйреңіз немесе байланысты басыңыз' : lang === 'ru' ? 'Перетаскивайте атомы или кликайте по связям' : 'Drag atoms or click bonds')}
          {activeTool === 'delete' && (lang === 'kk' ? 'Өшіру: Атомды немесе байланысты басыңыз' : lang === 'ru' ? 'Кликните по атому или связи для удаления' : 'Click atom or bond to delete')}
        </span>
      </div>

      {/* SVG Canvas Area */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseDown={(e) => {
          if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
            setIsPanning(true);
            setPanStart({ x: e.clientX, y: e.clientY });
          }
        }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="grid" width={24} height={24} patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.8" className="fill-slate-700/40" />
          </pattern>
        </defs>

        {/* Background rect for panning capture */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Viewport transformation group */}
        <g
          transform={`translate(${pan.x + (svgRef.current?.clientWidth || 500) / 2}, ${
            pan.y + (svgRef.current?.clientHeight || 400) / 2
          }) scale(${zoom})`}
        >
          {/* Bonds */}
          {graph.bonds.map((bond, idx) => renderBondLines(bond, idx))}

          {/* Interactive line currently being dragged for new bond */}
          {bondStartAtomId && dragCurrentPos && (
            <line
              x1={atomMap.get(bondStartAtomId)?.x || 0}
              y1={atomMap.get(bondStartAtomId)?.y || 0}
              x2={dragCurrentPos.x}
              y2={dragCurrentPos.y}
              stroke="#14B8A6"
              strokeWidth="3"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Atoms */}
          {graph.atoms.map((atom) => {
            const el = elementsMap.get(atom.element);
            const color = el?.cpkColor || '#64748B';
            const isSelected = selectedAtomId === atom.id;
            const warning = valenceWarnings.find((w) => w.atomId === atom.id);

            return (
              <g
                key={atom.id}
                transform={`translate(${atom.x}, ${atom.y})`}
                className="cursor-pointer group"
                onMouseDown={(e) => handleAtomMouseDown(e, atom)}
              >
                {/* Valence violation ring (red glow) */}
                {warning?.isExceeded && (
                  <circle
                    r="25"
                    className="fill-red-500/20 stroke-red-500 animate-pulse"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Selection halo */}
                {isSelected && (
                  <circle
                    r="24"
                    className="fill-teal-500/25 stroke-teal-400"
                    strokeWidth="2"
                  />
                )}

                {/* Main Atom sphere */}
                <circle
                  r="18"
                  fill={color}
                  className="stroke-white/30 dark:stroke-slate-900/40 shadow-lg transition-transform group-hover:scale-110 active:scale-95"
                  strokeWidth="2"
                />

                {/* Specular 3D highlight */}
                <ellipse
                  cx="-5"
                  cy="-5"
                  rx="6"
                  ry="4"
                  fill="white"
                  opacity="0.35"
                />

                {/* Element text symbol */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`font-mono font-bold text-xs select-none pointer-events-none ${
                    ['H', 'Na', 'K', 'Li', 'Ca'].includes(atom.element)
                      ? 'fill-slate-900'
                      : 'fill-white'
                  }`}
                >
                  {atom.element}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
