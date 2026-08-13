const fs = require('fs');

// 1. Update Toolbar.tsx
let toolbar = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');
// Fix the popup container
toolbar = toolbar.replace(
  /className="fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-\[150\] flex flex-col justify-end items-end origin-bottom-right"/,
  'className="absolute bottom-[100%] right-0 mb-4 z-[150] flex flex-col justify-end items-end origin-bottom-right"'
);
// Fix the button container
toolbar = toolbar.replace(
  /className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 flex items-center justify-center z-\[70\]"/,
  'className="relative flex items-center justify-center z-[70]"'
);
fs.writeFileSync('src/components/Toolbar.tsx', toolbar);

// 2. Update ProjectMenu.tsx
let projectMenu = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');
projectMenu = projectMenu.replace(
  /className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 flex flex-col-reverse items-start gap-3 z-50"/,
  'className="relative flex flex-col-reverse items-start gap-3 z-50"'
);
fs.writeFileSync('src/components/ProjectMenu.tsx', projectMenu);

// 3. Update UndoRedoControls.tsx
let undoRedo = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');
undoRedo = undoRedo.replace(
  /className="fixed left-\[4\.5rem\] sm:left-24 bottom-4 sm:bottom-6 flex gap-2 z-50"/,
  'className="relative flex gap-2 z-50"'
);
fs.writeFileSync('src/components/UndoRedoControls.tsx', undoRedo);

