const fs = require('fs');
let content = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
content = content.replace('text-red-400', 'text-amber-500');
content = content.replace('hover:text-red-500', 'hover:text-amber-400');
content = content.replace('hover:border-red-500/30', 'hover:border-amber-500/30');
fs.writeFileSync('src/components/UndoRedoControls.tsx', content);
