const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/shadow-\[0_-20px_40px_var\(--color-shadow\)\]/g, '');
fs.writeFileSync(file, content);
