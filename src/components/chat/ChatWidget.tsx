import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { Message, ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHistoryControls } from './ChatHistoryControls';
import { TypingIndicator } from './TypingIndicator';

interface ChatWidgetProps {
  lang: 'kk' | 'ru' | 'en';
  isOpen: boolean;
  onToggle: (open?: boolean) => void;
  pageContext?: string;
}

const CHAT_STORAGE_KEY = 'chemlab:ai-chat';

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  lang,
  isOpen,
  onToggle,
  pageContext,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeContext, setActiveContext] = useState<string | undefined>(pageContext);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Synchronize pageContext when passed in without triggering unnecessary re-renders
  useEffect(() => {
    if (pageContext && pageContext !== activeContext) {
      setActiveContext(pageContext);
    }
  }, [pageContext, activeContext]);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Initial greeting if empty
  const getInitialGreeting = (): string => {
    if (lang === 'kk') {
      return 'Сәлем! Мен ChemLab ИИ-көмекшісімін. Химия, сабақтар, ҰБТ дайындығы немесе кез келген басқа сұрағыңыз бойынша көмектесуге дайынмын!';
    }
    if (lang === 'ru') {
      return 'Привет! Я ИИ-помощник ChemLab. Готов помочь с химией, решением задач, подготовкой к экзаменам или отвечу на любой другой вопрос!';
    }
    return 'Hello! I am the ChemLab AI Tutor. I can help with chemistry concepts, problem solving, exam prep, or any general questions!';
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemContext: activeContext,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || (lang === 'kk' ? 'Жауап алу мүмкін болмады.' : 'Не удалось получить ответ.');

      const assistantMsg: Message = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User clicked stop
        return;
      }
      console.error('AI Chat Error:', err);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content:
          lang === 'kk'
            ? '⚠️ Сервермен байланыс үзілді немесе лимит асты. Өтініш, кейінірек қайталап көріңіз.'
            : lang === 'ru'
            ? '⚠️ Ошибка подключения к серверу или исчерпан лимит. Пожалуйста, повторите попытку позже.'
            : '⚠️ Server connection error or rate limit reached. Please try again later.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2 || isLoading) return;
    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      // Remove last assistant reply and resend
      setMessages((prev) => prev.slice(0, -1));
      handleSend(lastUserMsg.content);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setActiveContext(undefined);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveContext(undefined);
  };

  const t = {
    title: lang === 'kk' ? 'ChemLab ИИ-көмекшісі' : lang === 'ru' ? 'ИИ-помощник ChemLab' : 'ChemLab AI Tutor',
    subtitle: lang === 'kk' ? 'Барлық сұраққа жауап береді' : lang === 'ru' ? 'Отвечает на любые вопросы' : 'Answers all questions',
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => onToggle(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-teal-500 via-purple-600 to-indigo-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group glow-teal"
          title={t.title}
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline font-bold text-xs pr-1">{t.title}</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto z-50 w-full sm:w-[420px] h-full sm:h-[620px] bg-slate-950/95 sm:bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header Bar */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>{t.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-teal-400 font-medium">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ChatHistoryControls
                onClearHistory={handleClearHistory}
                onNewChat={handleNewChat}
                lang={lang}
              />
              <button
                type="button"
                onClick={() => onToggle(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Context Banner if opened from specific topic */}
          {activeContext && (
            <div className="px-4 py-2 bg-teal-500/10 border-b border-teal-500/20 text-xs text-teal-300 flex items-center justify-between">
              <span className="truncate pr-2">📌 Контекст: "{activeContext}"</span>
              <button
                type="button"
                onClick={() => setActiveContext(undefined)}
                className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 mx-auto flex items-center justify-center shadow-inner">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto shadow-md">
                  {getInitialGreeting()}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  lang={lang}
                  onRegenerate={handleRegenerate}
                  isLastAssistant={idx === messages.length - 1 && msg.role === 'assistant'}
                />
              ))
            )}

            {isLoading && <TypingIndicator lang={lang} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput
            input={input}
            onChangeInput={setInput}
            onSend={() => handleSend()}
            isLoading={isLoading}
            onStop={handleStop}
            lang={lang}
          />
        </div>
      )}
    </>
  );
};
