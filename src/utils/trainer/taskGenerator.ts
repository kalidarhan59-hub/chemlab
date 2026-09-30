import { ExamType, TrainerTask, TopicId } from '../../types/trainer';

interface SubstanceTemplate {
  formula: string;
  name: { kk: string; ru: string; en: string };
  molarMass: number;
}

const SUBSTANCES: SubstanceTemplate[] = [
  { formula: 'CaCO3', name: { kk: 'Кальций карбонаты', ru: 'Карбонат кальция', en: 'Calcium carbonate' }, molarMass: 100.09 },
  { formula: 'H2SO4', name: { kk: 'Күкірт қышқылы', ru: 'Серная кислота', en: 'Sulfuric acid' }, molarMass: 98.08 },
  { formula: 'NaOH', name: { kk: 'Натрий гидроксиді', ru: 'Гидроксид натрия', en: 'Sodium hydroxide' }, molarMass: 40.0 },
  { formula: 'NaCl', name: { kk: 'Натрий хлориді', ru: 'Хлорид натрия', en: 'Sodium chloride' }, molarMass: 58.44 },
  { formula: 'CuSO4', name: { kk: 'Мыс(II) сульфаты', ru: 'Сульфат меди(II)', en: 'Copper(II) sulfate' }, molarMass: 159.61 },
  { formula: 'CO2', name: { kk: 'Көмірқышқыл газы', ru: 'Углекислый газ', en: 'Carbon dioxide' }, molarMass: 44.01 },
  { formula: 'CH4', name: { kk: 'Метан', ru: 'Метан', en: 'Methane' }, molarMass: 16.04 },
  { formula: 'NH3', name: { kk: 'Аммиак', ru: 'Аммиак', en: 'Ammonia' }, molarMass: 17.03 },
  { formula: 'HCl', name: { kk: 'Тұз қышқылы (хлоргаз)', ru: 'Соляная кислота', en: 'Hydrochloric acid' }, molarMass: 36.46 },
  { formula: 'HNO3', name: { kk: 'Азот қышқылы', ru: 'Азотная кислота', en: 'Nitric acid' }, molarMass: 63.01 },
  { formula: 'Fe2O3', name: { kk: 'Темір(III) оксиді', ru: 'Оксид железа(III)', en: 'Iron(III) oxide' }, molarMass: 159.69 },
  { formula: 'Al2(SO4)3', name: { kk: 'Алюминий сульфаты', ru: 'Сульфат алюминия', en: 'Aluminum sulfate' }, molarMass: 342.15 },
  { formula: 'KMnO4', name: { kk: 'Калий перманганаты', ru: 'Перманганат калия', en: 'Potassium permanganate' }, molarMass: 158.03 },
  { formula: 'KOH', name: { kk: 'Калий гидроксиді', ru: 'Гидроксид калия', en: 'Potassium hydroxide' }, molarMass: 56.11 },
  { formula: 'C6H12O6', name: { kk: 'Глюкоза', ru: 'Глюкоза', en: 'Glucose' }, molarMass: 180.16 },
  { formula: 'BaCl2', name: { kk: 'Барий хлориді', ru: 'Хлорид бария', en: 'Barium chloride' }, molarMass: 208.23 },
  { formula: 'MgSO4', name: { kk: 'Магний сульфаты', ru: 'Сульфат магния', en: 'Magnesium sulfate' }, molarMass: 120.37 },
];

