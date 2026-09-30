import React from 'react';
import { Award, AlertCircle, Sparkles } from 'lucide-react';
import { ExamType } from '../../types/trainer';

interface ExamSelectorProps {
  selectedExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
  lang: 'kk' | 'ru' | 'en';
}

export const ExamSelector: React.FC<ExamSelectorProps> = ({
  selectedExam,
  onSelectExam,
  lang,
}) => {
  const t = {
    title: 'ҰБТ / ЕНТ — Химия',
    subtitle:
      lang === 'kk'
        ? 'Қазақстан Ұлттық бірыңғай тестілеуінің бейіндік форматы (35 сұрақ, 40 балл)'
        : lang === 'ru'
        ? 'Профильный формат Национального единого тестирования РК (35 вопросов, 40 баллов)'
        : 'Kazakhstan UNT Chemistry Profile Format (35 questions, 40 points)',
    disclaimer:
      lang === 'kk'
        ? '⚠️ Назар аударыңыз: Барлық тапсырмалар ҰБТ спецификациясына сай оқу-жаттығу мақсатында дайындалған.'
        : lang === 'ru'
        ? '⚠️ Обратите внимание: Все задания подготовлены по спецификации ЕНТ для тренировки.'
        : '⚠️ Please note: All tasks are created according to UNT specifications.',
  };

  return (
    <div className="space-y-3">
      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-teal-500" />
        <span>{t.disclaimer}</span>
      </div>

      {/* Single Dedicated UNT Exam Card */}
      <div className="p-5 rounded-2xl border border-teal-500 bg-gradient-to-br from-teal-500/15 via-purple-500/10 to-indigo-500/15 shadow-xl flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              {t.title}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500 text-white shadow-sm">
              KZ 🇰🇿
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {t.subtitle}
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
