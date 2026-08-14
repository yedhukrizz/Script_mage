const fs = require('fs');
let content = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');

// Replace flex-1 px-3 sm:px-4 with w-11
content = content.replace(/flex-1 px-3 sm:px-4/g, 'w-11');
fs.writeFileSync('src/components/UndoRedoControls.tsx', content);
