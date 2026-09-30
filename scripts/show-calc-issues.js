import fs from 'fs';

const report = JSON.parse(fs.readFileSync('./scripts/color-report.json', 'utf8'));

const calcIssues = report.filter(r => r.file.includes('CalculatorsSection.tsx'));
console.log(`CalculatorsSection has ${calcIssues.length} issues:`);
calcIssues.forEach(it => {
  console.log(`L${it.line}: [${it.matches.join(', ')}] -> ${it.text}`);
});
