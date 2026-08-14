const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

const layoutOld = `<div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-end">
          <div className="flex items-end gap-2 pointer-events-auto">
            <ProjectMenu />
            <UndoRedoControls />
          </div>
          <div className="pointer-events-auto relative">
            <Toolbar />
          </div>
        </div>`;

const layoutNew = `<div className="absolute bottom-4 left-0 right-0 flex justify-center items-end pointer-events-none">
          <div className="flex items-end gap-2 pointer-events-auto bg-panel-bg/50 backdrop-blur-md p-2 rounded-[32px] border border-panel-border/50 shadow-sm">
            <ProjectMenu />
            <UndoRedoControls />
            <Toolbar />
          </div>
        </div>`;

app = app.replace(layoutOld, layoutNew);
fs.writeFileSync('src/App.tsx', app);
