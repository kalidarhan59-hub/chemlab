export interface ReactionPreset {
  id: string;
  name: {
    kk: string;
    ru: string;
    en: string;
  };
  equation: string;
  category: 'basic' | 'neutralization' | 'redox' | 'organic' | 'complex' | 'ionic' | 'exam';
  difficulty: 'easy' | 'medium' | 'hard';
  description?: {
    kk: string;
    ru: string;
    en: string;
  };
}

export const REACTION_PRESETS: ReactionPreset[] = [
  // Basic
  {
    id: 'water-synthesis',
    category: 'basic',
    difficulty: 'easy',
    name: {
      kk: 'Судың түзілуі (синтез)',
      ru: 'Синтез воды (горение водорода)',
      en: 'Synthesis of water',
    },
    equation: 'H2 + O2 = H2O',
    description: {
      kk: 'Сутек газының оттекте жанып су түзуі. Экзотермиялық реакция.',
      ru: 'Горение водорода в кислороде с образованием воды. Экзотермическая реакция.',
      en: 'Hydrogen burning in oxygen to form water. Highly exothermic reaction.',
    },
  },
  {
    id: 'methane-combustion',
    category: 'basic',
    difficulty: 'easy',
    name: {
      kk: 'Метанның жануы',
      ru: 'Горение метана (природный газ)',
      en: 'Combustion of methane',
    },
    equation: 'CH4 + O2 = CO2 + H2O',
    description: {
      kk: 'Табиғи газдың толық жануы нәтижесінде көмірқышқыл газы мен су түзіледі.',
      ru: 'Полное сгорание природного газа с образованием углекислого газа и воды.',
      en: 'Complete combustion of natural gas yielding carbon dioxide and water vapor.',
    },
  },
  {
    id: 'magnesium-acid',
    category: 'basic',
    difficulty: 'easy',
    name: {
      kk: 'Магнийдің тұз қышқылымен әрекеттесуі',
      ru: 'Взаимодействие магния с соляной кислотой',
      en: 'Magnesium reacting with hydrochloric acid',
    },
    equation: 'Mg + HCl = MgCl2 + H2',
    description: {
      kk: 'Белсенді металдың қышқылдан сутекті ығыстырып шығаруы (орын басу).',
      ru: 'Реакция замещения: активный металл вытесняет водород из кислоты.',
      en: 'Single displacement: active metal displaces hydrogen gas from acid.',
    },
  },
  {
    id: 'iron-rust',
    category: 'basic',
    difficulty: 'easy',
    name: {
      kk: 'Темірдің тотығуы (тот басу)',
      ru: 'Окисление железа (ржавление)',
      en: 'Oxidation of iron (rusting)',
    },
    equation: 'Fe + O2 = Fe2O3',
    description: {
      kk: 'Темірдің оттекпен қосылып темір(III) оксидін түзуі.',
      ru: 'Взаимодействие железа с кислородом с образованием оксида железа(III).',
      en: 'Direct combination of iron with oxygen to form iron(III) oxide.',
    },
  },
  {
    id: 'ammonia-synthesis',
    category: 'basic',
    difficulty: 'easy',
    name: {
      kk: 'Аммиак синтезі (Габер-Бош процесі)',
      ru: 'Синтез аммиака (процесс Габера-Боша)',
      en: 'Haber-Bosch ammonia synthesis',
    },
    equation: 'N2 + H2 = NH3',
    description: {
      kk: 'Өндірісте тыңайтқыштар алудың ең маңызды реакциясы.',
      ru: 'Ключевой промышленный процесс получения азотных удобрений.',
      en: 'Key industrial process for nitrogen fixation and fertilizer production.',
    },
  },

  // Neutralization & Exchange
  {
    id: 'sodium-hydroxide-sulfuric',
    category: 'neutralization',
    difficulty: 'medium',
    name: {
      kk: 'Натрий гидроксиді және күкірт қышқылы',
      ru: 'Гидроксид натрия и серная кислота',
      en: 'Sodium hydroxide and sulfuric acid',
    },
    equation: 'NaOH + H2SO4 = Na2SO4 + H2O',
    description: {
      kk: 'Сілті мен екі негізді қышқыл арасындағы бейтараптану реакциясы.',
      ru: 'Классическая реакция нейтрализации щелочи двухосновной кислотой.',
      en: 'Classic neutralization between a strong base and diprotic acid.',
    },
  },
  {
    id: 'calcium-hydroxide-phosphoric',
    category: 'neutralization',
    difficulty: 'medium',
    name: {
      kk: 'Әк сүті және фосфор қышқылы',
      ru: 'Гашеная известь и фосфорная кислота',
      en: 'Calcium hydroxide and phosphoric acid',
    },
    equation: 'Ca(OH)2 + H3PO4 = Ca3(PO4)2 + H2O',
    description: {
      kk: 'Кальций фосфаты тұнбасының түзілуі (сүйектер мен минералдар негізі).',
      ru: 'Образование осадка фосфата кальция (основа костной ткани и апатитов).',
      en: 'Formation of calcium phosphate precipitate (main component of bone).',
    },
  },
  {
    id: 'silver-nitrate-chloride',
    category: 'neutralization',
    difficulty: 'easy',
    name: {
      kk: 'Хлор ионына сапалық реакция',
      ru: 'Качественная реакция на хлорид-ион',
      en: 'Qualitative test for chloride ions',
    },
    equation: 'AgNO3 + NaCl = AgCl + NaNO3',
    description: {
      kk: 'Ақ ірімшік тәрізді күміс хлориді тұнбасы түзіледі.',
      ru: 'Выпадение белого творожистого осадка хлорида серебра.',
      en: 'Precipitation of white curdy silver chloride.',
    },
  },
  {
    id: 'barium-sulfate',
    category: 'neutralization',
    difficulty: 'easy',
    name: {
      kk: 'Сульфат ионына сапалық реакция',
      ru: 'Качественная реакция на сульфат-ион',
      en: 'Precipitation of barium sulfate',
    },
    equation: 'BaCl2 + Na2SO4 = BaSO4 + NaCl',
    description: {
      kk: 'Қышқылдарда ерімейтін ақ тығыз барий сульфаты тұнбасы түзіледі.',
      ru: 'Образование белого нерастворимого в кислотах осадка сульфата бария.',
      en: 'Dense white precipitate of barium sulfate, insoluble in acids.',
    },
  },

  // Redox
  {
    id: 'permanganate-hcl',
    category: 'redox',
    difficulty: 'hard',
    name: {
      kk: 'Хлор газын калий перманганатынан алу',
      ru: 'Лабораторное получение хлора (Шееле)',
      en: 'Permanganate with hydrochloric acid',
    },
    equation: 'KMnO4 + HCl = KCl + MnCl2 + Cl2 + H2O',
    description: {
      kk: 'Күшті тотықтырғыш KMnO4 тұз қышқылын молекулалық хлорға дейін тотықтырады.',
      ru: 'Сильный окислитель окисляет соляную кислоту до свободного газообразного хлора.',
      en: 'Potassium permanganate oxidizes hydrochloric acid into chlorine gas.',
    },
  },
  {
    id: 'copper-nitric-conc',
    category: 'redox',
    difficulty: 'hard',
    name: {
      kk: 'Мыстың концентрлі азот қышқылымен әрекеттесуі',
      ru: 'Медь с концентрированной азотной кислотой',
      en: 'Copper with concentrated nitric acid',
    },
    equation: 'Cu + HNO3 = Cu(NO3)2 + NO2 + H2O',
    description: {
      kk: 'Қоңыр түсті «түлкі құйрығы» газы (NO2) бөлінеді.',
      ru: 'Выделение бурого газа («лисий хвост», диоксид азота NO2).',
      en: 'Vigorous oxidation with evolution of brown nitrogen dioxide gas.',
    },
  },
  {
    id: 'copper-nitric-dilute',
    category: 'redox',
    difficulty: 'hard',
    name: {
      kk: 'Мыстың сұйылтылған азот қышқылымен әрекеттесуі',
      ru: 'Медь с разбавленной азотной кислотой',
      en: 'Copper with dilute nitric acid',
    },
    equation: 'Cu + HNO3 = Cu(NO3)2 + NO + H2O',
    description: {
      kk: 'Түссіз азот оксиді(II) түзіліп, ауада лезде қоңырланады.',
      ru: 'Выделение бесцветного оксида азота(II), буреющего на воздухе.',
      en: 'Forms colorless nitrogen monoxide NO which turns brown in air.',
    },
  },
  {
    id: 'dichromate-iodide',
    category: 'redox',
    difficulty: 'hard',
    name: {
      kk: 'Калий дихроматы мен калий йодиді',
      ru: 'Дихромат калия и йодид калия в кислой среде',
      en: 'Potassium dichromate with potassium iodide',
    },
    equation: 'K2Cr2O7 + KI + H2SO4 = Cr2(SO4)3 + I2 + K2SO4 + H2O',
    description: {
      kk: 'Қызғылт сары дихромат жасыл хром(III) сульфатына ауысады, бос йод түзіледі.',
      ru: 'Оранжевый раствор переходит в зелёный с выделением молекулярного йода.',
      en: 'Orange dichromate reduced to green Cr(III) with elemental iodine.',
    },
  },
  {
    id: 'permanganate-ferrous',
    category: 'redox',
    difficulty: 'hard',
    name: {
      kk: 'Перманганатометрия (FeSO4 тотығуы)',
      ru: 'Перманганатометрия (окисление железа(II))',
      en: 'Permanganate titration of Fe(II)',
    },
    equation: 'FeSO4 + KMnO4 + H2SO4 = Fe2(SO4)3 + MnSO4 + K2SO4 + H2O',
    description: {
      kk: 'Аналитикалық химияның негізгі титрлеу реакциясы.',
      ru: 'Классическая титриметрическая реакция окислительно-восстановительного титрования.',
      en: 'Standard quantitative redox titration reaction.',
    },
  },

  // Organic
  {
    id: 'ethanol-combustion',
    category: 'organic',
    difficulty: 'medium',
    name: {
      kk: 'Этанолдың (спирт) жануы',
      ru: 'Горение этилового спирта (этанола)',
      en: 'Combustion of ethanol',
    },
    equation: 'C2H5OH + O2 = CO2 + H2O',
    description: {
      kk: 'Биоотын ретінде кеңінен қолданылатын этил спиртінің жануы.',
      ru: 'Сгорание этилового спирта с выделением тепла, углекислого газа и воды.',
      en: 'Clean combustion of bioethanol fuel.',
    },
  },
  {
    id: 'propane-combustion',
    category: 'organic',
    difficulty: 'medium',
    name: {
      kk: 'Пропанның жануы',
      ru: 'Горение пропана (бытовой газ)',
      en: 'Combustion of propane',
    },
    equation: 'C3H8 + O2 = CO2 + H2O',
    description: {
      kk: 'Тұрмыстық газ баллондары мен көлік жанармайының жануы.',
      ru: 'Сгорание сжиженного углеводородного газа.',
      en: 'Combustion of liquefied petroleum gas (LPG).',
    },
  },
  {
    id: 'glucose-respiration',
    category: 'organic',
    difficulty: 'medium',
    name: {
      kk: 'Глюкозаның тотығуы (жасушалық тыныс алу)',
      ru: 'Окисление глюкозы (клеточное дыхание)',
      en: 'Oxidation of glucose (cellular respiration)',
    },
    equation: 'C6H12O6 + O2 = CO2 + H2O',
    description: {
      kk: 'Барлық тірі ағзалардың негізгі энергия көзі (АТФ түзілуі).',
      ru: 'Главный источник биохимической энергии в живых клетках.',
      en: 'Fundamental biochemical energy source in living organisms.',
    },
  },

  // Complex & Inorganic
  {
    id: 'pyrite-roasting',
    category: 'complex',
    difficulty: 'hard',
    name: {
      kk: 'Пиритті күйдіру (күкірт қышқылын өндіру)',
      ru: 'Обжиг пирита (производство серной кислоты)',
      en: 'Roasting of iron pyrite',
    },
    equation: 'FeS2 + O2 = Fe2O3 + SO2',
    description: {
      kk: 'Күкірт қышқылы өндірісінің бірінші сатысы (күкірт диоксидін алу).',
      ru: 'Первая стадия контактного производства серной кислоты.',
      en: 'First stage of industrial sulfuric acid production.',
    },
  },
  {
    id: 'aluminum-alkali',
    category: 'complex',
    difficulty: 'hard',
    name: {
      kk: 'Алюминийдің сілтімен әрекеттесуі (кешенді қосылыс)',
      ru: 'Алюминий со щелочью и водой',
      en: 'Aluminum with alkali and water',
    },
    equation: 'Al + NaOH + H2O = Na[Al(OH)4] + H2',
    description: {
      kk: 'Амфотерлі металдың сілтілік ортада еріп, кешенді тұз және сутек түзуі.',
      ru: 'Растворение амфотерного металла с образованием тетрагидроксоалюмината и водорода.',
      en: 'Amphoteric dissolution of aluminum yielding sodium tetrahydroxoaluminate.',
    },
  },

  // Ionic
  {
    id: 'ionic-permanganate-fe',
    category: 'ionic',
    difficulty: 'hard',
    name: {
      kk: 'Иондық ОВР: Fe(2+) және MnO4(-)',
      ru: 'Ионная ОВР: Fe²⁺ и MnO₄⁻ в кислой среде',
      en: 'Ionic Redox: Fe²⁺ with MnO₄⁻',
    },
    equation: 'Fe{2+} + MnO4{-} + H{+} = Fe{3+} + Mn{2+} + H2O',
    description: {
      kk: 'Электрондық баланс және иондық зарядтар сақталу заңы.',
      ru: 'Электронный баланс с одновременным сохранением электрического заряда.',
      en: 'Net ionic redox equation balancing both mass and electrical charge.',
    },
  },

  // Exam favorites (ЕНТ / ОГЭ / ЕГЭ)
  {
    id: 'exam-chlorine-hot-alkali',
    category: 'exam',
    difficulty: 'hard',
    name: {
      kk: 'Хлордың ыстық сілтімен диспропорциялануы (ЕНТ)',
      ru: 'Диспропорционирование хлора в горячей щелочи (ЕГЭ)',
      en: 'Disproportionation of chlorine in hot alkali',
    },
    equation: 'Cl2 + KOH = KCl + KClO3 + H2O',
    description: {
      kk: 'Бертолле тұзын алу реакциясы, хлор бір мезгілде тотығады және тотықсызданады.',
      ru: 'Получение бертолетовой соли. Хлор одновременно повышает и понижает степень окисления.',
      en: 'Synthesis of potassium chlorate via thermal disproportionation.',
    },
  },
  {
    id: 'exam-phosphorus-nitric',
    category: 'exam',
    difficulty: 'hard',
    name: {
      kk: 'Фосфордың азот қышқылымен тотығуы (ЕНТ/ЕГЭ)',
      ru: 'Окисление фосфора азотной кислотой (ЕГЭ)',
      en: 'Oxidation of phosphorus by nitric acid',
    },
    equation: 'P + HNO3 + H2O = H3PO4 + NO',
    description: {
      kk: 'Бейметалдың тотықтырғыш қышқылмен әрекеттесіп ортофосфор қышқылын түзуі.',
      ru: 'Окисление неметалла до высшей кислоты концентрированным раствором.',
      en: 'Oxidation of elemental phosphorus to orthophosphoric acid.',
    },
  },
];
