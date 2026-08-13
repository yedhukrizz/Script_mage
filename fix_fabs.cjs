const fs = require('fs');

// 1. Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/\s*<Toolbar \/>\s*<ProjectMenu \/>\s*<UndoRedoControls \/>/g, '');
app = app.replace(/<AnimatePresence>/, '<Toolbar />\n      <ProjectMenu />\n      <UndoRedoControls />\n      <AnimatePresence>');
fs.writeFileSync('src/App.tsx', app);

// 2. Update Toolbar.tsx
let toolbar = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
toolbar = toolbar.replace(/absolute right-4 sm:right-6 bottom-4 sm:bottom-6/g, 'fixed right-4 sm:right-6 bottom-4 sm:bottom-6');
fs.writeFileSync('src/components/Toolbar.tsx', toolbar);

// 3. Update ProjectMenu.tsx
let projectMenu = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
projectMenu = projectMenu.replace(/absolute left-4 sm:left-6 bottom-4 sm:bottom-6/g, 'fixed left-4 sm:left-6 bottom-4 sm:bottom-6');
fs.writeFileSync('src/components/ProjectMenu.tsx', projectMenu);

// 4. Update UndoRedoControls.tsx
let undoRedo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undoRedo = undoRedo.replace(/absolute left-\[4\.5rem\] sm:left-24 bottom-4 sm:bottom-6/g, 'fixed left-[4.5rem] sm:left-24 bottom-4 sm:bottom-6');
fs.writeFileSync('src/components/UndoRedoControls.tsx', undoRedo);

