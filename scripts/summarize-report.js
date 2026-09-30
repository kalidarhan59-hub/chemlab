import fs from 'fs';

const report = JSON.parse(fs.readFileSync('./scripts/color-report.json', 'utf8'));

// Group by file
const byFile = {};
for (const item of report) {
  if (!byFile[item.file]) byFile[item.file] = [];
  byFile[item.file].push(item);
}

for (const [file, items] of Object.entries(byFile)) {
  console.log(`\n=== ${file} (${items.length} issues) ===`);
  items.slice(0, 10).forEach(it => {
    console.log(`  [${it.type}] L${it.line}: ${it.matches.join(', ')} -> ${it.text.slice(0, 90)}`);
  });
  if (items.length > 10) console.log(`  ... and ${items.length - 10} more`);
}
