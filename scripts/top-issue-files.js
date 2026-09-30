import fs from 'fs';

const report = JSON.parse(fs.readFileSync('./scripts/color-report.json', 'utf8'));

const counts = {};
report.forEach(r => {
  counts[r.file] = (counts[r.file] || 0) + 1;
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('Top files with color issues:');
sorted.forEach(([f, c]) => console.log(`${c.toString().padStart(3, ' ')} issues: ${f}`));
