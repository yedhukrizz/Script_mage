const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/hover:border-panel-border\/50 hover:border-\[var\(--color-accent\)\]/g, 'hover:border-[var(--color-accent)]');
fs.writeFileSync(file, content);
