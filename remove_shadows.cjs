const fs = require('fs');

let undo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undo = undo.replace(/shadow-sm /g, '');
fs.writeFileSync('src/components/UndoRedoControls.tsx', undo);

let proj = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
proj = proj.replace(/shadow-sm /g, '');
fs.writeFileSync('src/components/ProjectMenu.tsx', proj);

let tool = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
tool = tool.replace(/shadow-sm border float-border/g, 'border float-border');
fs.writeFileSync('src/components/Toolbar.tsx', tool);

