import { TrainerTask } from '../types/trainer';
import { generateRandomCalculationTask } from '../utils/trainer/taskGenerator';

// Handcrafted UNT (ҰБТ) Exam Tasks Pool
export const HANDCRAFTED_TASKS: TrainerTask[] = [
  // --- 1. Atomic Structure (Атом құрылысы) ---
  {
    id: 'unt_atom_01',
    exams: ['ent'],
    topic: 'atomic_structure',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: 'Алюминий атомындағы ²⁷₁₃Al нейтрондар саны қандай?',
      ru: 'Сколько нейтронов содержится в ядре атома алюминия ²⁷₁₃Al?',
      en: 'How many neutrons are in the nucleus of an aluminum atom ²⁷₁₃Al?',
    },
    options: {
      kk: ['13', '14', '27', '40'],
      ru: ['13', '14', '27', '40'],
      en: ['13', '14', '27', '40'],
    },
    correctAnswer: 1,
    hint: {
      kk: 'Нейтрондар саны = Массалық сан (A) - Протондар саны (Z).',
      ru: 'Число нейтронов N = A - Z.',
      en: 'Neutrons N = Mass number A - Protons Z.',
    },
    solutionSteps: {
      kk: ['1) Z = 13 (протондар)', '2) A = 27 (массалық сан)', '3) N = 27 - 13 = 14 нейтрон.'],
      ru: ['1) Z = 13 (протоны)', '2) A = 27 (массовое число)', '3) N = 27 - 13 = 14 нейтронов.'],
      en: ['1) Z = 13', '2) A = 27', '3) N = 27 - 13 = 14 neutrons.'],
    },
  },
  {
    id: 'unt_atom_02',
    exams: ['ent'],
    topic: 'atomic_structure',
    difficulty: 'medium',
    type: 'single_choice',
    condition: {
      kk: 'Хлор атомының (Z=17) сыртқы электрондық қабатының электрондық конфигурациясын көрсетіңіз:',
      ru: 'Укажите электронную конфигурацию внешнего слоя атома хлора (Z=17):',
      en: 'Select the valence electron shell configuration of chlorine (Z=17):',
    },
    options: {
      kk: ['3s² 3p⁵', '3s² 3p⁶', '2s² 2p⁵', '3s¹ 3p⁶'],
      ru: ['3s² 3p⁵', '3s² 3p⁶', '2s² 2p⁵', '3s¹ 3p⁶'],
      en: ['3s² 3p⁵', '3s² 3p⁶', '2s² 2p⁵', '3s¹ 3p⁶'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Хлор 3-периодта, VIIA топшасында орналасқан.',
      ru: 'Хлор находится в 3 периоде, VIIA группе.',
      en: 'Chlorine is in period 3, group 17.',
    },
    solutionSteps: {
      kk: ['Хлор Z=17 электрондық формуласы: 1s² 2s² 2p⁶ 3s² 3p⁵.'],
      ru: ['Конфигурация хлора: 1s² 2s² 2p⁶ 3s² 3p⁵.'],
      en: ['Chlorine configuration: 1s² 2s² 2p⁶ 3s² 3p⁵.'],
    },
  },
  {
    id: 'unt_atom_03',
    exams: ['ent'],
    topic: 'atomic_structure',
    difficulty: 'hard',
    type: 'multi_choice',
    condition: {
      kk: 'd-элементтерге жататын химиялық элементтерді таңдаңыз (бірнеше дұрыс жауап):',
      ru: 'Выберите химические элементы, относящиеся к d-элементам (несколько вариантов):',
      en: 'Select the chemical elements that belong to d-block elements (multiple choice):',
    },
    options: {
      kk: ['Темір (Fe)', 'Кальций (Ca)', 'Мыс (Cu)', 'Натрий (Na)', 'Хром (Cr)'],
      ru: ['Железо (Fe)', 'Кальций (Ca)', 'Медь (Cu)', 'Натрий (Na)', 'Хром (Cr)'],
      en: ['Iron (Fe)', 'Calcium (Ca)', 'Copper (Cu)', 'Sodium (Na)', 'Chromium (Cr)'],
    },
    correctAnswer: [0, 2, 4],
    hint: {
      kk: 'd-элементтер қосымша топшаларда (B топшаларында) орналасқан.',
      ru: 'd-элементы находятся в побочных подгруппах периодической системы.',
      en: 'd-block elements are located in transition metal sub-groups.',
    },
    solutionSteps: {
      kk: ['Fe, Cu, Cr — ауыспалы металдар, d-орбитальдары толады.'],
      ru: ['Fe, Cu, Cr являются d-элементами.'],
      en: ['Fe, Cu, and Cr are d-block transition metals.'],
    },
  },

  // --- 2. Periodic Law (Периодтық заң) ---
  {
    id: 'unt_per_01',
    exams: ['ent'],
    topic: 'periodic_law',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: '3-периодта солдан оңға қарай элементтердің бейметалдық қасиеттері қалай өзгереді?',
      ru: 'Как изменяются неметаллические свойства элементов в 3 периоде слева направо?',
      en: 'How do non-metallic properties change across period 3 from left to right?',
    },
    options: {
      kk: ['Күшейеді', 'Әлсірейді', 'Өзгермейді', 'Кеміп, сосын артады'],
      ru: ['Усиливаются', 'Ослабевают', 'Не изменяются', 'Сначала падают, потом растут'],
      en: ['Increase', 'Decrease', 'Remain unchanged', 'First fall then rise'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Ядро заряды өскен сайын атом радиусы кішірейіп, электрон қосып алу қабілеті артады.',
      ru: 'С ростом заряда ядра сжимается атомный радиус.',
      en: 'Nuclear charge increases while atomic radius shrinks.',
    },
    solutionSteps: {
      kk: ['Период бойынша солдан оңға қарай бейметалдық қасиет пен электртерістілік артады.'],
      ru: ['Слева направо растут электроотрицательность и неметаллические свойства.'],
      en: ['Non-metallic character increases left to right across a period.'],
    },
  },

  // --- 3. Chemical Bonding (Химиялық байланыс) ---
  {
    id: 'unt_bond_01',
    exams: ['ent'],
    topic: 'chemical_bond',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: 'Натрий хлориді кристалдарындағы (NaCl) химиялық байланыстың түрі қандай?',
      ru: 'Укажите тип химической связи в кристалле хлорида натрия (NaCl):',
      en: 'State the bonding type present in sodium chloride (NaCl):',
    },
    options: {
      kk: ['Иондық', 'Ковалентті полярлы', 'Ковалентті полярсыз', 'Металдық'],
      ru: ['Ионная', 'Ковалентная полярная', 'Ковалентная неполярная', 'Металлическая'],
      en: ['Ionic', 'Covalent polar', 'Covalent nonpolar', 'Metallic'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Металл (Na) мен бейметалл (Cl) арасындағы байланыс.',
      ru: 'Связь между типичным металлом и неметаллом.',
      en: 'Bonding between a metal and a nonmetal.',
    },
    solutionSteps: {
      kk: ['Na⁺ және Cl⁻ иондары арасында электростатикалық тартылыс — иондық байланыс.'],
      ru: ['Связь между ионами Na⁺ и Cl⁻ является ионной.'],
      en: ['Electrostatic attraction between Na⁺ and Cl⁻ forms an ionic bond.'],
    },
  },

  // --- 4. Inorganic Compounds Classes (Бейорганикалық қосылыстардың кластары) ---
  {
    id: 'unt_inorg_01',
    exams: ['ent'],
    topic: 'inorganic_classes',
    difficulty: 'medium',
    type: 'single_choice',
    condition: {
      kk: 'Амфотерлі оксидті көрсетіңіз:',
      ru: 'Укажите амфотерный оксид:',
      en: 'Select the amphoteric oxide:',
    },
    options: {
      kk: ['Al2O3', 'CaO', 'SO3', 'Na2O'],
      ru: ['Al2O3', 'CaO', 'SO3', 'Na2O'],
      en: ['Al2O3', 'CaO', 'SO3', 'Na2O'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Амфотерлі оксидтер қышқылдармен де, негіздермен де әрекеттеседі.',
      ru: 'Амфотерные оксиды реагируют и с кислотами, и со щелочами.',
      en: 'Amphoteric oxides react with both acids and bases.',
    },
    solutionSteps: {
      kk: ['Al2O3 және ZnO — амфотерлі оксидтер.'],
      ru: ['Al2O3 является амфотерным оксидом.'],
      en: ['Al2O3 is an amphoteric oxide.'],
    },
  },

  // --- 5. Chemical Reactions (Химиялық реакциялар) ---
  {
    id: 'unt_react_01',
    exams: ['ent'],
    topic: 'reactions',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: 'Fe + CuSO4 → FeSO4 + Cu реакциясы реакцияның қай түріне жатады?',
      ru: 'К какому типу относится реакция Fe + CuSO4 → FeSO4 + Cu?',
      en: 'Which reaction type is Fe + CuSO4 → FeSO4 + Cu?',
    },
    options: {
      kk: ['Орын басу', 'Қосылу', 'Айрылу', 'Алмасу'],
      ru: ['Замещения', 'Соединения', 'Разложения', 'Обмена'],
      en: ['Single displacement', 'Synthesis', 'Decomposition', 'Double replacement'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Жай зат пен күрделі зат әрекеттесіп жатыр.',
      ru: 'Простое вещество реагирует со сложным.',
      en: 'An element reacts with a compound.',
    },
    solutionSteps: {
      kk: ['Белсендірек темір мысты оның тұзынан ығыстырады — орын басу реакциясы.'],
      ru: ['Более активный металл замещает менее активный — реакция замещения.'],
      en: ['More reactive iron displaces copper — single displacement reaction.'],
    },
  },

  // --- 6. Solutions & Electrolytic Dissociation (Ерітінділер) ---
  {
    id: 'unt_sol_01',
    exams: ['ent'],
    topic: 'solutions',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: 'Күшті электролитке жататын затты таңдаңыз:',
      ru: 'Выберите вещество, относящееся к сильным электролитам:',
      en: 'Select the strong electrolyte:',
    },
    options: {
      kk: ['HNO3 (азот қышқылы)', 'H2CO3 (көмір қышқылы)', 'H2S (күкіртсутек)', 'CH3COOH (сірке қышқылы)'],
      ru: ['HNO3 (азотная кислота)', 'H2CO3 (угольная кислота)', 'H2S (сероводород)', 'CH3COOH (уксусная кислота)'],
      en: ['HNO3 (nitric acid)', 'H2CO3 (carbonic acid)', 'H2S (hydrogen sulfide)', 'CH3COOH (acetic acid)'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Күшті қышқылдар суда 100% диссоциацияланады.',
      ru: 'Сильные кислоты полностью диссоциируют в воде.',
      en: 'Strong acids completely dissociate in aqueous solution.',
    },
    solutionSteps: {
      kk: ['HNO3 — күшті минералды қышқыл, толық диссоциацияланады.'],
      ru: ['HNO3 — сильная минеральная кислота.'],
      en: ['HNO3 is a strong mineral acid.'],
    },
  },

  // --- 7. Redox Reactions (Тотығу-тотықсыздану) ---
  {
    id: 'unt_redox_01',
    exams: ['ent'],
    topic: 'redox',
    difficulty: 'medium',
    type: 'single_choice',
    condition: {
      kk: 'KMnO4 қосылысындағы марганецтің (Mn) тотығу дәрежесі қандай?',
      ru: 'Укажите степень окисления марганца (Mn) в перманганате калия KMnO4:',
      en: 'Find the oxidation state of manganese (Mn) in potassium permanganate KMnO4:',
    },
    options: {
      kk: ['+7', '+2', '+4', '+6'],
      ru: ['+7', '+2', '+4', '+6'],
      en: ['+7', '+2', '+4', '+6'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'K (+1), O (-2). Бейтарап молекуладағы зарядтар қосындысы 0-ге тең.',
      ru: 'Сумма степеней окисления нейтральной молекулы равна 0. K (+1), O (-2).',
      en: 'Sum of oxidation states in neutral KMnO4 is zero. K(+1), O(-2).',
    },
    solutionSteps: {
      kk: ['+1 + x + 4×(-2) = 0 => x = +7.'],
      ru: ['+1 + x + 4*(-2) = 0 => x = +7.'],
      en: ['+1 + x + 4*(-2) = 0 => x = +7.'],
    },
  },

  // --- 8. Metals & Non-metals (Металдар мен бейметалдар) ---
  {
    id: 'unt_metal_01',
    exams: ['ent'],
    topic: 'metals_nonmetals',
    difficulty: 'easy',
    type: 'single_choice',
    condition: {
      kk: 'Әдеттегі жағдайда сұйық күйде болатын жалғыз металл қайсысы?',
      ru: 'Укажите единственный металл, находящийся при обычных условиях в жидком состоянии:',
      en: 'Name the only metal that exists as a liquid under room temperature:',
    },
    options: {
      kk: ['Сыннап (Hg)', 'Бром (Br2)', 'Натрий (Na)', 'Галлий (Ga)'],
      ru: ['Ртуть (Hg)', 'Бром (Br2)', 'Натрий (Na)', 'Галлий (Ga)'],
      en: ['Mercury (Hg)', 'Bromine (Br2)', 'Sodium (Na)', 'Gallium (Ga)'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Бұл металл термометрлерде қолданылады.',
      ru: 'Этот металл используется в медицинских термометрах.',
      en: 'This metal is used in traditional liquid thermometers.',
    },
    solutionSteps: {
      kk: ['Сынап (Hg) балқу температурасы -38.8°C болатын жалғыз сұйық металл.'],
      ru: ['Ртуть (Hg) — единственный жидкий металл при комнатной температуре.'],
      en: ['Mercury (Hg) is the only liquid metal at standard conditions.'],
    },
  },

  // --- 9. Organic Chemistry (Органикалық химия) ---
  {
    id: 'unt_org_01',
    exams: ['ent'],
    topic: 'organic',
    difficulty: 'medium',
    type: 'single_choice',
    condition: {
      kk: 'Алкандардың жалпы формуласын көрсетіңіз:',
      ru: 'Укажите общую формулу гомологического ряда алканов:',
      en: 'Select the general chemical formula for alkanes:',
    },
    options: {
      kk: ['C_n H_{2n+2}', 'C_n H_{2n}', 'C_n H_{2n-2}', 'C_n H_{2n-6}'],
      ru: ['C_n H_{2n+2}', 'C_n H_{2n}', 'C_n H_{2n-2}', 'C_n H_{2n-6}'],
      en: ['C_n H_{2n+2}', 'C_n H_{2n}', 'C_n H_{2n-2}', 'C_n H_{2n-6}'],
    },
    correctAnswer: 0,
    hint: {
      kk: 'Алкандар — қаныққан көмірсутектер (сигма-байланыстар).',
      ru: 'Алканы — предельные углеводороды с одинарными связями.',
      en: 'Alkanes are saturated hydrocarbons containing only single bonds.',
    },
    solutionSteps: {
      kk: ['Алкандар: метан (CH4), этан (C2H6), пропан (C3H8) -> C_n H_{2n+2}.'],
      ru: ['Формула алканов: C_n H_{2n+2}.'],
      en: ['General formula of alkanes is C_n H_{2n+2}.'],
    },
  },

  // --- 10. Calculations (Есептер шығару) ---
  {
    id: 'unt_calc_01',
    exams: ['ent'],
    topic: 'calculations',
    difficulty: 'easy',
    type: 'numeric_input',
    condition: {
      kk: 'Массасы 100 г кальций карбонатының (CaCO3) зат мөлшерін (моль) есептеңіз (M = 100 г/моль):',
      ru: 'Вычислите количество вещества (в моль) карбоната кальция CaCO3 массой 100 г (M = 100 г/моль):',
      en: 'Calculate the amount of substance (in moles) of 100 g calcium carbonate CaCO3 (M = 100 g/mol):',
    },
    correctAnswer: 1,
    tolerance: 0.1,
    unit: { kk: 'моль', ru: 'моль', en: 'mol' },
    hint: {
      kk: 'n = m / M.',
      ru: 'Формула: n = m / M.',
      en: 'Formula: n = m / M.',
    },
    solutionSteps: {
      kk: ['n = 100 г / 100 г/моль = 1 моль.'],
      ru: ['n = 100 / 100 = 1 моль.'],
      en: ['n = 100 / 100 = 1 mol.'],
    },
  },
];

// Generate additional tasks programmatically to create a pool of 400+ tasks
const PROCEDURAL_TASKS: TrainerTask[] = Array.from({ length: 390 }, (_, index) => {
  return generateRandomCalculationTask(1000 + index, 'ent');
});

export const ALL_TRAINER_TASKS: TrainerTask[] = [
  ...HANDCRAFTED_TASKS,
  ...PROCEDURAL_TASKS,
];
