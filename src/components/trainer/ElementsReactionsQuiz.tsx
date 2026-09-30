import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Flame,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Bot,
  Filter,
  Trophy,
  Award,
  Atom,
  FlaskConical,
  Palette,
  Check,
  ChevronRight,
  Medal,
  Crown,
  Share2,
} from 'lucide-react';
import { FormulaText } from '../ui/FormulaText';
import { QuizLeaderboard } from './QuizLeaderboard';
import {
  addQuizLeaderboardScore,
  getQuizLeaderboard,
  QuizLeaderboardEntry,
} from '../../types/quizLeaderboard';

export interface QuizQuestion {
  id: string;
  category: 'elements' | 'reactions' | 'precipitates';
  difficulty: 'easy' | 'medium' | 'hard';
  elementSymbol?: string;
  elementNumber?: number;
  question: { kk: string; ru: string; en: string };
  reactionEquation?: string;
  options: { kk: string[]; ru: string[]; en: string[] };
  correctAnswer: number;
  explanation: { kk: string; ru: string; en: string };
  fact?: { kk: string; ru: string; en: string };
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz_elem_01',
    category: 'elements',
    difficulty: 'easy',
    elementSymbol: 'Na',
    elementNumber: 11,
    question: {
      kk: 'Натрий ($Na$) сумен әрекеттескенде қандай газ бөлінеді және қандай ерітінді түзіледі?',
      ru: 'Какой газ выделяется и какой раствор образуется при реакции натрия ($Na$) с водой?',
      en: 'What gas is evolved and what solution is formed when sodium ($Na$) reacts with water?',
    },
    reactionEquation: '$2Na + 2H_2O \\rightarrow 2NaOH + H_2\\uparrow$',
    options: {
      kk: [
        'Кислород ($O_2$) және натрий оксиді',
        'Сутегі ($H_2$) және натрий гидроксиді (сілті)',
        'Азот ($N_2$) және натрий гидриді',
        'Көмірқышқыл газы ($CO_2$) және тұз',
      ],
      ru: [
        'Кислород ($O_2$) и оксид натрия',
        'Водород ($H_2$) и гидроксид натрия (щёлочь)',
        'Азот ($N_2$) и гидрид натрия',
        'Углекислый газ ($CO_2$) и соль',
      ],
      en: [
        'Oxygen ($O_2$) and sodium oxide',
        'Hydrogen ($H_2$) and sodium hydroxide (alkali)',
        'Nitrogen ($N_2$) and sodium hydride',
        'Carbon dioxide ($CO_2$) and salt',
      ],
    },
    correctAnswer: 1,
    explanation: {
      kk: 'Сілтілік металдар сумен ширақ әрекеттесіп, сутегі газын ($H_2\\uparrow$) бөледі және суда еритін негіз — сілті ($NaOH$) түзеді. Ерітінді фенолфталеин түсін таңқурай түсіне өзгертеді.',
      ru: 'Щелочные металлы бурно реагируют с водой с выделением водорода ($H_2\\uparrow$) и образованием гидроксида натрия ($NaOH$). Раствор окрашивает фенолфталеин в малиновый цвет.',
      en: 'Alkali metals react vigorously with water, generating hydrogen gas ($H_2\\uparrow$) and forming sodium hydroxide ($NaOH$). The solution turns phenolphthalein deep pink.',
    },
    fact: {
      kk: '💡 Натрийді су астында сақтауға болмайды, ол керосин немесе парафин майында сақталады!',
      ru: '💡 Натрий нельзя хранить на воздухе или в воде, его хранят под слоем керосина или минерального масла!',
      en: '💡 Sodium cannot be stored in air or water; it is stored submerged in kerosene or mineral oil!',
    },
  },
  {
    id: 'quiz_prec_02',
    category: 'precipitates',
    difficulty: 'easy',
    question: {
      kk: 'Калий иодиді ($KI$) мен мыс сульфаты ($CuSO_4$) немесе мыс иондары мен гидроксид ионы әрекеттескендегі $Cu(OH)_2$ тұнбасының түсі қандай?',
      ru: 'Какой цвет имеет осадок гидроксида меди(II) ($Cu(OH)_2$), выпадающий при реакции солей меди с щелочами?',
      en: 'What is the color of the copper(II) hydroxide precipitate ($Cu(OH)_2$) formed when copper salts react with alkalis?',
    },
    reactionEquation: '$Cu^{2+} + 2OH^- \\rightarrow Cu(OH)_2\\downarrow$',
    options: {
      kk: ['Ақ ірімшік тәрізді', 'Көгілдір (көк) іркілдек тұнба', 'Сары ұнтақ', 'Қара-қоңыр тұнба'],
      ru: ['Белый творожистый', 'Голубой студенистый осадок', 'Желтый порошок', 'Тёмно-коричневый'],
      en: ['White curdy', 'Sky-blue gelatinous precipitate', 'Yellow powder', 'Dark brown'],
    },
    correctAnswer: 1,
    explanation: {
      kk: 'Мыс(II) гидроксиді $Cu(OH)_2$ — көгілдір түсті суға ерімейтін негіз. Қыздырғанда ол ыдырап, қара түсті мыс(II) оксидіне ($CuO$) айналады.',
      ru: 'Гидроксид меди(II) $Cu(OH)_2$ — это голубой нерастворимый осадок. При нагревании он разлагается на воду и чёрный оксид меди(II) ($CuO$).',
      en: 'Copper(II) hydroxide $Cu(OH)_2$ is a sky-blue insoluble precipitate. Upon heating, it decomposes into water and black copper(II) oxide ($CuO$).',
    },
    fact: {
      kk: '💡 Тұнбаны қыздырғанда: $Cu(OH)_2 \\xrightarrow{t} CuO\\downarrow (қара) + H_2O$',
      ru: '💡 При нагревании осадка: $Cu(OH)_2 \\xrightarrow{t} CuO\\downarrow (чёрный) + H_2O$',
      en: '💡 Upon heating: $Cu(OH)_2 \\xrightarrow{t} CuO\\downarrow (black) + H_2O$',
    },
  },
  {
    id: 'quiz_reac_03',
    category: 'reactions',
    difficulty: 'medium',
    question: {
      kk: 'Темір(III) оксидін көміртек оксидімен (CO) тотықсыздандырып темір алу реакциясында $Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2$ қай зат Тотықтырғыш болып табылады?',
      ru: 'В реакции восстановления железа $Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2$, какое вещество является Окислителем?',
      en: 'In the iron reduction reaction $Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2$, which substance acts as the Oxidizing Agent?',
    },
    reactionEquation: '$Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2$',
    options: {
      kk: [
        '$CO$ (көміртек моноксиді)',
        '$Fe_2O_3$ (темір(III) оксиді)',
        '$Fe$ (бос темір)',
        '$CO_2$ (көмірқышқыл газы)',
      ],
      ru: [
        '$CO$ (угарный газ)',
        '$Fe_2O_3$ (оксид железа(III))',
        '$Fe$ (свободное железо)',
        '$CO_2$ (углекислый газ)',
      ],
      en: [
        '$CO$ (carbon monoxide)',
        '$Fe_2O_3$ (iron(III) oxide)',
        '$Fe$ (free iron)',
        '$CO_2$ (carbon dioxide)',
      ],
    },
    correctAnswer: 1,
    explanation: {
      kk: '$Fe_2O_3$ құрамындағы темір ионы $Fe^{3+}$ электрон қосып алып, $Fe^0$-ге дейін тотықсызданады ($Fe^{3+} + 3e^- \\rightarrow Fe^0$). Электрон қабылдайтын зат — тотықтырғыш.',
      ru: 'Атом железа $Fe^{3+}$ в составе $Fe_2O_3$ принимает электроны и восстанавливается до $Fe^0$. Вещество, принимающее электроны — окислитель.',
      en: 'The iron atom $Fe^{3+}$ in $Fe_2O_3$ accepts electrons and is reduced to $Fe^0$. The electron acceptor is the oxidizing agent.',
    },
  },
  {
    id: 'quiz_elem_04',
    category: 'elements',
    difficulty: 'medium',
    elementSymbol: 'Cl',
    elementNumber: 17,
    question: {
      kk: 'Периодтық жүйеде элементтердің бейметалдық қасиеттері мен электртерістілігі қалай өзгереді?',
      ru: 'Как изменяются неметаллические свойства и электроотрицательность элементов в Периодической системе?',
      en: 'How do non-metallic properties and electronegativity change across the Periodic Table?',
    },
    options: {
      kk: [
        'Период бойынша солдан оңға өседі, топ бойынша жоғарыдан төмен артады',
        'Период бойынша солдан оңға өседі, топ бойынша төменнен жоғары артады',
        'Период бойынша оңнан солға өседі, топ бойынша төмендейді',
        'Барлық бағытта төмендейді',
      ],
      ru: [
        'Слева направо по периоду увеличиваются, сверху вниз по группе увеличиваются',
        'Слева направо по периоду увеличиваются, снизу вверх по группе увеличиваются',
        'Справа налево по периоду увеличиваются, по группе уменьшаются',
        'Уменьшаются во всех направлениях',
      ],
      en: [
        'Increases left to right across a period, increases top to bottom down a group',
        'Increases left to right across a period, increases bottom to top up a group',
        'Increases right to left across a period, decreases down a group',
        'Decreases in all directions',
      ],
    },
    correctAnswer: 1,
    explanation: {
      kk: 'Ядро заряды өсіп, радиус кішірейгендіктен, электртерістілік период бойымен солдан оңға қарай және топ бойымен төменнен жоғарыға (Фторға $F$ қарай) артады.',
      ru: 'Из-за роста заряда ядра и уменьшения радиуса атома, электроотрицательность растет слева направо по периоду и снизу вверх по группе (к фтору $F$).',
      en: 'Due to increasing nuclear charge and decreasing atomic radius, electronegativity increases left-to-right across a period and bottom-to-top up a group (towards Fluorine $F$).',
    },
    fact: {
      kk: '💡 Фтор ($F$) — әлемдегі ең электртеріс элемент (Полтинг шкаласы бойынша 4.0).',
      ru: '💡 Фтор ($F$) — самый электроотрицательный элемент во Вселенной (4.0 по Полингу).',
      en: '💡 Fluorine ($F$) is the most electronegative element in the universe (4.0 on Pauling scale).',
    },
  },
  {
    id: 'quiz_prec_05',
    category: 'precipitates',
    difficulty: 'easy',
    question: {
      kk: 'Күміс нитраты ($AgNO_3$) сапалық реакцияда хлорид-иондарымен ($Cl^-$) әрекеттескенде қандай түсті тұнба түзеді?',
      ru: 'Какой цвет имеет осадок, образующийся при качественной реакции нитрата серебра ($AgNO_3$) с хлорид-ионами ($Cl^-$)?',
      en: 'What color is the precipitate formed in the qualitative reaction of silver nitrate ($AgNO_3$) with chloride ions ($Cl^-$)?',
    },
    reactionEquation: '$Ag^+ + Cl^- \\rightarrow AgCl\\downarrow$',
    options: {
      kk: ['Ақ ірімшік тәрізді тұнба ($AgCl$)', 'Ашық сары тұнба ($AgBr$)', 'Қанық сары тұнба ($AgI$)', 'Қара тұнба ($Ag_2S$)'],
      ru: ['Белый творожистый осадок ($AgCl$)', 'Светло-желтый осадок ($AgBr$)', 'Ярко-желтый осадок ($AgI$)', 'Чёрный осадок ($Ag_2S$)'],
      en: ['White curdy precipitate ($AgCl$)', 'Pale yellow precipitate ($AgBr$)', 'Bright yellow precipitate ($AgI$)', 'Black precipitate ($Ag_2S$)'],
    },
    correctAnswer: 0,
    explanation: {
      kk: '$AgCl$ тұнбасы — ақ ірімшік тәрізді, азот қышқылында ерімейді. Жарық әсерінен ол біртіндеп қараяды.',
      ru: 'Осадок $AgCl$ — белый творожистый, нерастворим в азотной кислоте. На свету постепенно темнеет из-за выделения серебра.',
      en: 'The $AgCl$ precipitate is white and curdy, insoluble in nitric acid. It darkens in sunlight due to metallic silver formation.',
    },
  },
  {
    id: 'quiz_reac_06',
    category: 'reactions',
    difficulty: 'medium',
    question: {
      kk: 'Бейтараптану реакциясы (Acid-Base Neutralization) дегенімыз не?',
      ru: 'Что представляет собой реакция нейтрализации (Acid-Base Neutralization)?',
      en: 'What is an Acid-Base Neutralization reaction?',
    },
    reactionEquation: '$H^+ + OH^- \\rightarrow H_2O$',
    options: {
      kk: [
        'Қышқыл мен негіз (сілті) әрекеттесіп, тұз бен су түзетін реакция',
        'Тұз бен тұз әрекеттесіп тұнба түсетін реакция',
        'Металл мен қышқыл әрекеттесіп сутегі бөлетін реакция',
        'Заттың оттегіде жану реакциясы',
      ],
      ru: [
        'Реакция между кислотой и основанием (щелочью) с образованием соли и воды',
        'Реакция между двумя солями с выпадением осадка',
        'Реакция металлов с кислотами с выделением водорода',
        'Реакция горения веществ в кислороде',
      ],
      en: [
        'A reaction between an acid and a base (alkali) producing salt and water',
        'A reaction between two salts producing a precipitate',
        'A reaction of metals with acids producing hydrogen gas',
        'A combustion reaction of substances in oxygen',
      ],
    },
    correctAnswer: 0,
    explanation: {
      kk: 'Бейтараптану реакциясының қысқартылған иондық теңдеуі: $H^+ + OH^- \\rightarrow H_2O$. Экзотермиялық процесс.',
      ru: 'Сокращенное ионное уравнение нейтрализации: $H^+ + OH^- \\rightarrow H_2O$. Процесс экзотермический.',
      en: 'Net ionic equation for neutralization: $H^+ + OH^- \\rightarrow H_2O$. It is an exothermic process.',
    },
  },
];

