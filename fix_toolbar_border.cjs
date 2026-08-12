const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// The main glass containers shouldn't have inline border classes if the glass utility handles it natively
content = content.replace(/glass-panel border border-panel-border/g, 'glass-panel');
content = content.replace(/glass-panel-heavy border border-panel-border/g, 'glass-panel-heavy');

fs.writeFileSync(file, content);
