const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
content = content.replaceAll('<div className="relative">', '<>');
content = content.replaceAll('</div>\n', '</>\n');
fs.writeFileSync('src/components/Toolbar.tsx', content);
