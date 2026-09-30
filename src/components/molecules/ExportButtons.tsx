import React, { useState } from 'react';
import { Download, Copy, Share2, Check } from 'lucide-react';
import { MoleculeGraph } from '../../types/molecule';
import { generateHillFormula, formatFormulaSubscripts } from '../../utils/mol/formula';

interface ExportButtonsProps {
  graph: MoleculeGraph;
  onGet3DSnapshot?: () => string | null;
  lang: 'kk' | 'ru' | 'en';
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ graph, onGet3DSnapshot, lang }) => {
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formula = generateHillFormula(graph);
  const formatted = formatFormulaSubscripts(formula);

  const handleCopyFormula = async () => {
    if (!formula) return;
    try {
      await navigator.clipboard.writeText(formatted || formula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareLink = async () => {
    try {
      const encoded = encodeURIComponent(JSON.stringify(graph));
      const url = `${window.location.origin}${window.location.pathname}#mol=${encoded}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleExportPNG = () => {
    // If 3D snapshot available, download it
    if (onGet3DSnapshot) {
      const dataUrl = onGet3DSnapshot();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${formula || 'molecule'}-3D.png`;
        link.href = dataUrl;
        link.click();
        return;
      }
    }

    // Otherwise export from SVG
    const svgEl = document.querySelector('svg.cursor-crosshair') as SVGSVGElement | null;
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = svgEl.clientWidth * 2 || 1200;
    canvas.height = svgEl.clientHeight * 2 || 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = `${formula || 'molecule'}-2D.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  const t = {
    exportPng: lang === 'kk' ? 'PNG жүктеу' : lang === 'ru' ? 'Скачать PNG' : 'Save PNG',
    copyFormula: lang === 'kk' ? 'Формуланы көшіру' : lang === 'ru' ? 'Копировать формулу' : 'Copy Formula',
    share: lang === 'kk' ? 'Бөлісу сілтемесі' : lang === 'ru' ? 'Поделиться ссылкой' : 'Share Link',
    copied: lang === 'kk' ? 'Көшірілді!' : lang === 'ru' ? 'Скопировано!' : 'Copied!',
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopyFormula}
        disabled={!formula}
        className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all flex items-center gap-1.5"
      >
        {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copiedFormula ? t.copied : t.copyFormula}</span>
      </button>

      <button
        type="button"
        onClick={handleShareLink}
        disabled={graph.atoms.length === 0}
        className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-all flex items-center gap-1.5"
      >
        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
        <span>{copiedLink ? t.copied : t.share}</span>
      </button>

      <button
        type="button"
        onClick={handleExportPNG}
        disabled={graph.atoms.length === 0}
        className="px-3 py-1.5 rounded-xl text-xs font-medium bg-teal-500 hover:bg-teal-600 text-white shadow-sm disabled:opacity-40 transition-all flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t.exportPng}</span>
      </button>
    </div>
  );
};
