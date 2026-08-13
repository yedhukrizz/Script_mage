const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/box-shadow: 0 4px 6px -1px var\(--color-shadow\), 0 2px 4px -2px var\(--color-shadow\);/g, '');
content = content.replace(/box-shadow: 0 10px 15px -3px var\(--color-shadow\), 0 4px 6px -4px var\(--color-shadow\);/g, 'box-shadow: 0 4px 12px var(--color-shadow);');

fs.writeFileSync(file, content);
