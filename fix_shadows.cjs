const fs = require('fs');

let undo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undo = undo.replace(/bg-button-bg text-text-main rounded-full/g, 'bg-button-bg text-text-main rounded-full shadow-sm');
undo = undo.replace(/bg-button-bg text-amber-500 rounded-full/g, 'bg-button-bg text-amber-500 rounded-full shadow-sm');
undo = undo.replace(/bg-button-bg rounded-full  overflow-hidden/g, 'bg-button-bg rounded-full overflow-hidden shadow-sm');
fs.writeFileSync('src/components/UndoRedoControls.tsx', undo);

let proj = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
proj = proj.replace('bg-button-bg text-text-main rounded-full', 'bg-button-bg text-text-main rounded-full shadow-sm');
fs.writeFileSync('src/components/ProjectMenu.tsx', proj);

let tool = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
tool = tool.replace('bg-text-main text-app-bg', 'bg-text-main text-app-bg shadow-sm');
fs.writeFileSync('src/components/Toolbar.tsx', tool);

