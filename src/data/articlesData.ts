import { ArticleData } from '../types/article';

export const ARTICLES_DATA: ArticleData[] = [
  // 1. Baking Soda
  {
    slug: 'baking-soda-chemistry',
    topic: 'kitchen',
    readingTime: 4,
    date: '2026-09-15',
    coverSvgKey: 'baking_soda',
    title: {
      kk: 'Ас содасы мен қышқыл: қамыр неге көтеріледі?',
      ru: 'Выпечка и разрыхлитель: почему сода гасится и пышнеет тесто?',
      en: 'Baking Soda and Acid: Why Does Dough Rise?',
    },
    summary: {
      kk: 'Ас содасы (натрий гидрокарбонаты) мен сірке немесе айран қышқылы әрекеттескенде көмірқышқыл газы бөлініп, қамырды жұмсақ әрі кеуекті етеді.',
      ru: 'При взаимодействии гидрокарбоната натрия с кислотой выделяется углекислый газ, создающий пористую и пышную структуру выпечки.',
      en: 'The reaction between sodium bicarbonate and acid releases carbon dioxide gas, creating airy and fluffy baked goods.',
    },
    body: {
      kk: [
        'Әрбір үйдегі асхана — нағыз шағын химиялық зертхана. Бәліштер, торттар мен пирогтар пісіргенде аспаздардың ас содасын сірке суымен немесе айранмен араластырып «сөндіретінін» көрген боларсыз. Неліктен бұл қоспа бірден көпіріп, шиқылдай бастайды?',
        'Ас содасының ғылыми атауы — натрий гидрокарбонаты (NaHCO₃). Бұл көмір қышқылының қышқылдық тұзы. Оған кез келген қышқылды (сірке қышқылы CH₃COOH, айрандағы сүт қышқылы немесе лимон қышқылы) қосқан кезде жылдам бейтараптану реакциясы жүреді.',
        'Реакция нәтижесінде тұрақсыз көмір қышқылы (H₂CO₃) түзіліп, ол сол сәтте су (H₂O) мен көмірқышқыл газына (CO₂) ыдырайды. Түзілген газ көпіршіктері пештегі жоғары температурада ұлғайып, қамырды көтеріп, пісірілген өнімді жұмсақ әрі кеуекті етеді.',
      ],
      ru: [
        'Кухня — это настоящая домашняя химическая лаборатория. При приготовлении блинов, пышных пирогов и кексов мы часто видим, как соду «гасят» уксусом или добавляют в кефир. Почему происходит бурное шипение и выделение пены?',
        'Питьевая сода — это гидрокарбонат натрия (NaHCO₃), кислая соль угольной кислоты. При добавлении любой органической или минеральной кислоты (уксусной CH₃COOH, молочной из кефира или лимонной) происходит мгновенное взаимодействие.',
        'В результате реакция нейтрализации приводит к образованию нестабильной угольной кислоты H₂CO₃, которая сразу же распадается на воду и углекислый газ CO₂. Пузырьки газа расширяются при высокой температуре в духовке, создавая воздухопроницаемую, пышную текстуру теста.',
      ],
      en: [
        'The kitchen is a true home chemistry lab. When making pancakes or cakes, baking soda is often "quenched" with vinegar or mixed into buttermilk. Why does it fizz furiously?',
        'Baking soda is chemically known as sodium bicarbonate (NaHCO₃). When mixed with an acid (acetic acid in vinegar, lactic acid in yogurt, or citric acid), a rapid acid-base reaction occurs.',
        'This forms unstable carbonic acid (H₂CO₃), which instantly decomposes into water and carbon dioxide gas (CO₂). The trapped gas bubbles expand under oven heat, creating a fluffy and porous baked product.',
      ],
    },
    reaction: {
      equation: '$\\text{NaHCO}_3 + \\text{CH}_3\\text{COOH} \\rightarrow \\text{CH}_3\\text{COONa} + \\text{H}_2\\text{O} + \\text{CO}_2\\uparrow$',
      type: {
        kk: 'Алмасу және ыдырау реакциясы',
        ru: 'Реакция обмена с последующим разложением',
        en: 'Double displacement followed by decomposition',
      },
      explanation: {
        kk: [
          '1) NaHCO₃ тұзы CH₃COOH қышқылымен әрекеттеседі.',
          '2) Түзілген H₂CO₃ лезде H₂O мен CO₂ газына ыдырайды.',
          '3) CO₂ газы қамырды көтереді.',
        ],
        ru: [
          '1) Гидрокарбонат натрия реагирует с уксусной кислотой.',
          '2) Образующаяся угольная кислота распадается на воду и газ CO₂.',
          '3) Выделяющийся углекислый газ разрыхляет тесто.',
        ],
        en: [
          '1) Sodium bicarbonate reacts with acetic acid.',
          '2) Carbonic acid splits into water and carbon dioxide.',
          '3) Evolving CO₂ gas expands the batter.',
        ],
      },
      balancerEquation: 'NaHCO3 + CH3COOH = CH3COONa + H2O + CO2',
    },
    tryIt: {
      title: {
        kk: 'Шарды көмірқышқыл газымен үрлеу тәжірибесі',
        ru: 'Опыт: Надувание шарика газом из соды',
        en: 'Experiment: Inflating a Balloon with Baking Soda',
      },
      itemsNeeded: {
        kk: ['Пластик бөтелке', '2 ас қасық ас содасы', '100 мл сірке суы', 'Әуе шары'],
        ru: ['Пластиковая бутылка', '2 ст. ложки соды', '100 мл уксуса', 'Воздушный шарик'],
        en: ['Plastic bottle', '2 tbsp baking soda', '100 mL vinegar', 'Rubber balloon'],
      },
      steps: {
        kk: [
          '1) Бөтелкеге 100 мл сірке суын құйыңыз.',
          '2) Шұңғылша көмегімен шардың ішіне 2 ас қасық ас содасын салыңыз.',
          '3) Шардың аузын бөтелке мойнына кигізіп, соданы бөтелкеге қарай төгіңіз.',
        ],
        ru: [
          '1) Налейте в бутылку 100 мл столового уксуса.',
          '2) Засыпьте через воронку в шарик 2 ложки соды.',
          '3) Натяните горлышко шарика на бутылку и высыпьте соду внутрь.',
        ],
        en: [
          '1) Pour 100 mL vinegar into the bottle.',
          '2) Fill the balloon with 2 tbsp baking soda.',
          '3) Fit the balloon over the bottle neck and drop the soda in.',
        ],
      },
      result: {
        kk: 'Шар бөлінген көмірқышқыл газының әсерінен өздігінен үрленеді!',
        ru: 'Шарик быстро надуется выделившимся газом CO₂!',
        en: 'The balloon instantly inflates with CO₂ gas!',
      },
      explanation: {
        kk: 'Бөлінген көмірқышқыл газы бөтелке ішіндегі қысымды арттырып, шардың қабырғасын керіп үрлейді.',
        ru: 'Выделившийся углекислый газ создает давление и надувает оболочку шара.',
        en: 'Generated carbon dioxide creates gas pressure inside the bottle, inflating the balloon.',
      },
      safetyWarning: {
        kk: 'Тәжірибені ересектердің қарауымен жасаңыз. Сірке суын көзге тигізбеңіз!',
        ru: 'Проводите опыт только с разрешения взрослых. Избегайте попадания уксуса в глаза!',
        en: 'Perform only with adult supervision. Keep vinegar away from eyes!',
      },
    },
    didYouKnow: {
      kk: 'Ежелгі Мысырда табиғи соданы (натрон) нан пісіруге емес, мумияларды бальзамдауға және жуу құралы ретінде пайдаланған.',
      ru: 'В Древнем Египте природную соду использовали не для выпечки, а для мумификации и стирки.',
      en: 'In Ancient Egypt, natural soda (natron) was used for mummification and washing rather than baking.',
    },
    quiz: [
      {
        question: {
          kk: 'Ас содасының химиялық формуласы қандай?',
          ru: 'Какова химическая формула питьевой соды?',
          en: 'What is the chemical formula of baking soda?',
        },
        options: {
          kk: ['NaHCO₃', 'Na₂CO₃', 'NaCl', 'NaOH'],
          ru: ['NaHCO₃', 'Na₂CO₃', 'NaCl', 'NaOH'],
          en: ['NaHCO₃', 'Na₂CO₃', 'NaCl', 'NaOH'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'NaHCO₃ — натрий гидрокарбонаты (ас содасы).',
          ru: 'NaHCO₃ — гидрокарбонат натрия.',
          en: 'NaHCO₃ is sodium bicarbonate.',
        },
      },
      {
        question: {
          kk: 'Қамырдың көтеріліп жұмсақ болуына қай газ жауапты?',
          ru: 'Какой газ отвечает за пышность теста?',
          en: 'Which gas causes dough to rise?',
        },
        options: {
          kk: ['O₂', 'CO₂', 'N₂', 'H₂'],
          ru: ['O₂', 'CO₂', 'N₂', 'H₂'],
          en: ['O₂', 'CO₂', 'N₂', 'H₂'],
        },
        correctAnswer: 1,
        explanation: {
          kk: 'Көмірқышқыл газы (CO₂) қамыр ішінде кеуекті құрылым түзеді.',
          ru: 'Углекислый газ CO₂ расширяется и поднимает тесто.',
          en: 'Carbon dioxide CO₂ gas bubbles expand the dough.',
        },
      },
    ],
    relatedElements: ['Na', 'C', 'H', 'O'],
    relatedSection: 'balancer',
  },

  // 2. Iron Rusting
  {
    slug: 'iron-rust-corrosion',
    topic: 'home',
    readingTime: 5,
    date: '2026-09-16',
    coverSvgKey: 'iron_rust',
    title: {
      kk: 'Темір неге тот басады және коррозиядан қалай қорғануға болады?',
      ru: 'Ржавление железа: почему металл разрушается и как его защитить?',
      en: 'Iron Rusting: Why Metals Corrode and How to Protect Them',
    },
    summary: {
      kk: 'Тот басу — металдың оттек пен судың қатысуымен жүретін электрохимиялық тотығуы. Ол жыл сайын әлемдік темір бұйымдардың 20%-ын істен шығарады.',
      ru: 'Ржавление — электрохимическое окисление железа во влажном воздухе, уничтожающее до 20% мирового металла ежегодно.',
      en: 'Rusting is the electrochemical oxidation of iron in moist air that degrades 20% of global iron annually.',
    },
    body: {
      kk: [
        'Далада қалған ескі велосипед, темір қоршаулар немесе шегелер уақыт өте келе қызғылт-қоңыр қабыршақпен қапталып, біртіндеп үгітіліп бұзылады. Бұл процесс коррозия немесе темірдің тот басуы деп аталады.',
        'Тот басу — сулы және ылғалды ортада жүретін күрделі электрохимиялық процесс. Таза темір (Fe) ауадағы оттекпен (O₂) және ылғалмен (H₂O) қатар әрекеттескенде тотығады.',
        'Түзілген гидратталған темір(III) оксиді Fe₂O₃·nH₂O кеуекті әрі борпылдақ болғандықтан, металдың ішкі қабаттарын қорғай алмайды. Сондықтан бұйымдарды сырлау, мырышпен қаптау (мырыштау) және протекторлық әдістер арқылы тоттанудан сақтайды.',
      ],
      ru: [
        'Оставленный на улице старый велосипед или гвоздь со временем покрываются бурым рыхлым налётом и разрушаются. Этот процесс называют коррозией или ржавлением железа.',
        'Коррозия представляет собой сложный электрохимический процесс. Железо реагирует одновременно с кислородом воздуха O₂ и водой H₂O.',
        'Образующийся гидратированный оксид железа Fe₂O₃·nH₂O рыхлый и не защищает внутренние слои, поэтому металл разрушается полностью. Основные методы защиты: покраска, оцинкование и протекторная защита.',
      ],
      en: [
        'An old bicycle left outdoors gradually becomes coated with a reddish-brown flaky crust. This destructive phenomenon is known as iron corrosion or rusting.',
        'Rusting is a complex electrochemical process requiring both atmospheric oxygen (O₂) and water (H₂O).',
        'The resulting hydrated iron(III) oxide Fe₂O₃·nH₂O is porous and flaky, allowing corrosion to penetrate deep into the metal. Protection methods include painting, galvanization, and sacrificial anode protection.',
      ],
    },
    reaction: {
      equation: '$4\\text{Fe} + 3\\text{O}_2 + 6\\text{H}_2\\text{O} \\rightarrow 4\\text{Fe(OH)}_3$',
      type: {
        kk: 'Тотығу-тотықсыздану реакциясы',
        ru: 'Окислительно-восстановительная реакция',
        en: 'Redox reaction',
      },
      explanation: {
        kk: [
          '1) Темір атомы электрондарын беріп Fe³⁺ күйіне дейін тотығады.',
          '2) Оттек электрондарды қосып алып O²⁻ күйіне дейін тотықсызданады.',
          '3) Нәтижесінде темір(III) гидроксиді (тот) түзіледі.',
        ],
        ru: [
          '1) Железо отдаёт электроны и окисляется до Fe³⁺.',
          '2) Кислород принимает электроны и восстанавливается.',
          '3) Образуется ржавчина Fe(OH)₃.',
        ],
        en: [
          '1) Iron loses electrons and oxidizes to Fe³⁺.',
          '2) Oxygen accepts electrons and reduces.',
          '3) Forms iron hydroxide rust.',
        ],
      },
      balancerEquation: '4Fe + 3O2 + 6H2O = 4Fe(OH)3',
    },
    tryIt: {
      title: {
        kk: 'Шегенің қай ортада тез тот басатынын зерттеу',
        ru: 'Опыт: Где гвоздь ржавеет быстрее?',
        en: 'Experiment: What Makes Iron Rust Faster?',
      },
      itemsNeeded: {
        kk: ['3 мөлдір шыны стақан', '3 темір шеге', 'Су, ас тұзы, өсімдік майы'],
        ru: ['3 стакана', '3 железных гвоздя', 'Вода, соль, растительное масло'],
        en: ['3 clear glasses', '3 iron nails', 'Water, salt, vegetable oil'],
      },
      steps: {
        kk: [
          '1) 1-стақанға кәдімгі ағын су құйып, шеге салыңыз.',
          '2) 2-стақанға тұзды су құйып, шеге салыңыз.',
          '3) 3-стақанға қайнатылған су құйып, шеге салып, бетіне өсімдік майын құйыңыз (ауа тимейтіндей етіп).',
        ],
        ru: [
          '1) В 1-й стакан налейте обычную воду.',
          '2) Во 2-й стакан — солёную воду.',
          '3) В 3-й стакан — кипячёную воду и слой масла сверху (без доступа воздуха).',
        ],
        en: [
          '1) Glass 1: tap water.',
          '2) Glass 2: salt water.',
          '3) Glass 3: boiled water topped with a layer of oil (no oxygen access).',
        ],
      },
      result: {
        kk: 'Тұзды судағы шеге 1 күн ішінде тот басады, ал май астындағы қайнатылған судағы шеге жылтыр қалпында сақталады!',
        ru: 'В солёной воде гвоздь заржавеет быстрее всего, а под слоем масла останется блестящим!',
        en: 'The nail in salt water rusts fastest, while under oil it stays completely clean!',
      },
      explanation: {
        kk: 'Тұз иондары ерітіндінің электрөткізгіштігін арттырып реакцияны тездетеді, ал май қабаты еріген оттектің өтуіне толық тосқауыл болады.',
        ru: 'Ионы соли ускоряют электрохимическую реакцию, а масло перекрывает доступ кислорода.',
        en: 'Salt ions increase conductivity to speed up rusting, while oil seals out dissolved oxygen.',
      },
      safetyWarning: {
        kk: 'Өткір шегелермен жұмыс істегенде сақ болыңыз!',
        ru: 'Будьте осторожны с острыми гвоздями!',
        en: 'Handle sharp nails carefully!',
      },
    },
    didYouKnow: {
      kk: 'Үндістандағы Дели қаласында 1600 жыл бұрын соғылған таза темір бағана жоғары тазалығы мен бетіндегі қорғаныш фосфат қабатының арқасында әлі күнге дейін тоттанбаған.',
      ru: 'Железная колонна в Дели возрастом более 1600 лет почти не подверглась коррозии благодаря высокой чистоте металла и фосфорной плёнке.',
      en: 'The 1600-year-old Iron Pillar of Delhi has resisted corrosion due to a protective passive phosphate film.',
    },
    quiz: [
      {
        question: {
          kk: 'Темірдің тот басуы үшін қандай екі зат міндетті түрде қажет?',
          ru: 'Какие два вещества обязательны для ржавления железа?',
          en: 'Which two substances are required for iron to rust?',
        },
        options: {
          kk: ['Оттек пен су', 'Азот пен су', 'Көмірқышқыл газы мен жарық', 'Сутек пен тұз'],
          ru: ['Кислород и вода', 'Азот и вода', 'Углекислый газ и свет', 'Водород и соль'],
          en: ['Oxygen and water', 'Nitrogen and water', 'Carbon dioxide and light', 'Hydrogen and salt'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'O₂ және H₂O болмаса тот басу процесі жүрмейді.',
          ru: 'Без кислорода и воды ржавчина не образуется.',
          en: 'Without oxygen and water, rust cannot form.',
        },
      },
    ],
    relatedElements: ['Fe', 'O', 'H'],
    relatedSection: 'periodic',
  },

  // 3. Toothpaste
  {
    slug: 'toothpaste-chemistry-fluoride',
    topic: 'health',
    readingTime: 4,
    date: '2026-09-17',
    coverSvgKey: 'toothpaste',
    title: {
      kk: 'Тіс пастасының құрамы қандай және фтор тісті қалай қорғайды?',
      ru: 'Что в зубной пасте и почему фтор защищает эмаль от кариеса?',
      en: 'What Is Inside Toothpaste and How Fluoride Protects Enamel',
    },
    summary: {
      kk: 'Тіс пастасындағы фторид иондары тіс эмаліндегі гидроксиапатитті қышқылға төзімді фторапатитке айналдырып, тіс жегісінің (кариестің) алдын алады.',
      ru: 'Фториды в зубной пасте замещают гидроксид-ионы в эмали, превращая гидроксиапатит в стойкий к кислотам фторапатит.',
      en: 'Fluoride ions substitute hydroxide ions in tooth enamel, transforming hydroxyapatite into acid-resistant fluorapatite.',
    },
    body: {
      kk: [
        'Күн сайын таңертең және кешке тіс тазалау — ең маңызды гигиеналық дағдылардың бірі. Адам тісінің эмалі — ағзамыздағы ең қатты ұлпа, ол 96%-ға дейін гидроксиапатит минералынан [Ca₅(PO₄)₃OH] тұрады.',
        'Ауыз қуысындағы бактериялар тағамдағы қантты қоректеніп, органикалық қышқылдар түзеді. Бұл қышқылдар эмальдағы минералдарды ерітіп, деминерализация (эмальдың жұқаруы) процесін туғызады.',
        'Тіс пастасындағы фторид иондары (F⁻) алмасу реакциясына түсіп, гидроксид тобын (OH⁻) алмастырады. Нәтижесінде қышқылдарға анағұрлым төзімді фторапатит [Ca₅(PO₄)₃F] минералы түзіліп, тіс жегісіне жол бермейді.',
      ],
      ru: [
        'Чистка зубов пастой — ежедневный ритуал. Зубная эмаль — самая твёрдая ткань человеческого организма, состоящая на 96% из минерала гидроксиапатита Ca₅(PO₄)₃OH.',
        'Бактерии полости рта питаются сахарами и выделяют органические кислоты. Кислоты растворяют эмаль в процессе деминерализации.',
        'Фторид-ионы F⁻ из зубной пасты вступают в реакцию замещения с эмалью, превращая гидроксиапатит в более устойчивый к кислотам фторапатит Ca₅(PO₄)₃F.',
      ],
      en: [
        'Brushing teeth is a vital hygiene habit. Tooth enamel is the hardest substance in the human body, composed of 96% hydroxyapatite Ca₅(PO₄)₃OH.',
        'Oral bacteria feed on dietary sugars and secrete organic acids, causing enamel demineralization.',
        'Fluoride ions F⁻ in toothpaste replace hydroxide groups to convert hydroxyapatite into fluorapatite Ca₅(PO₄)₃F, which resists acid decay.',
      ],
    },
    didYouKnow: {
      kk: 'Адамның тіс эмалінің қаттылығы Моос шкаласы бойынша 5 балға тең — бұл табиғи апатит минералы мен болаттың қаттылығымен бірдей.',
      ru: 'Твёрдость зубной эмали составляет около 5 по шкале Мооса — это сравнимо с апатитом и сталью.',
      en: 'Tooth enamel scores 5 on the Mohs mineral hardness scale, matching steel and apatite.',
    },
    quiz: [
      {
        question: {
          kk: 'Тіс эмалін қышқылдық ортаға төзімді ететін негізгі элемент ионы қандай?',
          ru: 'Ион какого элемента делает эмаль устойчивой к кислотам?',
          en: 'Which ion makes tooth enamel acid-resistant?',
        },
        options: {
          kk: ['Фторид ионы (F⁻)', 'Хлорид ионы (Cl⁻)', 'Натрий ионы (Na⁺)', 'Сульфат ионы (SO₄²⁻)'],
          ru: ['Фторид-ион (F⁻)', 'Хлорид-ион (Cl⁻)', 'Ион натрия (Na⁺)', 'Сульфат-ион'],
          en: ['Fluoride ion (F⁻)', 'Chloride ion (Cl⁻)', 'Sodium ion (Na⁺)', 'Sulfate ion'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Фторид иондары гидроксиапатитті берік әрі қышқылға төзімді фторапатитке айналдырады.',
          ru: 'Фториды образуют стойкий фторапатит.',
          en: 'Fluorides form acid-resistant fluorapatite.',
        },
      },
    ],
    relatedElements: ['Ca', 'F', 'P', 'O'],
  },

  // 4. Soap & Surfactants
  {
    slug: 'soap-surfactants-chemistry',
    topic: 'home',
    readingTime: 4,
    date: '2026-09-18',
    coverSvgKey: 'soap_surfactants',
    title: {
      kk: 'Сабын мен беттік-белсенді заттар май мен кірді қалай кетіреді?',
      ru: 'Мыло и ПАВ: как химические молекулы растворяют жир и смывают грязь?',
      en: 'Soap and Surfactants: How Molecules Dissolve Grease and Dirt',
    },
    summary: {
      kk: 'Сабын молекулалары қос табиғатты (дифильді): гидрофобты құйрығы майды ұстайды, ал гидрофильді басы суға тартылып, мицелла түзеді.',
      ru: 'Молекулы ПАВ амфифильны: гидрофобный хвост связывает жир, а гидрофильная голова цепляется за воду, формируя мицеллы.',
      en: 'Surfactants are amphiphilic: a hydrophobic tail binds grease while a hydrophilic head interacts with water to form micelles.',
    },
    body: {
      kk: [
        'Қолды тек таза сумен жуғанда май мен кір кетпейді, себебі су молекулалары полярлы, ал майлар — полярсыз заттар. Химияның басты заңы: «ұқсас заттар ұқсастарда ериді».',
        'Сабын — жоғары карбон қышқылдарының натрий немесе калий тұздары (R-COONa). Сабын молекуласы қос табиғатқа ие: полярлы гидрофильді басы сумен байланысады, ал ұзын көмірсутекті гидрофобты құйрығы майлы даққа енеді.',
        'Май тамшысын айнала қоршаған сабын молекулалары «мицелла» деп аталатын шар пішінді құрылым түзеді. Сумен шайған кезде мицеллалар су ағынымен бірге оңай жуылып кетеді.',
      ],
      ru: [
        'Обычной водой смыть жир невозможно, так как вода полярна, а жиры неполярны. Известное химическое правило гласит: «подобное растворяется в подобном».',
        'Мыло — это натриевые или калиевые соли высших карбоновых кислот R-COONa. Его молекула дифильна.',
        'Длинный углеводородный хвост (гидрофобный) внедряется в капельку жира, а заряженная головка (гидрофильная) остаётся снаружи в контакте с водой. Образуется мицелла, которая легко уносится водой.',
      ],
      en: [
        'Water alone cannot wash away grease because water is polar while fats are nonpolar. The fundamental chemical rule is "like dissolves like".',
        'Soaps are sodium salts of fatty acids (R-COONa). Their molecules have dual solubility properties (amphiphilic).',
        'The hydrophobic hydrocarbon tail dissolves inside grease droplets, while the hydrophilic carboxylate head faces outward into water, forming a spherical micelle that washes away effortlessly.',
      ],
    },
    didYouKnow: {
      kk: 'Алғашқы сабын бұдан 4500 жыл бұрын Ежелгі Вавилонда ағаш күлі мен мал майын бірге қайнату арқылы алынған.',
      ru: 'Первое мыло варили в древнем Вавилоне более 4500 лет назад из древесной золы и животного жира.',
      en: 'The earliest recorded soap was produced in ancient Babylon around 2800 BC from wood ash and animal fats.',
    },
    quiz: [
      {
        question: {
          kk: 'Сабын молекуласының май бөлшегіне еніп байланысатын бөлігі қалай аталады?',
          ru: 'Какая часть молекулы мыла связывается с жиром?',
          en: 'Which part of a soap molecule binds to grease?',
        },
        options: {
          kk: ['Гидрофобты көмірсутекті құйрығы', 'Гидрофильді иондық басы', 'Су молекулалары', 'Калий катионы'],
          ru: ['Гидрофобный хвост', 'Гидрофильная головка', 'Ионы воды', 'Ион калия'],
          en: ['Hydrophobic tail', 'Hydrophilic head', 'Water ions', 'Potassium ion'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Полярсыз гидрофобты құйрық полярсыз май бөлшегінде оңай ериді.',
          ru: 'Гидрофобный хвост внедряется в жировое загрязнение.',
          en: 'The nonpolar hydrophobic tail dissolves in grease.',
        },
      },
    ],
    relatedElements: ['Na', 'K', 'C', 'H', 'O'],
  },

  // 5. Carbonated Water
  {
    slug: 'carbonated-water-chemistry',
    topic: 'kitchen',
    readingTime: 3,
    date: '2026-09-19',
    coverSvgKey: 'carbonated_water',
    title: {
      kk: 'Газдалған су неге шисылдайды және бөтелкені ашқанда не болады?',
      ru: 'Почему шипит газировка: химия углекислого газа под давлением',
      en: 'Why Does Fizzy Soda Fizz? The Chemistry of Pressurized CO₂',
    },
    summary: {
      kk: 'Газдалған сусындарда CO₂ газы жоғары қысыммен ерітіледі. Қақпақты ашқанда Генри заңы бойынша қысым түсіп, газ көпіршіктеніп бөлінеді.',
      ru: 'В газировке газ CO₂ растворён под высоким давлением. При открытии крышки давление падает (закон Генри) и газ бурля выходит из раствора.',
      en: 'Carbon dioxide is dissolved under high pressure in sodas. Opening the cap drops the pressure, causing CO₂ gas to bubble out.',
    },
    body: {
      kk: [
        'Лимонад немесе минералды су бөтелкесін ашқан кезде сыздықтап шыққан дыбыс пен көпіршіктер ағынын көреміз. Бұл қандай химиялық құбылыс?',
        'Өндіріс орындарында көмірқышқыл газы (CO₂) сұйықтыққа жоғары қысыммен (шамамен 3-4 атмосфера) енгізіледі. Генри заңы бойынша: газдың ерігіштігі сұйықтық үстіндегі қысымға тура пропорционал.',
        'Бөтелкенің қақпағын ашқан сәтте қысым кенеттен атмосфералық деңгейге дейін түседі. Газдың судағы ерігіштігі азайып, артық көмірқышқыл газы көпіршіктер түрінде сыртқа ұмтылады.',
      ],
      ru: [
        'При открывании бутылки лимонада или минеральной воды мы слышим громкое шипение и видим бурный рост пузырьков.',
        'На заводе углекислый газ CO₂ закачивается в жидкость под высоким давлением (до 4 атмосфер). Согласно закону Генри, растворимость газа пропорциональна давлению над раствором.',
        'Как только мы снимаем пробку, давление внутри падает до атмосферного, растворимость CO₂ резко снижается, и газ стремительно выходит в виде пузырьков.',
      ],
      en: [
        'Opening a carbonated drink creates an instant hiss and cascade of rising gas bubbles.',
        'Factories force carbon dioxide gas into liquids under high pressure (3-4 atm). Henry\'s Law dictates that gas solubility is directly proportional to pressure.',
        'Uncapping the bottle drops pressure to atmospheric level, dramatically reducing CO₂ solubility and releasing gas bubbles.',
      ],
    },
    didYouKnow: {
      kk: 'Суда ең жақсы еритін газ — аммиак (1 литр суда 700 литр NH₃ ериді), ал көмірқышқыл газы (CO₂) 1 литр суда тек 1.7 литр мөлшерінде ериді.',
      ru: 'Самый растворимый в воде газ — аммиак (700 литров в 1 литре воды!), а CO₂ растворяется около 1.7 литра.',
      en: 'Ammonia is the most soluble gas in water (700 L per 1 L of water), whereas CO₂ dissolves at about 1.7 L per 1 L.',
    },
    quiz: [
      {
        question: {
          kk: 'Газдың сұйықтықтағы ерігіштігінің қысымға тәуелділігін қай заң сипаттайды?',
          ru: 'Какой закон описывает связь растворимости газа с давлением?',
          en: 'Which law describes the relationship between gas solubility and pressure?',
        },
        options: {
          kk: ['Генри заңы', 'Менделеев-Клапейрон заңы', 'Авогадро заңы', 'Бойль-Мариотт заңы'],
          ru: ['Закон Генри', 'Закон Менделеева-Клапейрона', 'Закон Авогадро', 'Закон Бойля-Мариотта'],
          en: ['Henry\'s Law', 'Ideal Gas Law', 'Avogadro\'s Law', 'Boyle\'s Law'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Генри заңы: еріген газдың концентрациясы қысымға тура пропорционал (C = k · P).',
          ru: 'Закон Генри утверждает: C = k * P.',
          en: 'Henry\'s Law states that gas solubility depends on pressure.',
        },
      },
    ],
    relatedElements: ['C', 'O', 'H'],
  },

  // 6. Photosynthesis
  {
    slug: 'photosynthesis-biochemistry',
    topic: 'nature',
    readingTime: 5,
    date: '2026-09-20',
    coverSvgKey: 'photosynthesis',
    title: {
      kk: 'Фотосинтез: жасыл жапырақтар оттекті қалай түзеді?',
      ru: 'Фотосинтез: как зелёный лист превращает солнечный свет в кислород и глюкозу?',
      en: 'Photosynthesis: How Green Leaves Turn Sunlight into Oxygen',
    },
    summary: {
      kk: 'Фотосинтез — жарық пен хлорофилл әсерінен көмірқышқыл газы мен судан глюкоза мен оттектің түзілу биохимиялық процесі.',
      ru: 'Фотосинтез — биохимический процесс синтеза глюкозы C₆H₁₂O₆ из CO₂ и H₂O под действием света и хлорофилла с выделением O₂.',
      en: 'Photosynthesis synthesizes glucose C₆H₁₂O₆ from CO₂ and H₂O using light energy and chlorophyll while generating O₂.',
    },
    body: {
      kk: [
        'Жер бетіндегі барлық аэробты тірі ағзалардың тыныс алуы фотосинтез процесіне тікелей байланысты. Өсімдіктер — күн сәулесінің энергиясын химиялық байланыс энергиясына айналдыратын табиғи биохимиялық фабрикалар.',
        'Өсімдік жасушаларының хлоропластарында хлорофилл пигменті болады. Оның порфирин сақинасының орталығында магний ионы (Mg²⁺) орналасқан, ол күн сәулесінің кванттарын жұтады.',
        'Жарық әсерінен судың фотолизі жүріп, көмірқышқыл газы глюкозаға (C₆H₁₂O₆) айналады. Бөлінген оттек (O₂) атмосфераға шығып, биосфераны таза ауамен қамтамасыз етеді.',
      ],
      ru: [
        'Жизнь на Земле существует благодаря фотосинтезу. Зелёные растения являются естественными фотохимическими фабриками.',
        'В хлоропластах растительных клеток содержится хлорофилл — комплексное соединение с ионом магния Mg²⁺ в центре порфиринового кольца.',
        'Под действием квантов света вода фотолизируется, а углекислый газ связывается в глюкозу C₆H₁₂O₆. Кислород O₂ выделяется в атмосферу.',
      ],
      en: [
        'All aerobic life on Earth relies on photosynthesis. Plants serve as planetary photochemical factories.',
        'Chloroplasts inside plant cells contain chlorophyll, a chelated complex with a central magnesium ion Mg²⁺.',
        'Sunlight triggers water photolysis and carbon fixation to produce glucose C₆H₁₂O₆, releasing O₂ gas into the atmosphere.',
      ],
    },
    didYouKnow: {
      kk: 'Жер шарындағы оттектің 70%-дан астамын құрлықтағы ормандар емес, мұхиттардағы микроскопиялық фитопланктондар бөліп шығарады.',
      ru: 'Более 70% кислорода на Земле вырабатывается фитопланктоном в океанах, а не тропическими лесами.',
      en: 'Over 70% of atmospheric oxygen is produced by oceanic phytoplankton rather than rainforests.',
    },
    quiz: [
      {
        question: {
          kk: 'Хлорофилл молекуласының порфирин сақинасының ортасында қай металл ионы орналасқан?',
          ru: 'Ион какого металла находится в центре молекулы хлорофилла?',
          en: 'Which metal ion sits at the center of a chlorophyll molecule?',
        },
        options: {
          kk: ['Магний (Mg²⁺)', 'Темір (Fe²⁺)', 'Кальций (Ca²⁺)', 'Натрий (Na⁺)'],
          ru: ['Магний (Mg²⁺)', 'Железо (Fe²⁺)', 'Кальций (Ca²⁺)', 'Натрий (Na⁺)'],
          en: ['Magnesium (Mg²⁺)', 'Iron (Fe²⁺)', 'Calcium (Ca²⁺)', 'Sodium (Na⁺)'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Магний ионы хлорофилл пигментіне жасыл түс пен жарықты сіңіру қабілетін береді.',
          ru: 'Магний входит в состав порфиринового ядра хлорофилла.',
          en: 'Magnesium sits at the core of the chlorophyll porphyrin ring.',
        },
      },
    ],
    relatedElements: ['Mg', 'C', 'O', 'H'],
  },

  // 7. Fire Extinguisher
  {
    slug: 'fire-extinguisher-chemistry',
    topic: 'industry',
    readingTime: 4,
    date: '2026-09-21',
    coverSvgKey: 'fire_extinguisher',
    title: {
      kk: 'Жану химиясы және өртсөндіргіш құралдардың жұмыс істеу принципі',
      ru: 'Химия горения и огнетушители: как углекислый газ и порошок тушат пламя?',
      en: 'Chemistry of Fire and How Extinguishers Extinguish Flames',
    },
    summary: {
      kk: 'Жану үшін 3 фактор қажет: жанғыш зат, оттек және тұтану температурасы. Өртсөндіргіш оттекті ығыстырып, жану ошағын суытады.',
      ru: 'Горение требует наличия горючего, кислорода и температуры. Огнетушитель перекрывает доступ O₂ и охлаждает очаг.',
      en: 'Fire requires fuel, oxygen, and heat (the fire triangle). Extinguishers isolate O₂ and cool down the fire.',
    },
    body: {
      kk: [
        'Өрт — жылу мен жарық бөле жүретін жылдам экзотермиялық тотығу реакциясы. Өрттің пайда болуы мен сақталуы үшін «жану үшбұрышының» 3 құрамдас бөлігі керек: жанғыш зат, оттек (O₂) және тұтану температурасы.',
        'Көмірқышқылды өртсөндіргіштерде сығылған сұйық CO₂ болады. Оны шашқанда газ жылдам ұлғайып, -78.5°C суық «құрғақ мұз» бөлшектеріне айналады. Ол ауадағы оттекті ығыстырып, оттың температурасын түсіреді.',
        'Ұнтақты өртсөндіргіштер натрий гидрокарбонатын (NaHCO₃) шашады, ол қызудың әсерінен термиялық ыдырап, отты сөндіретін көмірқышқыл газын бөледі.',
      ],
      ru: [
        'Горение — это экзотермическая быстрая реакция окисления. Для поддержания огня необходимы 3 компонента: горючее вещество, кислород O₂ и температура.',
        'Углекислотные огнетушители содержат сжиженный CO₂. При выпуске газ резко расширяется, охлаждаясь до -78°C («сухой лёд»), и вытесняет кислород.',
        'Порошковые огнетушители распыляют гидрокарбонат натрия NaHCO₃, который разлагается от тепла и гасит пламя.',
      ],
      en: [
        'Fire is a rapid exothermic oxidation reaction. It relies on the Fire Triangle: fuel, oxygen, and ignition heat.',
        'Carbon dioxide extinguishers release liquid CO₂ that rapidly expands, cooling to -78°C dry ice snow and displacing oxygen.',
        'Powder extinguishers spray NaHCO₃, which thermal decomposes into CO₂ to smother flames.',
      ],
    },
    didYouKnow: {
      kk: 'Қатты көмірқышқыл газы «құрғақ мұз» деп аталады және ол сұйыққа айналмай, бірден газ күйіне ауысады (сублимацияланады).',
      ru: 'Твёрдый углекислый газ называют «сухим льдом», он сублимирует прямо в газ при -78.5°C.',
      en: 'Solid CO₂ is called "dry ice" and sublimates directly from solid to gas at -78.5°C.',
    },
    quiz: [
      {
        question: {
          kk: '«Жану үшбұрышы» түсінігіне кірмейтін фактор қайсысы?',
          ru: 'Какой фактор НЕ входит в треугольник огня?',
          en: 'Which component is NOT part of the Fire Triangle?',
        },
        options: {
          kk: ['Азот газы', 'Оттек', 'Жанғыш зат (отын)', 'Тұтану температурасы'],
          ru: ['Газ азот', 'Кислород', 'Горючее', 'Температура'],
          en: ['Nitrogen gas', 'Oxygen', 'Fuel', 'Heat/Temperature'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Азот — инертті газ және жану реакциясын қолдамайды.',
          ru: 'Азот N₂ является инертным газом и не поддерживает горение.',
          en: 'Nitrogen gas is inert and does not support combustion.',
        },
      },
    ],
    relatedElements: ['C', 'O', 'Na', 'H'],
  },

  // 8. Acid Rain
  {
    slug: 'acid-rain-environmental-chemistry',
    topic: 'nature',
    readingTime: 4,
    date: '2026-09-22',
    coverSvgKey: 'acid_rain',
    title: {
      kk: 'Қышқылды жаңбырлар: күкірт пен азот оксидтерінің қоршаған ортаға тигізетін зардабы',
      ru: 'Кислотные дожди: как оксиды серы и азота загрязняют атмосферу?',
      en: 'Acid Rain: How Sulfur and Nitrogen Oxides Pollute the Environment',
    },
    summary: {
      kk: 'Өнеркәсіптік SO₂ мен NO₂ газдары атмосферадағы су буымен әрекеттесіп, күкірт және азот қышқылдарын түзеді де, экожүйелерді қышқылдандырады.',
      ru: 'Промышленные выбросы SO₂ и NO₂ реагируют с влагой воздуха, образуя серную и азотную кислоты, разрушающие экосистемы.',
      en: 'Industrial emissions of SO₂ and NO₂ react with atmospheric water vapor, forming sulfuric and nitric acid rain.',
    },
    body: {
      kk: [
        'Зауыттар мен жылу электр орталықтарында (ЖЭО) көмір мен мұнай өнімдерін жаққанда атмосфераға күкірт диоксиді (SO₂) мен азот оксидтері (NO, NO₂) бөлінеді.',
        'Бұл қышқылдық оксидтер бұлттағы су тамшыларымен әрекеттеседі: SO₃ + H₂O → H₂SO₄ (күкірт қышқылы) және 2NO₂ + H₂O → HNO₂ + HNO₃ (азотты және азот қышқылдары).',
        'Қышқылды жауын-шашынның pH мәні 5.6-дан төмен болады. Ол мәрмәр ескерткіштер мен ғимараттарды бұзады, топырақтағы қоректік заттарды шайып, өзен-көлдердегі тіршілікке орасан зор зиян келтіреді.',
      ],
      ru: [
        'Сжигание угля и нефти на ТЭЦ выделяет в атмосферу диоксид серы SO₂ и оксиды азота NO₂.',
        'Эти оксиды соединяются с каплями воды в облаках: SO₃ + H₂O → H₂SO₄ и 2NO₂ + H₂O → HNO₂ + HNO₃.',
        'Кислотные дожди имеют pH ниже 5.6. Они разрушают мраморные памятники, вымывают питательные вещества из почвы и закисляют водоёмы.',
      ],
      en: [
        'Burning fossil fuels releases sulfur dioxide SO₂ and nitrogen oxides NO₂ into the atmosphere.',
        'These acidic oxides dissolve in cloud moisture: SO₃ + H₂O → H₂SO₄ and 2NO₂ + H₂O → HNO₂ + HNO₃.',
        'Acid rain has a pH below 5.6, corroding marble structures, leaching soil nutrients, and acidifying aquatic ecosystems.',
      ],
    },
    didYouKnow: {
      kk: 'Мәрмәр ескерткіштер (CaCO₃) қышқыл жауынның әсерінен ерігіш гипске (CaSO₄) айналып, біртіндеп үгітіліп бұзылады.',
      ru: 'Мраморные статуи из CaCO₃ под действием кислотного дождя превращаются в рыхлый гипс CaSO₄.',
      en: 'Marble statues made of CaCO₃ react with sulfuric acid rain to turn into crumbly gypsum CaSO₄.',
    },
    quiz: [
      {
        question: {
          kk: 'Қышқыл жаңбырлардың түзілуіне себеп болатын басты қышқылдық оксидтер қайсылары?',
          ru: 'Какой оксид является главным виновником кислотных дождей?',
          en: 'Which oxide is a primary cause of acid rain?',
        },
        options: {
          kk: ['SO₂ және NO₂', 'CO₂ және CO', 'CaO және MgO', 'H₂O және O₂'],
          ru: ['SO₂ и NO₂', 'CO₂ и CO', 'CaO и MgO', 'H₂O и O₂'],
          en: ['SO₂ and NO₂', 'CO₂ and CO', 'CaO and MgO', 'H₂O and O₂'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Күкірт пен азот оксидтері сумен қосылып күшті күкірт және азот қышқылдарын түзеді.',
          ru: 'Оксиды серы и азота образуют серную и азотную кислоты.',
          en: 'Sulfur and nitrogen oxides dissolve into strong acids.',
        },
      },
    ],
    relatedElements: ['S', 'N', 'O', 'H'],
  },

  // 9. Batteries
  {
    slug: 'batteries-electrochemistry',
    topic: 'industry',
    readingTime: 5,
    date: '2026-09-23',
    coverSvgKey: 'batteries',
    title: {
      kk: 'Батареялар мен аккумуляторлар электр тогын қалай өндіреді?',
      ru: 'Как работают батарейки и аккумуляторы: электрохимия гальванических элементов',
      en: 'How Batteries Work: Electrochemistry of Galvanic Cells',
    },
    summary: {
      kk: 'Гальвани элементінде химиялық реакцияның энергиясы электр тогына айналады: анодта тотығу, ал катодта тотықсыздану жүреді.',
      ru: 'В гальваническом элементе энергия химической реакции превращается в электрический ток за счёт процессов на аноде и катоде.',
      en: 'A galvanic cell converts chemical energy directly into electricity via spontaneous anode oxidation and cathode reduction.',
    },
    body: {
      kk: [
        'Смартфондар, сағаттар мен электромобильдер химиялық ток көздерінсіз жұмыс істей алмайды. Бұл құрылғылар Даниэль-Якоби гальвани элементінің жұмыс принципіне негізделген.',
        'Батарея екі электродтан тұрады: анод (тотығу процесі жүріп, электрондар бөлінеді) және катод (тотықсыздану процесі жүріп, электрондар қабылданады).',
        'Электрондардың сыртқы тізбек бойымен анодтан катодқа қарай бағытталған қозғалысы электр тогын тудырады.',
      ],
      ru: [
        'Смартфоны и электромобили работают благодаря химическим источникам тока.',
        'Батарейка состоит из двух электродов: анода (где происходит окисление с отдачей электронов) и катода (где происходит восстановление).',
        'Направленный поток электронов по внешней цепи от анода к катоду и есть электрический ток.',
      ],
      en: [
        'Smartphones and electric vehicles rely on electrochemical power cells.',
        'A battery comprises two electrodes: an anode (where oxidation releases electrons) and a cathode (where reduction accepts electrons).',
        'The directed flow of electrons through an external wire creates usable electric current.',
      ],
    },
    didYouKnow: {
      kk: 'Литий-ионды аккумуляторларды ойлап тапқаны және дамытқаны үшін 2019 жылы ғалымдарға химия бойынша Нобель сыйлығы берілді.',
      ru: 'За разработку литий-ионных аккумуляторов в 2019 году была присуждена Нобелевская премия по химии.',
      en: 'The 2019 Nobel Prize in Chemistry was awarded for the development of lithium-ion batteries.',
    },
    quiz: [
      {
        question: {
          kk: 'Гальвани элементінде тотығу (электрон беру) процесі қай электродта жүреді?',
          ru: 'На каком электроде происходит процесс окисления?',
          en: 'At which electrode does oxidation occur?',
        },
        options: {
          kk: ['Анодта', 'Катодта', 'Электролитте', 'Корпуста'],
          ru: ['На аноде', 'На катоде', 'В электролите', 'В корпусе'],
          en: ['At the anode', 'At the cathode', 'In electrolyte', 'On casing'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Анодта әрқашан тотығу (электрон беру) процесі жүреді.',
          ru: 'На аноде всегда происходит окисление.',
          en: 'Anode oxidation always releases electrons.',
        },
      },
    ],
    relatedElements: ['Li', 'Zn', 'Cu', 'Pb'],
  },

  // 10. Food Additives E
  {
    slug: 'food-additives-e-numbers',
    topic: 'health',
    readingTime: 4,
    date: '2026-09-24',
    coverSvgKey: 'food_additives_e',
    title: {
      kk: '«E» таңбалары нені білдіреді: тағамдық қоспалардың химиясы',
      ru: 'Пищевые добавки и индекс «E»: чего стоит бояться, а что абсолютно безопасно?',
      en: 'Food Additives and E-Numbers: What Do They Mean?',
    },
    summary: {
      kk: '«E» индексі Еуропалық қауіпсіздік стандарттарына сәйкестікті білдіреді. Мысалы, E300 — бұл кәдімгі аскорбин қышқылы (С дәрумені).',
      ru: 'Индекс E означает соответствие системе безопасности Европы. Например, E300 — это обычный витамин C (аскорбиновая кислота).',
      en: 'The E-prefix signifies European safety clearance. For example, E300 is simply vitamin C (ascorbic acid).',
    },
    body: {
      kk: [
        'Азық-түлік қаптамасынан «E» әрпі бар сандық белгілерді көргенде көп адам күмәнданады. Шын мәнінде бұл — қауіпсіздігі тексерілген тағамдық қоспалардың халықаралық классификациялық коды.',
        'Тағамдық қоспалардың топтары: E100–E199 — бояғыштар, E200–E299 — консерванттар, E300–E399 — антиоксиданттар (тотығуға қарсы заттар), E400–E499 — тұрақтандырғыштар мен қоюлатқыштар.',
        'Мысалы, E300 — бұл ағзаға пайдалы С дәрумені (аскорбин қышқылы), E500 — кәдімгі ас содасы, ал E330 — лимон қышқылы.',
      ],
      ru: [
        'Буква «E» на этикетках часто пугает покупателей. Однако «E» означает «Europe» и гарантирует проверку добавки.',
        'Классификация: E100-199 — красители, E200-299 — консерванты, E300-399 — антиоксиданты, E400-499 — стабилизаторы.',
        'К примеру, E300 — это витамин C, E500 — питьевая сода, а E330 — лимонная кислота.',
      ],
      en: [
        'The letter "E" on food labels stands for Europe, signifying approved safety evaluations.',
        'Number codes: E100-199 (colorings), E200-299 (preservatives), E300-399 (antioxidants), E400-499 (stabilizers).',
        'For instance, E300 is Vitamin C, E500 is baking soda, and E330 is citric acid.',
      ],
    },
    didYouKnow: {
      kk: 'Кәдімгі жаңа піскен алманың құрамында табиғи түрде E101 (рибофлавин), E300 (аскорбин қышқылы), E296 (алма қышқылы) және E440 (пектин) бар.',
      ru: 'Обычное свежее яблоко содержит природные E101, E300, E296 и E440.',
      en: 'A fresh organic apple naturally contains E101 (riboflavin), E300 (vitamin C), and E296 (malic acid).',
    },
    quiz: [
      {
        question: {
          kk: 'E300 тағамдық қоспасы химияда қандай пайдалы затқа сәйкес келеді?',
          ru: 'Какое вещество скрывается под индексом E300?',
          en: 'Which substance corresponds to index E300?',
        },
        options: {
          kk: ['Аскорбин қышқылы (С дәрумені)', 'Ас содасы', 'Ас тұзы', 'Сірке суы'],
          ru: ['Аскорбиновая кислота (Витамин C)', 'Сода', 'Соль', 'Уксус'],
          en: ['Ascorbic acid (Vitamin C)', 'Baking soda', 'Table salt', 'Vinegar'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'E300 — бұл С дәрумені (аскорбин қышқылы).',
          ru: 'E300 — это полезный витамин C.',
          en: 'E300 is vitamin C.',
        },
      },
    ],
    relatedElements: ['C', 'H', 'O'],
  },

  // 11. Precious Metals
  {
    slug: 'precious-metals-gold-silver-platinum',
    topic: 'industry',
    readingTime: 4,
    date: '2026-09-25',
    coverSvgKey: 'precious_metals',
    title: {
      kk: 'Асыл металдар: алтын, күміс және платинаның химиялық тұрақтылығы',
      ru: 'Благородные металлы: почему золото, серебро и платина не ржавеют?',
      en: 'Precious Metals: Why Gold, Silver, and Platinum Do Not Corrode',
    },
    summary: {
      kk: 'Асыл металдар (Au, Ag, Pt) жоғары оң стандартты электродтық потенциалға ие, сондықтан оттекпен және қарапайым қышқылдармен әрекеттеспейді.',
      ru: 'Благородные металлы имеют высокий положительный стандартный потенциал, поэтому не реагируют с O₂ и большинством кислот.',
      en: 'Noble metals have high positive standard reduction potentials, resisting oxidation by oxygen and standard acids.',
    },
    body: {
      kk: [
        'Алтын (Au), күміс (Ag) және платина (Pt) неге мыңдаған жылдар бойы коррозияға ұшырамай, өзінің табиғи жылтырын жоғалтпайды?',
        'Металдардың белсенділік қатарында (кернеу қатары) бұл металдар ең соңында (сутектен кейін) орналасқан, бұл олардың химиялық инерттілігін көрсетеді.',
        'Алтын азот немесе тұз қышқылдарында жеке ерімейді. Оны тек «патша арағы» (aqua regia) деп аталатын концентрлі азот және тұз қышқылдарының қоспасы (көлемдік қатынасы 1:3) ғана еріте алады.',
      ],
      ru: [
        'Золото Au, серебро Ag и платина Pt ценятся за химическую стойкость.',
        'В электрохимическом ряду напряжений они стоят правее всех, обладая высокими потенциалами.',
        'Растворить золото может только «царская водка» — смесь концентрированных азотной и соляной кислот (1:3).',
      ],
      en: [
        'Gold (Au), silver (Ag), and platinum (Pt) are prized for their extreme chemical resistance.',
        'Positioned at the far right of the reactivity series, they hold high positive reduction potentials.',
        'Gold dissolves only in "aqua regia" — a 1:3 mixture of concentrated nitric and hydrochloric acids.',
      ],
    },
    didYouKnow: {
      kk: '«Патша арағы» алтынды еріткенде сутегі тетрахлораураты [HAuCl₄] (алтын-хлорлысутек қышқылы) деп аталатын кешенді қосылыс түзіледі.',
      ru: 'При растворении золота в царской водке образуется золотохлористоводородная кислота H[AuCl₄].',
      en: 'Dissolving gold in aqua regia forms chloroauric acid H[AuCl₄].',
    },
    quiz: [
      {
        question: {
          kk: 'Алтынды еріте алатын «патша арағы» (aqua regia) қоспасы қандай қышқылдардан тұрады?',
          ru: 'Из каких кислот состоит «царская водка»?',
          en: 'Which acids make up "aqua regia"?',
        },
        options: {
          kk: ['1 көлем HNO₃ және 3 көлем HCl', '1 көлем H₂SO₄ және 1 көлем HCl', '1 көлем HNO₃ және 1 көлем H₂SO₄', '1 көлем CH₃COOH және 3 көлем HCl'],
          ru: ['HNO₃ + 3HCl', 'H₂SO₄ + HCl', 'HNO₃ + H₂SO₄', 'CH₃COOH + HCl'],
          en: ['HNO₃ + 3HCl', 'H₂SO₄ + HCl', 'HNO₃ + H₂SO₄', 'CH₃COOH + HCl'],
        },
        correctAnswer: 0,
        explanation: {
          kk: '1 көлем концентрлі азот қышқылы (HNO₃) және 3 көлем концентрлі тұз қышқылы (HCl).',
          ru: '1 часть азотной и 3 части соляной кислоты.',
          en: '1 part nitric acid to 3 parts hydrochloric acid.',
        },
      },
    ],
    relatedElements: ['Au', 'Ag', 'Pt', 'Cl', 'N'],
  },

  // 12. Salt of Kazakhstan
  {
    slug: 'salt-kazakhstan-aral-sea',
    topic: 'kazakhstan',
    readingTime: 4,
    date: '2026-09-26',
    coverSvgKey: 'salt_aral',
    title: {
      kk: 'Қазақстан тұзы: Арал өңірі мен «Аралтұз» кенішінің химиясы',
      ru: 'Соль Казахстана: химия галита, Аральское море и комбинат «Аралтуз»',
      en: 'Salt of Kazakhstan: Halite Chemistry and the Aral Sea Mineral Industry',
    },
    summary: {
      kk: 'Қазақстанның Арал өңіріндегі NaCl (галит) кен орындары йодталған ас тұзын өндірудің және химия өнеркәсібінің ірі стратегиялық көзі болып табылады.',
      ru: 'Соляные месторождения Аральского региона — гигантский источник галита NaCl для пищевой и химической промышленности.',
      en: 'The salt deposits of Kazakhstan\'s Aral region supply pure halite (NaCl) for food iodization and chemical manufacturing.',
    },
    body: {
      kk: [
        'Қазақстан — табиғи тұз көлдері мен ас тұзының (NaCl) бай қорына ие мемлекет. Арал өңіріндегі Жақсықылыш көлінің шикізат базасында жұмыс істейтін «Аралтұз» комбинаты еліміз бен көршілес мемлекеттерді сапалы тұзбен қамтамасыз етеді.',
        'Ас тұзы — иондық кристалдық торы бар натрий хлориді минералы (галит). Тұрғындар арасында қалқанша безі (зоб) ауруларының алдын алу үшін ас тұзы калий йодатымен (KIO₃) байытылады.',
        'Химия өнеркәсібінде натрий хлориді ерітіндісінің электролизі арқылы аса маңызды өнімдер: хлор газы (Cl₂), сутек (H₂) және күйдіргіш натр (NaOH) алынады.',
      ],
      ru: [
        'Казахстан обладает уникальными соляными озёрами. На базе озера Жаксыкылыш работает комбинат «Аралтұз».',
        'Поваренная соль — это минерал галит (NaCl). Для профилактики дефицита йода в соль добавляют йодат калия KIO₃.',
        'В промышленности электролизом раствора NaCl получают важнейшие продукты: хлор Cl₂, водород H₂ и едкий натр NaOH.',
      ],
      en: [
        'Kazakhstan features world-class salt lakes. The "Araltuz" plant at Lake Zhaksykylysh processes pure halite deposits.',
        'Table salt is sodium chloride (NaCl). To prevent thyroid iodine deficiency, potassium iodate KIO₃ is added.',
        'Industrial electrolysis of aqueous NaCl yields chlorine gas Cl₂, hydrogen H₂, and sodium hydroxide NaOH.',
      ],
    },
    didYouKnow: {
      kk: 'Арал тұз кен орнының галиті 99.8% таза натрий хлоридінен тұрады және халықаралық сапа стандарттарына толық сай келеді.',
      ru: 'Соль Аральского месторождения содержит до 99.8% чистого NaCl без тяжелых примесей.',
      en: 'Aral salt deposits yield up to 99.8% pure NaCl, making it among the purest natural rock salts worldwide.',
    },
    quiz: [
      {
        question: {
          kk: 'Ас тұзын йодтау үшін құрамына қандай тұрақты химиялық қосылыс қосылады?',
          ru: 'Какое вещество добавляют в соль для йодирования?',
          en: 'Which compound is added to salt for iodization?',
        },
        options: {
          kk: ['Калий йодаты (KIO₃)', 'Таза кристалды йод (I₂)', 'Натрий бромиді (NaBr)', 'Кальций хлориді (CaCl₂)'],
          ru: ['Йодат калия (KIO₃)', 'Чистый кристаллический йод (I₂)', 'Бромид натрия', 'Хлорид кальция'],
          en: ['Potassium iodate (KIO₃)', 'Pure elemental iodine (I₂)', 'Sodium bromide', 'Calcium chloride'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'KIO₃ (калий йодаты) — ыстыққа төзімді әрі тұрақты қосылыс.',
          ru: 'KIO₃ — стойкое соединение йода.',
          en: 'KIO₃ is a thermally stable iodizing agent.',
        },
      },
    ],
    relatedElements: ['Na', 'Cl', 'I', 'K'],
  },

  // 13. Oil & Gas Kazakhstan
  {
    slug: 'oil-gas-kazakhstan-chemistry',
    topic: 'kazakhstan',
    readingTime: 5,
    date: '2026-09-27',
    coverSvgKey: 'oil_gas_kz',
    title: {
      kk: 'Қазақстан мұнайы мен газы: Теңіз және Қашаған көмірсутектерінің химиясы',
      ru: 'Нефть и газ Казахстана: химия переработки углеводородов Тенгиза и Карачаганака',
      en: 'Kazakhstan Oil and Gas: Hydrocarbon Chemistry of Tengiz and Kashagan',
    },
    summary: {
      kk: 'Қазақстан мұнайы алкандар мен циклоалкандарға бай. Ректификация және каталитикалық крекинг арқылы жоғары октанды бензин мен өнеркәсіптік шикізаттар алынады.',
      ru: 'Казахстанская нефть богата алканами и циклоалканами. Фракционная перегонка и крекинг превращают сырьё в высокооктановый бензин.',
      en: 'Kazakhstani crude oil is rich in alkanes and cycloalkanes. Fractional distillation and cracking refine it into high-octane gasoline.',
    },
    body: {
      kk: [
        'Қазақстан — әлемдегі көмірсутек шикізатын өндіруші жетекші мемлекеттердің бірі (Теңіз, Қашаған, Қарашығанақ ірі кен орындары).',
        'Шикі мұнай — әртүрлі молекулалық массалы көмірсутектердің (алкандар, циклоалкандар, арендер) күрделі сұйық қоспасы.',
        'Отандық мұнай өңдеу зауыттарында (Атырау, Павлодар, Шымкент) шикізат ректификациялық бағаналарда қайнау температурасы бойынша фракцияларға (газ, бензин, керосин, дизель, мазут) бөлінеді, ал крекинг арқылы мазуттың ұзын тізбектері жоғары сапалы отынға айналдырылады.',
      ],
      ru: [
        'Казахстан входит в топ мировых экспортеров углеводородов (месторождения Тенгиз, Кашаган, Карачаганак).',
        'Сырая нефть — это смесь углеводородов разной молекулярной массы (C_n H_{2n+2}).',
        'На НПЗ (Атырау, Павлодар, Шымкент) нефть проходит ректификацию, а термический и каталитический крекинг расщепляет длинные молекулы мазута в бензин.',
      ],
      en: [
        'Kazakhstan ranks among the top global oil exporters (Tengiz, Kashagan, Karachaganak fields).',
        'Crude oil is a liquid mixture of hydrocarbons (alkanes C_n H_{2n+2}, cycloalkanes, aromatics).',
        'Refineries in Atyrau, Pavlodar, and Shymkent separate crude into fractions and use catalytic cracking to yield high-octane fuels.',
      ],
    },
    didYouKnow: {
      kk: 'Теңіз мұнайында күкіртсутек (H₂S) мөлшері жоғары болғандықтан, өндіріс барысында ілеспе өнім ретінде жылына миллиондаған тонна жоғары тазалықтағы тауарлық сары күкірт (S) бөліп алынады.',
      ru: 'Из-за высокого содержания H₂S на Тенгизе попутно выделяют миллионы тонн товарной серы высокой чистоты.',
      en: 'High H₂S content in Tengiz crude yields millions of tons of pure elemental sulfur byproduct annually.',
    },
    quiz: [
      {
        question: {
          kk: 'Мұнайды қайнау температурасының айырмашылығына қарай фракцияларға бөлу процесі қалай аталады?',
          ru: 'Как называется процесс разделения нефти на фракции по температурам кипения?',
          en: 'What is the process of separating crude oil into fractions by boiling point called?',
        },
        options: {
          kk: ['Ректификация (фракциялық айдау)', 'Гидратация', 'Полимеризация', 'Этерификация'],
          ru: ['Ректификация (перегонка)', 'Гидратация', 'Полимеризация', 'Этерификация'],
          en: ['Fractional distillation', 'Hydration', 'Polymerization', 'Esterification'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Ректификация — фракциялардың қайнау температураларының айырмашылығына негізделген физикалық бөлу әдісі.',
          ru: 'Ректификация разделяет компоненты по температурам кипения.',
          en: 'Fractional distillation separates components by boiling range.',
        },
      },
    ],
    relatedElements: ['C', 'H', 'S'],
  },

  // 14. Water Hardness & Filters
  {
    slug: 'water-hardness-limescale-filters',
    topic: 'home',
    readingTime: 4,
    date: '2026-09-28',
    coverSvgKey: 'water_hardness_filters',
    title: {
      kk: 'Судың кермектігі: шәйнектегі қақ неден пайда болады және сүзгілер қалай жұмыс істейді?',
      ru: 'Жёсткость воды: отчего образуется накипь в чайнике и как работают ионообменные фильтры?',
      en: 'Water Hardness: Limescale Formation and How Ion-Exchange Filters Work',
    },
    summary: {
      kk: 'Судың кермектігі еріген Ca²⁺ және Mg²⁺ иондарынан туындайды. Қайнатқанда еритін гидрокарбонаттар ыдырап, ерімейтін қақ (CaCO₃) тұнбасына айналады.',
      ru: 'Жёсткость обусловлена ионами Ca²⁺ и Mg²⁺. При кипячении гидрокарбонаты выпадают в осадок накипи CaCO₃.',
      en: 'Water hardness is caused by dissolved Ca²⁺ and Mg²⁺ ions. Heating decomposes bicarbonates into insoluble CaCO₃ limescale.',
    },
    body: {
      kk: [
        'Шәйнектің түбіндегі ақ түсті қақ және сабынның нашар көпіруі — судың кермектігі жоғары екенін көрсететін басты белгілер.',
        'Судың уақытша (карбонатты) кермектігі кальций мен магний гидрокарбонаттарынан Ca(HCO₃)₂ болады. Қайнатқан кезде олар термиялық ыдырауға ұшырап, ерімейтін кальций карбонаты CaCO₃ (қақ) түрінде шөгеді.',
        'Тұрмыстық су сүзгілерінде ионалмастырғыш шайырлар (катиониттер) қолданылады: олар судан Ca²⁺ және Mg²⁺ иондарын ұстап қалып, орнына зиянсыз Na⁺ иондарын бөліп, суды жұмсартады.',
      ],
      ru: [
        'Белый налёт на стенках чайника и плохая мылкость воды — признаки высокой жёсткости.',
        'Временная жёсткость вызвана гидрокарбонатами Ca(HCO₃)₂ и Mg(HCO₃)₂. При нагревании они разлагаются: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂↑.',
        'Ионообменные фильтры содержат смолу, которая заменяет ионы Ca²⁺ и Mg²⁺ на ионы Na⁺, умягчая воду.',
      ],
      en: [
        'Limescale build-up inside kettles is caused by high mineral water hardness.',
        'Temporary hardness is due to Ca(HCO₃)₂. Boiling triggers thermal decomposition: Ca(HCO₃)₂ → CaCO₃↓ + H₂O + CO₂↑.',
        'Ion-exchange filters contain resin beads that swap Ca²⁺ and Mg²⁺ ions for harmless Na⁺ ions, softening the water.',
      ],
    },
    reaction: {
      equation: '$\\text{Ca(HCO}_3)_2 \\xrightarrow{t^\\circ} \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O} + \\text{CO}_2\\uparrow$',
      type: {
        kk: 'Термиялық ыдырау реакциясы',
        ru: 'Термическое разложение',
        en: 'Thermal decomposition',
      },
      explanation: {
        kk: ['Қыздырған кезде суда еритін кальций гидрокарбонаты ерімейтін кальций карбонаты тұнбасына (қаққа) айналады.'],
        ru: ['При нагревании растворимый гидрокарбонат превращается в твёрдый карбонат.'],
        en: ['Heating converts soluble bicarbonate into insoluble calcium carbonate.'],
      },
      balancerEquation: 'Ca(HCO3)2 = CaCO3 + H2O + CO2',
    },
    didYouKnow: {
      kk: 'Лимон қышқылы немесе сірке суы шәйнектегі қақты (CaCO₃) еритін кальций цитратына немесе ацетатына айналдырып, тез әрі оңай тазартады.',
      ru: 'Лимонная кислота легко растворяет накипь CaCO₃, превращая её в растворимый цитрат кальция.',
      en: 'Citric acid readily dissolves limescale CaCO₃ by forming soluble calcium citrate.',
    },
    quiz: [
      {
        question: {
          kk: 'Судың уақытша кермектігін жоюдың ең қарапайым әрі қолжетімді тәсілі қандай?',
          ru: 'Какой самый простой способ устранить временную жёсткость воды?',
          en: 'What is the simplest way to remove temporary water hardness?',
        },
        options: {
          kk: ['Суды қайнату', 'Суды мұздату', 'Ас тұзын қосу', 'Күн астында тұндыру'],
          ru: ['Кипячение воды', 'Замораживание', 'Добавление соли', 'Отстаивание на солнце'],
          en: ['Boiling the water', 'Freezing water', 'Adding salt', 'Sunlight exposure'],
        },
        correctAnswer: 0,
        explanation: {
          kk: 'Қайнатқан кезде ерігіш кальций және магний гидрокарбонаттары толық ыдырайды.',
          ru: 'Кипячение разлагает гидрокарбонаты кальция и магния.',
          en: 'Boiling decomposes soluble calcium and magnesium bicarbonates.',
        },
      },
    ],
    relatedElements: ['Ca', 'Mg', 'C', 'O', 'H'],
    relatedSection: 'balancer',
  },
];
