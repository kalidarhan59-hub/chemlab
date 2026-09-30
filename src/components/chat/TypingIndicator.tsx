import React from 'react';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  lang: 'kk' | 'ru' | 'en';
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ lang }) => {
  const label =
    lang === 'kk'
      ? 'ИИ-көмекші жауап дайындауда...'
      : lang === 'ru'
      ? 'ИИ-помощник печатает...'
      : 'AI Assistant is thinking...';

  return (
    <div className="flex gap-3 items-center animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
        <Bot className="w-4 h-4 animate-bounce" />
      </div>
      <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: '200ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
};
