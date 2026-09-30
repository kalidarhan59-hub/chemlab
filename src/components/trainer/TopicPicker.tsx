import React from 'react';
import { TopicId } from '../../types/trainer';

interface TopicPickerProps {
  selectedTopic: TopicId | 'all';
  onSelectTopic: (topic: TopicId | 'all') => void;
  lang: 'kk' | 'ru' | 'en';
}

export const TOPICS_META: { id: TopicId; name: { kk: string; ru: string; en: string } }[] = [
  { id: 'atomic_structure', name: { kk: 'Атом құрылысы', ru: 'Строение атома', en: 'Atomic structure' } },
  { id: 'periodic_law', name: { kk: 'Периодтық заң', ru: 'Периодический закон', en: 'Periodic law' } },
  { id: 'chemical_bond', name: { kk: 'Химиялық байланыс', ru: 'Химическая связь', en: 'Chemical bonding' } },
  { id: 'inorganic_classes', name: { kk: 'Бейорганикалық кластар', ru: 'Классы неорганических в-в', en: 'Inorganic classes' } },
  { id: 'reactions', name: { kk: 'Химиялық реакциялар', ru: 'Химические реакции', en: 'Reactions & kinetics' } },
  { id: 'solutions', name: { kk: 'Ерітінділер мен диссоциация', ru: 'Растворы и диссоциация', en: 'Solutions & ions' } },
  { id: 'redox', name: { kk: 'Тотығу-тотықсыздану (ТТР/ОВР)', ru: 'ОВР реакции', en: 'Redox reactions' } },
  { id: 'metals_nonmetals', name: { kk: 'Металдар мен бейметалдар', ru: 'Металлы и неметаллы', en: 'Metals & non-metals' } },
  { id: 'organic', name: { kk: 'Органикалық химия', ru: 'Органическая химия', en: 'Organic chemistry' } },
  { id: 'calculations', name: { kk: 'Есептер (моль, масса, көлем)', ru: 'Расчётные задачи', en: 'Calculations' } },
];

export const TopicPicker: React.FC<TopicPickerProps> = ({
  selectedTopic,
  onSelectTopic,
  lang,
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      <button
        type="button"
        onClick={() => onSelectTopic('all')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedTopic === 'all'
            ? 'bg-teal-500 text-white shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
      >
        {lang === 'kk' ? 'Барлық тақырыптар' : lang === 'ru' ? 'Все темы' : 'All topics'}
      </button>

      {TOPICS_META.map((t) => {
        const isSelected = selectedTopic === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTopic(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-teal-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {t.name[lang] || t.name.kk}
          </button>
        );
      })}
    </div>
  );
};
