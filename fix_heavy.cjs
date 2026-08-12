const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/box-shadow: 0 40px 80px -20px var\(--color-shadow\), 0 0 0 1px inset var\(--color-glass-rim\);/g, 'box-shadow: 0 32px 64px -16px var(--color-shadow), 0 8px 24px -8px var(--color-shadow), 0 0 0 1px inset var(--color-glass-rim);');
fs.writeFileSync(file, content);
