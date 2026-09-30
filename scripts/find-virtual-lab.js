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
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

const files = scanDir('src');
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('Виртуальная') || content.includes('лаборатория')) {
    console.log(`Found in: ${path.relative('.', f)}`);
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('Виртуальная') || l.includes('лаборатория')) {
        console.log(`  L${idx+1}: ${l.trim()}`);
      }
    });
  }
}
