const fs = require('fs');

let content = fs.readFileSync('src/components/ScriptModal.tsx', 'utf8');

const targetStr = `          textEffect: effectStr || defaults.textEffect || 'none',
          fontWeight: defaults.fontWeight || 600,`;

const newStr = `          textEffect: effectStr || defaults.textEffect || 'none',
          textEffect2: defaults.textEffect2 || 'none',
          textEffect3: defaults.textEffect3 || 'none',
          fontWeight: defaults.fontWeight || 600,`;

content = content.replace(targetStr, newStr);
fs.writeFileSync('src/components/ScriptModal.tsx', content);
