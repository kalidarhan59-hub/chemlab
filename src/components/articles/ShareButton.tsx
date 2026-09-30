import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  lang: 'kk' | 'ru' | 'en';
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, lang }) => {
  const [copied, setCopied] = useState(false);

  const t = {
    share: lang === 'kk' ? 'Бөлісу' : lang === 'ru' ? 'Поделиться' : 'Share',
    copied: lang === 'kk' ? 'Сілтеме көшірілді!' : lang === 'ru' ? 'Ссылка скопирована!' : 'Link copied!',
  };

  const handleShare = async () => {
    const shareData = {
      title,
      text: `${title} - ChemLab`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
    >
      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
      <span>{copied ? t.copied : t.share}</span>
    </button>
  );
};
