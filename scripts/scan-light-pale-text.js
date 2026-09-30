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

// Search for text-white, text-slate-100, text-slate-200, text-slate-300, text-slate-400, text-gray-100..400 that appear WITHOUT dark: prefix
// (which makes them applied in LIGHT mode!)
console.log('--- POTENTIAL LIGHT-MODE PALE/INVISIBLE TEXT (light text without dark: or inside non-dark container) ---');

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Look for class names like "text-white", "text-slate-200", "text-slate-300", "text-gray-200", "text-gray-300"
    // that are NOT preceded by `dark:` or on colored buttons/badges (like bg-blue-600, btn-gradient, bg-teal-600, etc.)
    const matches = line.match(/(?<!dark:)\btext-(white|slate-(?:100|200|300|400)|gray-(?:100|200|300|400))\b/g);
    if (matches) {
      // Filter out obvious colored buttons/badges/tags if bg- is present on same line, but print for review
      console.log(`${file}:${idx+1} -> ${matches.join(', ')}`);
      console.log(`    ${line.trim().slice(0, 120)}`);
    }
  });
}
