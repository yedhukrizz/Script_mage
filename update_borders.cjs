const fs = require('fs');

let undo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undo = undo.replace(/bg-button-bg text-text-main rounded-full shadow-sm/g, 'bg-button-bg text-text-main rounded-full shadow-sm border float-border');
undo = undo.replace(/bg-button-bg text-amber-500 rounded-full shadow-sm/g, 'bg-button-bg text-amber-500 rounded-full shadow-sm border float-border');
undo = undo.replace(/bg-button-bg rounded-full overflow-hidden shadow-sm/g, 'bg-button-bg rounded-full overflow-hidden shadow-sm border float-border');
fs.writeFileSync('src/components/UndoRedoControls.tsx', undo);

let proj = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
proj = proj.replace('bg-button-bg text-text-main rounded-full shadow-sm', 'bg-button-bg text-text-main rounded-full shadow-sm border float-border');
fs.writeFileSync('src/components/ProjectMenu.tsx', proj);

let tool = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
// The Toolbar wand button:
tool = tool.replace('bg-text-main text-app-bg shadow-sm', 'bg-text-main text-app-bg shadow-sm border float-border');
fs.writeFileSync('src/components/Toolbar.tsx', tool);

