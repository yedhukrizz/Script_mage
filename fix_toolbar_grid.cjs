const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/grid-cols-4/g, 'grid-cols-3 sm:grid-cols-4');
fs.writeFileSync(file, content);
