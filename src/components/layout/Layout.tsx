import React, { useState, useCallback, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChatWidget } from '../chat/ChatWidget';
import { useLanguage } from '../../hooks/useLanguage';

export const Layout: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['kk', 'ru', 'en'].includes(language) ? language : 'kk') as 'kk' | 'ru' | 'en';

  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  const openAiChatWithContext = useCallback((context?: string) => {
    if (context) setChatContext(context);
    setIsAiChatOpen(true);
  }, []);

  const outletContext = useMemo(() => ({ openAiChatWithContext }), [openAiChatWithContext]);

  const handleToggle = useCallback((open?: boolean) => {
    setIsAiChatOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-lab-grid relative selection:bg-teal-500/25 selection:text-teal-300">
      {/* Background ambient lighting orbs */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Persistent Navigation Header */}
      <Header />

      {/* Main Outlet */}
      <main className="flex-1 pt-24 pb-12">
        <Outlet context={outletContext} />
      </main>

      {/* Global AI Assistant Floating Widget */}
      <ChatWidget
        lang={lang}
        isOpen={isAiChatOpen}
        onToggle={handleToggle}
        pageContext={chatContext}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
