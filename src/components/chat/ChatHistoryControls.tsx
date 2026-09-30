import React from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ChatHistoryControlsProps {
  onClearHistory: () => void;
  onNewChat: () => void;
  lang: 'kk' | 'ru' | 'en';
}

export const ChatHistoryControls: React.FC<ChatHistoryControlsProps> = ({
  onClearHistory,
  onNewChat,
  lang,
}) => {
  const t = {
    newChat: lang === 'kk' ? 'Жаңа диалог' : lang === 'ru' ? 'Новый диалог' : 'New Chat',
    clearHistory: lang === 'kk' ? 'Тазалау' : lang === 'ru' ? 'Очистить историю' : 'Clear',
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onNewChat}
        className="px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
        title={t.newChat}
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t.newChat}</span>
      </button>

      <button
        type="button"
        onClick={onClearHistory}
        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        title={t.clearHistory}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
