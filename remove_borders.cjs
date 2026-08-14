const fs = require('fs');

let pm = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
pm = pm.replace('bg-button-bg text-text-main border border-panel-border rounded-full', 'bg-button-bg text-text-main rounded-full');
fs.writeFileSync('src/components/ProjectMenu.tsx', pm);

let ur = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
ur = ur.replace(/bg-button-bg text-text-main border border-panel-border rounded-full/g, 'bg-button-bg text-text-main rounded-full');
ur = ur.replace(/bg-button-bg text-amber-500 border border-panel-border rounded-full/g, 'bg-button-bg text-amber-500 rounded-full');
ur = ur.replace(/border border-panel-border rounded-full/g, 'rounded-full');
ur = ur.replace(/border-l border-r border-panel-border/g, 'border-l border-r border-panel-border/30'); // Keep the separator for segmented but fainter
fs.writeFileSync('src/components/UndoRedoControls.tsx', ur);
