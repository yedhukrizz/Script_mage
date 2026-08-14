const fs = require('fs');

// Fix ProjectMenu.tsx
let pm = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
pm = pm.replace(/w-12 h-12 sm:w-14 sm:h-14/g, 'w-11 h-11');
pm = pm.replace(/shadow-lg/g, '');
fs.writeFileSync('src/components/ProjectMenu.tsx', pm);

// Fix Toolbar.tsx
let tb = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
tb = tb.replace(/w-12 h-12 sm:w-14 sm:h-14/g, 'w-11 h-11');
tb = tb.replace(/shadow-2xl/g, '');
tb = tb.replace(/<Wand2 size=\{24\} \/>/g, '<Wand2 size={20} />');
tb = tb.replace(/<X size=\{24\} \/>/g, '<X size={20} />');
fs.writeFileSync('src/components/Toolbar.tsx', tb);

