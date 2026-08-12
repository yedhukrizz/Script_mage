const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-black\/90 backdrop-blur-xl/g, 'bg-panel-bg backdrop-blur-xl');
content = content.replace(/bg-black\/20 border-panel-border/g, 'bg-[var(--theme-input-bg)] border-panel-border');

fs.writeFileSync(file, content);
