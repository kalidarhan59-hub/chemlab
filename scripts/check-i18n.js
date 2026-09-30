import fs from 'fs';
import path from 'path';

/**
 * ChemLab i18n Verification Script
 * Validates:
 * 1. Key synchronization across kk.json, ru.json, and en.json.
 * 2. Structure & type parity (arrays, objects, strings).
 * 3. All static `t('...')` calls in src/.
 * 4. Known dynamic domain keys (categories, states, blocks, reaction types, reagent types, modules planned).
 */

const LOCALES_DIR = path.resolve('src/locales');
const SRC_DIR = path.resolve('src');

const kk = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'kk.json'), 'utf8'));
const ru = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'ru.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8'));

let hasErrors = false;

console.log('🔍 [ChemLab i18n Check] Starting localization audit...\n');

// 1. Flatten keys helper
function getFlatMap(obj, prefix = '') {
  let map = {};
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(map, getFlatMap(val, fullKey));
    } else {
      map[fullKey] = { val, type: Array.isArray(val) ? 'array' : typeof val };
    }
  }
  return map;
}

const kkMap = getFlatMap(kk);
const ruMap = getFlatMap(ru);
const enMap = getFlatMap(en);

const allKeys = Array.from(new Set([...Object.keys(kkMap), ...Object.keys(ruMap), ...Object.keys(enMap)])).sort();

console.log(`📊 Total unique keys across all locales: ${allKeys.length}`);
console.log(`   - Kazakh (kk): ${Object.keys(kkMap).length} keys`);
console.log(`   - Russian (ru): ${Object.keys(ruMap).length} keys`);
console.log(`   - English (en): ${Object.keys(enMap).length} keys\n`);

// 2. Cross-locale key parity check
console.log('--- 1. Cross-Locale Key & Type Parity ---');
let parityIssuesCount = 0;

for (const key of allKeys) {
  const inKK = key in kkMap;
  const inRU = key in ruMap;
  const inEN = key in enMap;

  if (!inKK || !inRU || !inEN) {
    parityIssuesCount++;
    hasErrors = true;
    console.error(`❌ [Missing Key] "${key}" -> KK: ${inKK ? '✓' : 'MISSING'}, RU: ${inRU ? '✓' : 'MISSING'}, EN: ${inEN ? '✓' : 'MISSING'}`);
  } else {
    // Check type matching
    const typeKK = kkMap[key].type;
    const typeRU = ruMap[key].type;
    const typeEN = enMap[key].type;

    if (typeKK !== typeRU || typeRU !== typeEN) {
      parityIssuesCount++;
      hasErrors = true;
      console.error(`❌ [Type Mismatch] "${key}" -> KK: ${typeKK}, RU: ${typeRU}, EN: ${typeEN}`);
    }
  }
}

if (parityIssuesCount === 0) {
  console.log('✅ All 3 locales (kk, ru, en) are 100% in sync with matching types.\n');
} else {
  console.log(`⚠️ Found ${parityIssuesCount} cross-locale parity issue(s).\n`);
}

// 3. Scan code for static `t('...')` calls
console.log('--- 2. Scanning Codebase for Translation Usage ---');

function scanDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'locales' && entry.name !== '__tests__') {
        files = files.concat(scanDir(full));
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = scanDir(SRC_DIR);
let codeScanIssues = 0;

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(process.cwd(), file);

  // Match t('domain.key')
  const staticRegex = /\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]/g;
  let match;
  while ((match = staticRegex.exec(content)) !== null) {
    const key = match[1];

    // Ignore known non-translation keys if any
    const inKK = key in kkMap;
    const inRU = key in ruMap;
    const inEN = key in enMap;

    if (!inKK || !inRU || !inEN) {
      codeScanIssues++;
      hasErrors = true;
      console.error(`❌ [Missing in Code] ${relPath} calls t('${key}') which is missing in -> KK: ${inKK ? '✓' : 'MISSING'}, RU: ${inRU ? '✓' : 'MISSING'}, EN: ${inEN ? '✓' : 'MISSING'}`);
    }
  }
}

if (codeScanIssues === 0) {
  console.log('✅ All static t(...) calls in codebase exist in all locales.\n');
} else {
  console.log(`⚠️ Found ${codeScanIssues} missing static key(s) in code.\n`);
}

// 4. Dynamic key domain verification
console.log('--- 3. Dynamic Key Domains Verification ---');
const dynamicDomainChecks = [
  { prefix: 'sections', keys: ['periodicTable.title', 'periodicTable.shortDesc', 'periodicTable.badge', 'balancer.title', 'lab.title', 'molecules.title', 'articles.title', 'trainer.title'] },
  { prefix: 'periodicTable.categories', keys: ['all', 'alkali-metal', 'alkaline-earth', 'transition-metal', 'post-transition-metal', 'metalloid', 'reactive-nonmetal', 'halogen', 'noble-gas', 'lanthanide', 'actinide', 'unknown'] },
  { prefix: 'periodicTable.blocks', keys: ['all', 's', 'p', 'd', 'f'] },
  { prefix: 'periodicTable.states', keys: ['all', 'solid', 'liquid', 'gas', 'unknown'] },
  { prefix: 'balancer.reactionTypes', keys: ['synthesis', 'decomposition', 'singleReplacement', 'single_displacement', 'doubleReplacement', 'double_displacement', 'neutralization', 'combustion', 'redox', 'precipitation', 'gas_evolution', 'complexation', 'acid_base', 'general'] },
  { prefix: 'lab.reactionTypes', keys: ['exchange', 'displacement', 'redox', 'neutralization', 'decomposition', 'complex', 'complexation', 'indicator', 'precipitation', 'gas_evolution', 'combustion', 'dissolution', 'thermal_decomposition', 'flame_test', 'synthesis'] },
  { prefix: 'lab.reagentTypes', keys: ['acid', 'base', 'salt', 'metal', 'nonmetal', 'indicator', 'oxide', 'organic', 'water', 'gas'] },
  { prefix: 'modulesPlanned', keys: ['periodicTable', 'balancer', 'lab', 'molecules', 'articles', 'trainer'] },
];

let dynamicDomainIssues = 0;
for (const domain of dynamicDomainChecks) {
  for (const k of domain.keys) {
    const fullKey = `${domain.prefix}.${k}`;
    const inKK = fullKey in kkMap;
    const inRU = fullKey in ruMap;
    const inEN = fullKey in enMap;

    if (!inKK || !inRU || !inEN) {
      dynamicDomainIssues++;
      hasErrors = true;
      console.error(`❌ [Missing Dynamic Domain Key] "${fullKey}" -> KK: ${inKK ? '✓' : 'MISSING'}, RU: ${inRU ? '✓' : 'MISSING'}, EN: ${inEN ? '✓' : 'MISSING'}`);
    }
  }
}

if (dynamicDomainIssues === 0) {
  console.log('✅ All dynamic domain keys verified successfully across all locales.\n');
} else {
  console.log(`⚠️ Found ${dynamicDomainIssues} missing dynamic domain key(s).\n`);
}

// 5. Final summary
if (hasErrors) {
  console.error('💥 [ChemLab i18n Check] FAILED: Localization audit found issues above.');
  process.exit(1);
} else {
  console.log('🎉 [ChemLab i18n Check] PASSED: All 3 locales are 100% complete and valid!');
  process.exit(0);
}
