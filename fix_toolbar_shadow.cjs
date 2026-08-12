const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/shadow-\[0_20px_60px_-15px_rgba\(0,0,0,0.7\)\] /g, '');

fs.writeFileSync(file, content);
