import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist') {
        files = files.concat(scanDir(full));
      }
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const files = scanDir('src');
const lightTextOnLightBg = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // Check className matches with text-slate-100 / text-slate-200 / text-slate-300 / text-slate-400 / text-white / text-gray-100..
    // where it is not preceded by dark: or within a component that is explicitly dark bg like bg-slate-900 or bg-slate-950
    const regex = /(?<!dark:)(text-(?:slate|gray|neutral)-(?:100|200|300|400)|(?<!dark:)text-white)\b/g;
    let m;
    while ((m = regex.exec(line)) !== null) {
      // check if the line itself or previous lines have a dark bg class like bg-slate-900, bg-slate-800, bg-black, bg-teal-500, btn, etc.
      lightTextOnLightBg.push({
        file: path.relative('.', file),
        line: idx + 1,
        token: m[1],
        code: line.trim()
      });
    }
  });
}

console.log(`Found ${lightTextOnLightBg.length} total occurrences of light text classes.`);
// Let's filter for pages, hero headers, card titles, etc.
lightTextOnLightBg.forEach(item => {
  if (
    item.file.includes('pages/') ||
    item.code.includes('<h1') ||
    item.code.includes('<h2') ||
    item.code.includes('<h3') ||
    item.code.includes('<h4') ||
    item.code.includes('<p') ||
    item.code.includes('title') ||
    item.code.includes('subtitle')
  ) {
    console.log(`[${item.file}:${item.line}] (${item.token}) -> ${item.code}`);
  }
});