export interface QuizProgressState {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  bestStreak: number;
  xp: number;
  category: 'all' | 'elements' | 'reactions' | 'precipitates';
  isFinished: boolean;
}

interface ElementsReactionsQuizProps {
  lang: 'kk' | 'ru' | 'en';
  onOpenAiChat?: (context: string) => void;
  onProgressUpdate?: (state: QuizProgressState) => void;
}

export const ElementsReactionsQuiz: React.FC<ElementsReactionsQuizProps> = ({
  lang,
  onOpenAiChat,
  onProgressUpdate,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'elements' | 'reactions' | 'precipitates'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showLeaderboardView, setShowLeaderboardView] = useState(false);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('chemlab:player-name') || '');
  const [savedScoreId, setSavedScoreId] = useState<string | null>(null);
  const [hasSavedToLeaderboard, setHasSavedToLeaderboard] = useState(false);
  const [userAnswersHistory, setUserAnswersHistory] = useState<
    Array<{ questionId: string; userChoice: number; isCorrect: boolean }>
  >([]);

  // Filtered dataset
  const filteredQuestions = useMemo(() => {
    if (activeCategory === 'all') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.category === activeCategory);
  }, [activeCategory]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  });

  // Sync state to parent on any update
  useEffect(() => {
    if (onProgressUpdateRef.current) {
      onProgressUpdateRef.current({
        currentIndex,
        totalQuestions: filteredQuestions.length,
        score,
        streak,
        bestStreak,
        xp,
        category: activeCategory,
        isFinished,
      });
    }
  }, [currentIndex, filteredQuestions.length, score, streak, bestStreak, xp, activeCategory, isFinished]);

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      const newBestStreak = Math.max(newStreak, bestStreak);
      const earnedXp = 15 + newStreak * 5;
      
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(newBestStreak);
      setXp((x) => x + earnedXp);
    } else {
      setStreak(0);
    }

    setUserAnswersHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        userChoice: selectedOption,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      // Auto save or prepare save
      setHasSavedToLeaderboard(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setShowLeaderboardView(false);
    setSavedScoreId(null);
    setHasSavedToLeaderboard(false);
    setUserAnswersHistory([]);
  };

  const handleSaveToLeaderboard = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (hasSavedToLeaderboard) return;

    const nameToSave = playerName.trim() || (lang === 'kk' ? 'Жас химик' : lang === 'ru' ? 'Юный химик' : 'Young Chemist');
    localStorage.setItem('chemlab:player-name', nameToSave);

    const total = filteredQuestions.length;
    const percentage = Math.round((score / total) * 100);

    const result = addQuizLeaderboardScore({
      userName: nameToSave,
      score,
      total,
      percentage,
      streak: bestStreak,
      xp,
      category: activeCategory,
    });

    setHasSavedToLeaderboard(true);
    setSavedScoreId(result.updatedLeaderboard.find((x) => x.userName === nameToSave)?.id || null);
    setShowLeaderboardView(true);
  };

  const t = {
    title:
      lang === 'kk'
        ? '⚡ Элементтер мен Реакциялар Экспресс-Викторинасы'
        : lang === 'ru'
        ? '⚡ Экспресс-Викторина: Элементы и Реакции'
        : '⚡ Express Quiz: Elements & Reactions',
    subtitle:
      lang === 'kk'
        ? 'Иондар, түстер, тотығу дәрежелері мен реакцияларды лезде тексеріңіз'
        : lang === 'ru'
        ? 'Мгновенная проверка знаний по элементам, осадкам и уравнениям'
        : 'Instant knowledge check for element properties, precipitates & equations',
    catAll: lang === 'kk' ? 'Барлығы' : lang === 'ru' ? 'Все вопросы' : 'All Topics',
    catElem: lang === 'kk' ? '⚛️ Элементтер' : lang === 'ru' ? '⚛️ Элементы' : '⚛️ Elements',
    catReac: lang === 'kk' ? '⚡ Реакциялар' : lang === 'ru' ? '⚡ Реакции' : '⚡ Reactions',
    catPrec: lang === 'kk' ? '🎨 Осадоктар мен түстер' : lang === 'ru' ? '🎨 Осадки и цвета' : '🎨 Precipitates',
    checkBtn: lang === 'kk' ? 'Жауапты тексеру' : lang === 'ru' ? 'Проверить ответ' : 'Check Answer',
    nextBtn: lang === 'kk' ? 'Келесі сұрақ' : lang === 'ru' ? 'Следующий вопрос' : 'Next Question',
    askAi: lang === 'kk' ? 'ИИ-тәлімгерден сұрау' : lang === 'ru' ? 'Спросить у ИИ' : 'Ask AI Tutor',
    explanationTitle: lang === 'kk' ? '💡 Химиялық түсініктеме' : lang === 'ru' ? '💡 Химическое разбор' : '💡 Chemical Explanation',
    accuracy: lang === 'kk' ? 'Дәлдік' : lang === 'ru' ? 'Точность' : 'Accuracy',
    scoreText: lang === 'kk' ? 'Нәтиже' : lang === 'ru' ? 'Результат' : 'Score',
    restart: lang === 'kk' ? 'Қайта бастау' : lang === 'ru' ? 'Пройти снова' : 'Play Again',
    viewLeaderboard: lang === 'kk' ? 'ТОП-5 Көшбасшылар' : lang === 'ru' ? 'ТОП-5 Лидеров' : 'TOP 5 Leaderboard',
    backToQuiz: lang === 'kk' ? 'Викторинаға қайту' : lang === 'ru' ? 'К викторине' : 'Back to Quiz',
    enterNamePrompt:
      lang === 'kk'
        ? 'Нәтижеңізді көшбасшылар тақтасына сақтаңыз:'
        : lang === 'ru'
        ? 'Сохраните свой результат в таблицу рекордов:'
        : 'Save your score to the leaderboard:',
    namePlaceholder: lang === 'kk' ? 'Есіміңіз немесе мектебіңіз...' : lang === 'ru' ? 'Ваше имя или школа...' : 'Your name or school...',
    saveScoreBtn: lang === 'kk' ? 'Нәтижені жариялау' : lang === 'ru' ? 'Записать рекорд' : 'Submit Record',
    savedSuccess: lang === 'kk' ? 'Рекорд сақталды!' : lang === 'ru' ? 'Рекорд сохранён!' : 'Record Saved!',
  };

  // If user explicitly chose to see the leaderboard view
  if (showLeaderboardView) {
    return (
      <div className="space-y-4 animate-fade-in">
        <QuizLeaderboard
          lang={lang}
          highlightId={savedScoreId || undefined}
          onPlayAgain={handleRestartQuiz}
        />
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setShowLeaderboardView(false)}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.backToQuiz}</span>
          </button>
        </div>
      </div>
    );
  }

  // Summary View when quiz is finished
  if (isFinished) {
    const total = filteredQuestions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-6 animate-fade-in shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-teal-500 p-[2px] mx-auto shadow-xl">
            <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-500 dark:text-amber-400 animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {lang === 'kk' ? 'Викторина Аяқталды!' : lang === 'ru' ? 'Викторина Завершена!' : 'Quiz Completed!'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {lang === 'kk'
              ? 'Тамаша нәтиже! Химиялық біліміңізді одан әрі шыңдаңыз.'
              : lang === 'ru'
              ? 'Отличная работа! Продолжайте совершенствовать химические знания.'
              : 'Great job! Keep practicing to master chemistry concepts.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.scoreText}</span>
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {score} / {total}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">{t.accuracy}</span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{percentage}%</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Best Streak</span>
            <span className="text-2xl font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500 dark:fill-amber-400" />
              {bestStreak}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Earned XP</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-indigo-600 dark:fill-indigo-400" />
              +{xp}
            </span>
          </div>
        </div>

        {/* Leaderboard Submission Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            <span>{t.enterNamePrompt}</span>
          </div>

          <form onSubmit={handleSaveToLeaderboard} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t.namePlaceholder}
              disabled={hasSavedToLeaderboard}
              maxLength={35}
              className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={hasSavedToLeaderboard}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                hasSavedToLeaderboard
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-105 active:scale-95'
              }`}
            >
              {hasSavedToLeaderboard ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.savedSuccess}</span>
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>{t.saveScoreBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleRestartQuiz}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.restart}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLeaderboardView(true)}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold text-sm transition-all border border-amber-500/30 flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>{t.viewLeaderboard}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar & Category Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
            <span>{t.title}</span>
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">{t.subtitle}</p>
        </div>

        {/* Score & XP Indicators + Leaderboard link */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowLeaderboardView(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{t.viewLeaderboard}</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs font-mono font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-pulse" />
            <span className="text-amber-500 dark:text-amber-400">{streak} streak</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-mono font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
            <span>{xp} XP</span>
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('all');
            handleRestartQuiz();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'all'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          {t.catAll}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('elements');
            handleRestartQuiz();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'elements'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          {t.catElem}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('reactions');
            handleRestartQuiz();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'reactions'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          {t.catReac}
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('precipitates');
            handleRestartQuiz();
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === 'precipitates'
              ? 'bg-teal-500 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          {t.catPrec}
        </button>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="space-y-6 pt-2">
          {/* Question Index Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
              <span>
                {lang === 'kk' ? 'Сұрақ' : lang === 'ru' ? 'Вопрос' : 'Question'} {currentIndex + 1} / {filteredQuestions.length}
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-mono font-extrabold">
                {Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              {currentQ.elementSymbol && (
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 dark:border-teal-500/40 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] text-teal-700 dark:text-teal-300 font-bold">{currentQ.elementNumber}</span>
                  <span className="text-base font-black text-teal-700 dark:text-teal-400">{currentQ.elementSymbol}</span>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  <FormulaText text={currentQ.question[lang] || currentQ.question.kk} />
                </p>
                {currentQ.reactionEquation && (
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-teal-700 dark:text-teal-300 inline-block">
                    <FormulaText text={currentQ.reactionEquation} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(currentQ.options[lang] || currentQ.options.kk).map((optText, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOpt = optIdx === currentQ.correctAnswer;

              let cardStyle =
                'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrectOpt) {
                  cardStyle =
                    'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40';
                } else if (isSelected && !isCorrectOpt) {
                  cardStyle =
                    'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/40';
                } else {
                  cardStyle = 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-40';
                }
              } else if (isSelected) {
                cardStyle =
                  'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/50';
              }

              return (
                <button
                  key={`quiz-opt-${currentQ.id}-${optIdx}`}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 pt-0.5">
                    <FormulaText text={optText} />
                  </span>
                  {isAnswerSubmitted && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit / Next Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  selectedOption !== null
                    ? 'bg-teal-500 hover:bg-teal-400 text-white hover:scale-105 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{t.checkBtn}</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full flex items-center justify-between gap-3">
                {onOpenAiChat && (
                  <button
                    type="button"
                    onClick={() =>
                      onOpenAiChat(
                        `Объясни подробнее вопрос по химии: "${currentQ.question[lang]}" и почему правильный ответ: "${currentQ.options[lang][currentQ.correctAnswer]}"`
                      )
                    }
                    className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/60 dark:hover:bg-indigo-800 border border-indigo-200 dark:border-indigo-700/60 text-indigo-700 dark:text-indigo-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.askAi}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-white font-extrabold text-xs transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 ml-auto cursor-pointer"
                >
                  <span>{t.nextBtn}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Immediate Chemical Explanation Box */}
          {isAnswerSubmitted && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>{t.explanationTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <FormulaText text={currentQ.explanation[lang] || currentQ.explanation.kk} />
              </p>
              {currentQ.fact && (
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-800 dark:text-teal-300 font-medium">
                  <FormulaText text={currentQ.fact[lang] || currentQ.fact.kk} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
