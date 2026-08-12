const fs = require('fs');
let file = 'src/components/ExportButton.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/border-white\/10/g, 'border-panel-border');
content = content.replace(/border-white\/5/g, 'border-panel-border');

fs.writeFileSync(file, content);
