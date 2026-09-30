import fs from 'fs';
import path from 'path';

function searchInDir(dir, query) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        searchInDir(full, query);
      }
    } else if (entry.isFile() && /\.(tsx|ts|json|html|css)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(query)) {
        console.log(`Found "${query}" in ${full}`);
        // print snippet
        const lines = content.split('\n');
        lines.forEach((l, i) => {
          if (l.includes(query)) {
            console.log(`  Line ${i+1}: ${l.trim()}`);
          }
        });
      }
    }
  }
}

searchInDir('./src', 'Виртуальная');
searchInDir('./src', 'лаборатория');