const ISOTOPES = [
  { symbol: 'Al', name: { kk: 'Алюминий', ru: 'Алюминий', en: 'Aluminum' }, z: 13, a: 27 },
  { symbol: 'Cl', name: { kk: 'Хлор', ru: 'Хлор', en: 'Chlorine' }, z: 17, a: 35 },
  { symbol: 'Fe', name: { kk: 'Темір', ru: 'Железо', en: 'Iron' }, z: 26, a: 56 },
  { symbol: 'Cu', name: { kk: 'Мыс', ru: 'Медь', en: 'Copper' }, z: 29, a: 64 },
  { symbol: 'Na', name: { kk: 'Натрий', ru: 'Натрий', en: 'Sodium' }, z: 11, a: 23 },
  { symbol: 'K', name: { kk: 'Калий', ru: 'Калий', en: 'Potassium' }, z: 19, a: 39 },
  { symbol: 'Ca', name: { kk: 'Кальций', ru: 'Кальций', en: 'Calcium' }, z: 20, a: 40 },
  { symbol: 'Mg', name: { kk: 'Магний', ru: 'Магний', en: 'Magnesium' }, z: 12, a: 24 },
  { symbol: 'P', name: { kk: 'Фосфор', ru: 'Фосфор', en: 'Phosphorus' }, z: 15, a: 31 },
  { symbol: 'S', name: { kk: 'Күкірт', ru: 'Сера', en: 'Sulfur' }, z: 16, a: 32 },
];

/**
 * Generates an infinite stream of procedural chemical calculation problems for UNT.
 */
