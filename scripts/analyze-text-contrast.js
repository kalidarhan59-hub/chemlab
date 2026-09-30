import fs from 'fs';
import path from 'path';

function scan(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        results.push(...scan(full));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const files = scan('./src');

const report = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // 1. Text color that is slate-100..400 or gray-100..400 or white WITHOUT dark: prefix
    // Check if line does NOT have bg-slate-900, bg-slate-800, bg-black, bg-teal, bg-indigo, etc.
    const paleMatches = [...line.matchAll(/(?<!dark:)\btext-(white|slate-[1-4]00|gray-[1-4]00|zinc-[1-4]00)\b/g)].map(m => m[0]);
    if (paleMatches.length > 0) {
      report.push({
        type: 'LIGHT_PALE',
        file: path.relative('.', file),
        line: idx + 1,
        matches: paleMatches,
        text: line.trim()
      });
    }

    // 2. Text color that is slate-700..950 or black or gray-700..950 WITHOUT dark: override anywhere on that line
    const darkMatches = [...line.matchAll(/(?<!dark:)\btext-(black|slate-[7-9]00|slate-950|gray-[7-9]00)\b/g)].map(m => m[0]);
    if (darkMatches.length > 0) {
      // Check if dark:text- exists on that line
      if (!line.includes('dark:text-')) {
        report.push({
          type: 'DARK_UNSTYLED',
          file: path.relative('.', file),
          line: idx + 1,
          matches: darkMatches,
          text: line.trim()
        });
      }
    }
  });
}

console.log(`Found ${report.length} potential issues`);
fs.writeFileSync('./scripts/color-report.json', JSON.stringify(report, null, 2));
console.log('Saved to ./scripts/color-report.json');

const lightPaleCount = report.filter(r => r.type === 'LIGHT_PALE').length;
const darkUnstyledCount = report.filter(r => r.type === 'DARK_UNSTYLED').length;
console.log(`LIGHT_PALE: ${lightPaleCount}, DARK_UNSTYLED: ${darkUnstyledCount}`);
