const fs = require('fs');
const path = 'C:\\PROYECTOS\\DIICZONE_APP\\components\\shared\\Strategy\\StrategyCanvas.js';
const lines = fs.readFileSync(path, 'utf8').split('\n');
console.log('LINE 710 (original):', JSON.stringify(lines[710]));
console.log('LINE 711 (original):', JSON.stringify(lines[711]));
