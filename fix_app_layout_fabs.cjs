const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove them from before AnimatePresence
content = content.replace(/\s*<Toolbar \/>\s*<ProjectMenu \/>\s*<UndoRedoControls \/>/g, '');

// 2. Insert them exactly before the Timeline (Bottom section)
const timelineAnchor = '{/* Bottom section (Timeline + Controls) */}';
const floatingWrapper = `      {/* Floating Controls Anchor */}
      <div className="relative w-full z-[100] pointer-events-none">
        <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-end">
          <div className="flex items-end gap-3 sm:gap-4 pointer-events-auto">
            <ProjectMenu />
            <UndoRedoControls />
          </div>
          <div className="pointer-events-auto">
            <Toolbar />
          </div>
        </div>
      </div>

      {/* Bottom section (Timeline + Controls) */}`;

content = content.replace(timelineAnchor, floatingWrapper);

fs.writeFileSync(file, content);
