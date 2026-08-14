const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(
  '<div className="flex items-end gap-3 sm:gap-4 pointer-events-auto">\n            <ProjectMenu />\n            <UndoRedoControls />\n          </div>',
  '<div className="flex items-end gap-2 pointer-events-auto">\n            <ProjectMenu />\n            <UndoRedoControls />\n          </div>'
);
fs.writeFileSync('src/App.tsx', app);
