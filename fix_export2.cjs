const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const oldEffects = `            const effects = [element.textEffect, element.textEffect2, element.textEffect3].filter(Boolean) as string[];`;
const newEffects = `            const effects = [element.textEffect].filter(Boolean) as string[];`;

content = content.replace(oldEffects, newEffects);
fs.writeFileSync('src/components/ExportButton.tsx', content);
