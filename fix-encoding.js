const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'index.html');
let s = fs.readFileSync(file, 'utf8');
// Remove Unicode replacement characters
s = s.replace(/\uFFFD/g, '');
// Fix common UTF-8 misinterpreted as Windows-1252
const fixes = [
  ['ā€"', '—'],
  ['ā†\'', '→'],
  ['iÅ', 'iš'],
  ['mÄ—nesinÄ—', 'mėnesinė'],
  ['ÄÆnaÅ', 'įnaš'],
  ['RÅ«Å', 'Rūš'],
  ['virÅ', 'virš'],
];
fixes.forEach(([a, b]) => {
  while (s.includes(a)) s = s.replace(a, b);
});
fs.writeFileSync(file, s, 'utf8');
console.log('Done');
