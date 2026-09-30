import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Trophy,
  Flame,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import moleculesData from '../../data/molecules.json';
import { PresetMolecule } from '../../types/molecule';
import { MoleculeViewer3D } from './MoleculeViewer3D';
import { formatFormulaSubscripts } from '../../utils/mol/formula';

interface MoleculeQuizProps {
  lang: 'kk' | 'ru' | 'en';
  onLoadMoleculeToEditor: (mol: PresetMolecule) => void;
}

const presets = moleculesData as PresetMolecule[];

export const MoleculeQuiz: React.FC<MoleculeQuizProps> = ({ lang, onLoadMoleculeToEditor }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [currentMol, setCurrentMol] = useState<PresetMolecule | null>(null);
  const [options, setOptions] = useState<PresetMolecule[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('chemlab:molecule-quiz') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Filter pool by difficulty
  const pool = useMemo(() => {
    if (difficulty === 'easy') {
      return presets.filter((m) => m.atoms.length <= 5);
    }
    if (difficulty === 'medium') {
      return presets.filter((m) => m.atoms.length > 5 && m.atoms.length <= 12);
    }
    return presets.filter((m) => m.atoms.length > 12 || ['aspirin', 'glucose', 'benzene'].includes(m.id));
  }, [difficulty]);

  // Pick new question
  const nextQuestion = () => {
    if (pool.length < 4) return;
    const target = pool[Math.floor(Math.random() * pool.length)];
    setCurrentMol(target);

    // Pick 3 distractors from presets
    const distractors = presets
      .filter((m) => m.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const shuffled = [target, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(shuffled);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    nextQuestion();
  }, [difficulty]);

  const handleSelectOption = (optId: string) => {
    if (isAnswered || !currentMol) return;
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const isCorrect = optId === currentMol.id;
    if (isCorrect) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('chemlab:molecule-quiz', String(newScore));
        } catch {
          // ignore
        }
      }
    } else {
      setStreak(0);
    }
  };

  const t = {
    title: lang === 'kk' ? '«Бұл қандай молекула?» викторинасы' : lang === 'ru' ? 'Викторина «Как называется это вещество?»' : 'Quiz: Identify the Molecule',
    easy: lang === 'kk' ? 'Оңай' : lang === 'ru' ? 'Лёгкий' : 'Easy',
    medium: lang === 'kk' ? 'Орташа' : lang === 'ru' ? 'Средний' : 'Medium',
    hard: lang === 'kk' ? 'Күрделі' : lang === 'ru' ? 'Сложный' : 'Hard',
    score: lang === 'kk' ? 'Ұпай' : lang === 'ru' ? 'Счёт' : 'Score',
    streak: lang === 'kk' ? 'Серия' : lang === 'ru' ? 'Серия' : 'Streak',
    highScore: lang === 'kk' ? 'Рекорд' : lang === 'ru' ? 'Рекорд' : 'High Score',
    next: lang === 'kk' ? 'Келесі сұрақ' : lang === 'ru' ? 'Следующий вопрос' : 'Next Question',
    correctFeedback: lang === 'kk' ? 'Өте жақсы! Дұрыс жауап!' : lang === 'ru' ? 'Великолепно! Верный ответ!' : 'Correct! Great job!',
    wrongFeedback: lang === 'kk' ? 'Қате. Дұрыс жауап:' : lang === 'ru' ? 'Неверно. Правильный ответ:' : 'Incorrect. The right answer is:',
    loadToEditor: lang === 'kk' ? 'Осы молекуланы редакторда ашу' : lang === 'ru' ? 'Открыть в 2D редакторе' : 'Open in 2D Editor',
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Bar: Difficulty & Scores */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Difficulty */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          <button
            type="button"
            onClick={() => setDifficulty('easy')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              difficulty === 'easy'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.easy}
          </button>
          <button
            type="button"
            onClick={() => setDifficulty('medium')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              difficulty === 'medium'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.medium}
          </button>
          <button
            type="button"
            onClick={() => setDifficulty('hard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              difficulty === 'hard'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.hard}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 text-teal-700 dark:text-teal-400 text-xs font-bold">
            <Trophy className="w-4 h-4 text-teal-500" />
            <span>{score}</span>
            <span className="text-slate-400 font-normal">/ {highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Quiz Area: 3D Model on Left, Options on Right */}
      {currentMol && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 3D Rotating Model Container */}
          <div className="lg:col-span-6 h-[340px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-inner">
            <MoleculeViewer3D
              graph={{ atoms: currentMol.atoms, bonds: currentMol.bonds }}
              lang={lang}
            />
          </div>

          {/* Options & Result Panel */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t.title}:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.id === currentMol.id;

                let btnStyle =
                  'border-slate-200 dark:border-slate-750 bg-slate-50/70 dark:bg-slate-800/40 hover:border-teal-400 dark:hover:border-teal-500 text-slate-800 dark:text-slate-200';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/40';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[88px] ${btnStyle}`}
                  >
                    <span className="font-bold text-sm line-clamp-1">{opt.name[lang]}</span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatFormulaSubscripts(opt.formula)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback & Explanation */}
            {isAnswered && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  {selectedOptionId === currentMol.id ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle className="w-5 h-5" />
                      <span>{t.correctFeedback}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-sm">
                      <XCircle className="w-5 h-5" />
                      <span>
                        {t.wrongFeedback} <strong>{currentMol.name[lang]}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentMol.description[lang]}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>{t.next}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onLoadMoleculeToEditor(currentMol)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t.loadToEditor}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
