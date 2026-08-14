const fs = require('fs');

// 1. ProjectMenu.tsx
let proj = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
proj = proj.replace('shadow-2xl', 'shadow-none border float-border');
fs.writeFileSync('src/components/ProjectMenu.tsx', proj);

// 2. Toolbar.tsx
let tool = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
tool = tool.replace('glass-panel rounded-[24px]', 'glass-panel rounded-[24px] border float-border shadow-none');
tool = tool.replace('<Wand2 size={20} />', '<Plus size={20} strokeWidth={2.5} />');
tool = tool.replace(/shadow-sm/g, ''); // remove all small shadows
tool = tool.replace(/shadow-md/g, ''); // remove all medium shadows
fs.writeFileSync('src/components/Toolbar.tsx', tool);

// 3. UndoRedoControls.tsx
// ensure no shadows
let undo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undo = undo.replace(/shadow-sm/g, '');
fs.writeFileSync('src/components/UndoRedoControls.tsx', undo);

// 4. Update the CSS for float-border to be clearly visible in light mode
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.15)');
fs.writeFileSync('src/index.css', css);