export function generateRandomCalculationTask(idSuffix: number = Date.now(), exam: ExamType = 'ent'): TrainerTask {
  const templateType = Math.floor(Math.random() * 6);

  if (templateType === 0) {
    // 1. Molar Mass Calculation
    const sub = SUBSTANCES[Math.floor(Math.random() * SUBSTANCES.length)];
    const roundedMolar = Math.round(sub.molarMass);
    return {
      id: `gen_molar_${idSuffix}`,
      exams: [exam],
      topic: 'calculations',
      difficulty: 'easy',
      type: 'numeric_input',
      condition: {
        kk: `${sub.name.kk} (${sub.formula}) затының молярлық массасын (г/моль) бүтін санға дейін жуықтап есептеңіз:`,
        ru: `Вычислите молярную массу вещества ${sub.name.ru} (${sub.formula}) в г/моль, округлив до целых:`,
        en: `Calculate the molar mass of ${sub.name.en} (${sub.formula}) in g/mol, rounded to whole number:`,
      },
      correctAnswer: roundedMolar,
      tolerance: 1.0,
      unit: { kk: 'г/моль', ru: 'г/моль', en: 'g/mol' },
      hint: {
        kk: 'Периодтық кестедегі элементтердің атомдық массаларын қосыңыз.',
        ru: 'Сложите атомные массы входящих в состав формулы химических элементов.',
        en: 'Sum the standard atomic weights of each element in the chemical formula.',
      },
      solutionSteps: {
        kk: [`Формула: ${sub.formula}`, `M(${sub.formula}) = ${roundedMolar} г/моль.`],
        ru: [`Формула вещества: ${sub.formula}`, `M(${sub.formula}) = ${roundedMolar} г/моль.`],
        en: [`Formula: ${sub.formula}`, `Molar mass M(${sub.formula}) ≈ ${roundedMolar} g/mol.`],
      },
    };
  }

  if (templateType === 1) {
    // 2. Gas volume at STP
    const moles = [0.5, 1, 1.5, 2, 2.5, 3, 5][Math.floor(Math.random() * 7)];
    const volume = Math.round(moles * 22.4 * 10) / 10;
    return {
      id: `gen_gas_${idSuffix}`,
      exams: [exam],
      topic: 'calculations',
      difficulty: 'easy',
      type: 'numeric_input',
      condition: {
        kk: `Қалыпты жағдайда (қ.ж.) мөлшері ${moles} моль болатын кез келген идеал газ қандай көлем (литр) алады?`,
        ru: `Какой объём (в литрах) при нормальных условиях (н.у.) занимает порция идеального газа количеством вещества ${moles} моль?`,
        en: `What volume (in liters) at standard temperature and pressure (STP) is occupied by ${moles} moles of ideal gas?`,
      },
      correctAnswer: volume,
      tolerance: 0.2,
      unit: { kk: 'л', ru: 'л', en: 'L' },
      hint: {
        kk: 'Газдың молярлық көлемі қ.ж. V_m = 22.4 л/моль құрайды (V = n * V_m).',
        ru: 'Молярный объём любого газа при н.у. равен V_m = 22.4 л/моль (V = n * V_m).',
        en: 'Molar volume of gas at STP is V_m = 22.4 L/mol (V = n * V_m).',
      },
      solutionSteps: {
        kk: [`Берілгені: n = ${moles} моль, V_m = 22.4 л/моль.`, `Формула: V = n × V_m = ${moles} × 22.4 = ${volume} л.`],
        ru: [`Дано: n = ${moles} моль, V_m = 22.4 л/моль.`, `Формула: V = n × V_m = ${moles} × 22.4 = ${volume} л.`],
        en: [`Given: n = ${moles} mol, V_m = 22.4 L/mol.`, `Calculation: V = n × V_m = ${moles} × 22.4 = ${volume} L.`],
      },
    };
  }

  if (templateType === 2) {
    // 3. Mass percent calculation in solution
    const saltMass = [10, 20, 25, 30, 40, 50][Math.floor(Math.random() * 6)];
    const waterMass = [90, 180, 175, 270, 160, 200][Math.floor(Math.random() * 6)];
    const solutionMass = saltMass + waterMass;
    const wPercent = Math.round((saltMass / solutionMass) * 100 * 10) / 10;

    return {
      id: `gen_sol_${idSuffix}`,
      exams: [exam],
      topic: 'solutions',
      difficulty: 'medium',
      type: 'numeric_input',
      condition: {
        kk: `${saltMass} г тұзды ${waterMass} г суға еріткенде түзілген ерітіндідегі тұздың массалық үлесін (ω, %) тап:`,
        ru: `Вычислите массовую долю растворенного вещества (ω, %) в растворе, полученном при растворении ${saltMass} г соли в ${waterMass} г воды:`,
        en: `Calculate the mass percentage (w, %) of solute in a solution prepared by dissolving ${saltMass} g of salt in ${waterMass} g of water:`,
      },
      correctAnswer: wPercent,
      tolerance: 0.5,
      unit: { kk: '%', ru: '%', en: '%' },
      hint: {
        kk: 'Ерітінді массасы = тұз массасы + су массасы. ω = (m_тұз / m_ерітінді) * 100%.',
        ru: 'Масса раствора равна сумме масс соли и воды. ω = (m_соли / m_раствора) * 100%.',
        en: 'Mass of solution = mass of solute + mass of water. w = (m_solute / m_solution) * 100%.',
      },
      solutionSteps: {
        kk: [`m_ерітінді = ${saltMass} + ${waterMass} = ${solutionMass} г.`, `ω = (${saltMass} / ${solutionMass}) × 100% = ${wPercent}%.`],
        ru: [`m_раствора = ${saltMass} + ${waterMass} = ${solutionMass} г.`, `ω = (${saltMass} / ${solutionMass}) × 100% = ${wPercent}%.`],
        en: [`m_solution = ${saltMass} + ${waterMass} = ${solutionMass} g.`, `w = (${saltMass} / ${solutionMass}) × 100% = ${wPercent}%.`],
      },
    };
  }

  if (templateType === 3) {
    // 4. Neutrons count in isotope
    const iso = ISOTOPES[Math.floor(Math.random() * ISOTOPES.length)];
    const neutrons = iso.a - iso.z;

    return {
      id: `gen_iso_${idSuffix}`,
      exams: [exam],
      topic: 'atomic_structure',
      difficulty: 'easy',
      type: 'numeric_input',
      condition: {
        kk: `${iso.name.kk} атомының ²⁸_{${iso.z}}^{${iso.a}}${iso.symbol} изотобының ядросындағы нейтрондар санын есептеңіз:`,
        ru: `Укажите число нейтронов в ядре атома изотопа ${iso.name.ru} ²⁸_{${iso.z}}^{${iso.a}}${iso.symbol}:`,
        en: `Find the number of neutrons in the nucleus of isotope ${iso.name.en} ²⁸_{${iso.z}}^{${iso.a}}${iso.symbol}:`,
      },
      correctAnswer: neutrons,
      tolerance: 0,
      hint: {
        kk: 'Нейтрондар саны N = Массалық сан (A) - Атомдық нөмір (Z).',
        ru: 'Число нейтронов N = A - Z.',
        en: 'Number of neutrons N = Mass number A - Atomic number Z.',
      },
      solutionSteps: {
        kk: [`Z (протон) = ${iso.z}`, `A (масса) = ${iso.a}`, `N (нейтрон) = ${iso.a} - ${iso.z} = ${neutrons}.`],
        ru: [`Z (протоны) = ${iso.z}`, `A (масса) = ${iso.a}`, `N (нейтроны) = ${iso.a} - ${iso.z} = ${neutrons}.`],
        en: [`Z (protons) = ${iso.z}`, `A (mass) = ${iso.a}`, `N (neutrons) = ${iso.a} - ${iso.z} = ${neutrons}.`],
      },
    };
  }

  if (templateType === 4) {
    // 5. Mass from moles
    const sub = SUBSTANCES[Math.floor(Math.random() * SUBSTANCES.length)];
    const moles = [0.2, 0.5, 2, 3, 4][Math.floor(Math.random() * 5)];
    const mass = Math.round(moles * sub.molarMass * 10) / 10;

    return {
      id: `gen_mass_${idSuffix}`,
      exams: [exam],
      topic: 'calculations',
      difficulty: 'easy',
      type: 'numeric_input',
      condition: {
        kk: `Зат мөлшері ${moles} моль болатын ${sub.name.kk} (${sub.formula}) массасын (г) есептеңіз:`,
        ru: `Вычислите массу (в граммах) порции вещества ${sub.name.ru} (${sub.formula}) количеством ${moles} моль:`,
        en: `Calculate the mass (in grams) of ${moles} moles of ${sub.name.en} (${sub.formula}):`,
      },
      correctAnswer: mass,
      tolerance: 0.5,
      unit: { kk: 'г', ru: 'г', en: 'g' },
      hint: {
        kk: 'm = n * M.',
        ru: 'Формула: m = n * M.',
        en: 'Formula: m = n * M.',
      },
      solutionSteps: {
        kk: [`M(${sub.formula}) = ${Math.round(sub.molarMass)} г/моль.`, `m = ${moles} × ${Math.round(sub.molarMass)} = ${mass} г.`],
        ru: [`M(${sub.formula}) = ${Math.round(sub.molarMass)} г/моль.`, `m = ${moles} × ${Math.round(sub.molarMass)} = ${mass} г.`],
        en: [`M(${sub.formula}) = ${Math.round(sub.molarMass)} g/mol.`, `m = ${moles} × ${Math.round(sub.molarMass)} = ${mass} g.`],
      },
    };
  }

  // 6. Number of molecules (N = n * Na)
  const moles = [1, 2, 3, 5][Math.floor(Math.random() * 4)];
  const molecules1023 = Math.round(moles * 6.02 * 10) / 10;

  return {
    id: `gen_mol_${idSuffix}`,
    exams: [exam],
    topic: 'calculations',
    difficulty: 'medium',
    type: 'numeric_input',
    condition: {
      kk: `${moles} моль кез келген затка кіретін молекулалар санын (10²³ көбейтіндісіз сан түрінде) жазыңыз:`,
      ru: `Укажите число молекул в порции вещества количеством ${moles} моль (введите коэффициент перед 10²³):`,
      en: `Find the number of molecules in ${moles} moles of substance (enter the coefficient before 10²³):`,
    },
    correctAnswer: molecules1023,
    tolerance: 0.2,
    unit: { kk: '× 10²³', ru: '× 10²³', en: '× 10²³' },
    hint: {
      kk: 'Авогадро тұрақтысы N_A = 6.02 × 10²³ моль⁻¹. N = n * N_A.',
      ru: 'Число Авогадро N_A = 6.02 × 10²³ моль⁻¹. N = n * N_A.',
      en: 'Avogadro constant N_A = 6.02 × 10²³ mol⁻¹. N = n * N_A.',
    },
    solutionSteps: {
      kk: [`N = ${moles} × 6.02 × 10²³ = ${molecules1023} × 10²³ молекула.`],
      ru: [`N = ${moles} × 6.02 × 10²³ = ${molecules1023} × 10²³ молекул.`],
      en: [`N = ${moles} × 6.02 × 10²³ = ${molecules1023} × 10²³ molecules.`],
    },
  };
}
