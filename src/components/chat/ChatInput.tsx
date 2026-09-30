import React from 'react';
import { Send, Square } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onChangeInput: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop?: () => void;
  lang: 'kk' | 'ru' | 'en';
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onChangeInput,
  onSend,
  isLoading,
  onStop,
  lang,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const placeholder =
    lang === 'kk'
      ? 'Химия немесе кез келген тақырыпта сұрақ қойыңыз...'
      : lang === 'ru'
      ? 'Задайте вопрос по химии или на любую другую тему...'
      : 'Ask any chemistry or general question...';

  return (
    <div className="p-3 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="p-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            title={lang === 'kk' ? 'Тоқтату' : lang === 'ru' ? 'Остановить' : 'Stop'}
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 hover:brightness-110 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            title={lang === 'kk' ? 'Жіберу' : lang === 'ru' ? 'Отправить' : 'Send'}
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
