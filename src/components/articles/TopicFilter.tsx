import React from 'react';
import { ArticleTopic } from '../../types/article';

interface TopicFilterProps {
  selectedTopic: ArticleTopic | 'all';
  onSelectTopic: (topic: ArticleTopic | 'all') => void;
  lang: 'kk' | 'ru' | 'en';
}

const TOPICS: Array<{ id: ArticleTopic | 'all'; label: { kk: string; ru: string; en: string }; emoji: string }> = [
  { id: 'all', label: { kk: 'Барлық тақырыптар', ru: 'Все темы', en: 'All Topics' }, emoji: '✨' },
  { id: 'kitchen', label: { kk: 'Асхана', ru: 'Кухня', en: 'Kitchen' }, emoji: '🍳' },
  { id: 'home', label: { kk: 'Үй', ru: 'Дом', en: 'Home' }, emoji: '🏠' },
  { id: 'nature', label: { kk: 'Табиғат', ru: 'Природа', en: 'Nature' }, emoji: '🌿' },
  { id: 'health', label: { kk: 'Денсаулық', ru: 'Здоровье', en: 'Health' }, emoji: '🩺' },
  { id: 'industry', label: { kk: 'Өнеркәсіп', ru: 'Промышленность', en: 'Industry' }, emoji: '🏭' },
  { id: 'kazakhstan', label: { kk: 'Қазақстан', ru: 'Казахстан', en: 'Kazakhstan' }, emoji: '🇰🇿' },
];

export const TopicFilter: React.FC<TopicFilterProps> = ({
  selectedTopic,
  onSelectTopic,
  lang,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TOPICS.map((topic) => {
        const isSelected = selectedTopic === topic.id;
        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 ring-2 ring-teal-500/40'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400'
            }`}
          >
            <span>{topic.emoji}</span>
            <span>{topic.label[lang] || topic.label.kk}</span>
          </button>
        );
      })}
    </div>
  );
};
