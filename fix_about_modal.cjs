const fs = require('fs');
let file = 'src/components/AboutModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/sm:rounded-\[32px\]/g, 'rounded-[40px]');
content = content.replace(/border-b border-panel-border shrink-0 bg-app-bg z-10/g, 'border-b border-panel-border shrink-0 z-10 glass-panel border-x-0 border-t-0 rounded-none');

fs.writeFileSync(file, content);
