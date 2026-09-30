import fs from 'fs';
import path from 'path';

function findH1H2(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        findH1H2(full);
      }
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, idx) => {
        if (/<(h1|h2|h3|h4)\b/i.test(l)) {
          console.log(`${full}:${idx+1} -> ${l.trim()}`);
        }
      });
    }
  }
}

findH1H2('./src');
