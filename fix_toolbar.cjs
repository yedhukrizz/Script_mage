const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/text-white group-hover/g, 'text-text-main group-hover');
fs.writeFileSync(file, content);
