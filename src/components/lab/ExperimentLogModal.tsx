import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Trash2, Copy, Check, Sparkles, Clock, Share2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { LabReaction } from '../../utils/lab/reactionEngine';

export interface LogEntry {
  id: string;
  timestamp: number;
  reagents: string[];
  reaction: LabReaction;
}

interface ExperimentLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const ExperimentLogModal: React.FC<ExperimentLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'kk') as 'kk' | 'ru' | 'en';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEntry = async (entry: LogEntry) => {
    try {
      const text = `ChemLab Тәжірибе: [${new Date(entry.timestamp).toLocaleTimeString()}]\nРеагенттер: ${entry.reagents.join(' + ')}\nТеңдеу: ${entry.reaction.equations.molecular}\nТүсініктеме: ${entry.reaction.explanation[currentLang]}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-slate-900 dark:text-white font-bold">
            {t('lab.log.modalTitle', 'Тәжірибелер журналы')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono ml-2 border border-slate-200 dark:border-slate-700">
            {logs.length}
          </span>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('lab.log.empty', 'Журналда әлі тәжірибелер тіркелмеген')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('lab.log.emptyDesc', 'Сынауыққа реактивтер қосып, реакция жүргізген кезде нәтиже осында сақталады.')}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span>{t('lab.log.totalCount', 'Жалпы тіркелген тәжірибелер')}: <strong className="text-slate-900 dark:text-white font-mono">{logs.length}</strong></span>
              <button
                type="button"
                onClick={onClearLogs}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('lab.log.clearAll', 'Журналды тазарту')}</span>
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {logs.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/20 text-[10px]">
                        {t(`lab.reactionTypes.${entry.reaction.type}`, entry.reaction.type)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyEntry(entry)}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Көшіру"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Molecular equation */}
                  <div className="font-mono text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    {entry.reaction.equations.molecular}
                  </div>

                  {/* Explanation */}
                  <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {entry.reaction.explanation[currentLang] || entry.reaction.explanation.kk}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
