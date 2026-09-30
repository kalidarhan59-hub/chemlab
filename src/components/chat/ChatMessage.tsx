import React, { useState } from 'react';
import { Bot, User, Copy, Check, RotateCcw } from 'lucide-react';
import { FormulaText } from '../ui/FormulaText';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatMessageProps {
  message: Message;
  lang: 'kk' | 'ru' | 'en';
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  lang,
  onRegenerate,
  isLastAssistant = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start animate-fade-in`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
          isUser
            ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white'
            : 'bg-gradient-to-tr from-teal-500 to-emerald-600 text-white shadow-md'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble */}
      <div className={`group relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
        isUser
          ? 'bg-teal-500 text-white rounded-tr-none shadow-md'
          : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none shadow-lg'
      }`}>
        <div className="whitespace-pre-wrap font-sans">
          <FormulaText text={message.content} />
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 opacity-80 group-hover:opacity-100 transition-opacity">
            {onRegenerate && isLastAssistant && (
              <button
                type="button"
                onClick={onRegenerate}
                className="p-1 rounded text-slate-400 hover:text-teal-500 transition-colors cursor-pointer"
                title={lang === 'kk' ? 'Қайтару' : lang === 'ru' ? 'Повторить ответ' : 'Regenerate'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-teal-500 transition-colors cursor-pointer"
              title={lang === 'kk' ? 'Көшіру' : lang === 'ru' ? 'Копировать' : 'Copy'}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
