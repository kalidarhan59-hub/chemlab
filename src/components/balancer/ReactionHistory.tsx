import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, Star, Trash2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { formatToUnicode } from '../../utils/balancer/chemicalFormula';

export interface HistoryItem {
  id: string;
  equation: string;
  balancedUnicode: string;
  timestamp: number;
  isStarred?: boolean;
}

interface ReactionHistoryProps {
  history: HistoryItem[];
  onSelect: (equation: string) => void;
  onToggleStar: (id: string) => void;
  onClear: () => void;
}

export const ReactionHistory: React.FC<ReactionHistoryProps> = ({
  history,
  onSelect,
  onToggleStar,
  onClear,
}) => {
  const { t } = useTranslation();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center text-slate-600 dark:text-slate-400 text-xs">
        <History className="w-6 h-6 mx-auto mb-2 opacity-50 text-slate-400" />
        <p>{t('balancer.history.empty', 'Теңестірілген реакциялар тарихы әзірге бос')}</p>
      </div>
    );
  }

  const handleCopy = async (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 backdrop-blur-md space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            {t('balancer.history.title', 'Соңғы теңдеулер тарихы')}
          </h4>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-mono">
            {history.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('balancer.history.clear', 'Тазарту')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.equation)}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 hover:border-teal-500/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-semibold group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-1">
                {item.balancedUnicode || formatToUnicode(item.equation)}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleCopy(item.id, item.balancedUnicode || item.equation, e)}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  title="Copy"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(item.id);
                  }}
                  className={`p-1 rounded ${
                    item.isStarred ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                  title="Favorite"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400">
              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              <span className="text-teal-700 dark:text-teal-400 font-medium flex items-center gap-0.5 group-hover:underline">
                {t('balancer.history.rebalance', 'Қайта ашу')} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
