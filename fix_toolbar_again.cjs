const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// The activeSubMenu header was messed up:
// It should be:
/*
            <div className={`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg/90 border-b border-panel-border/50 rounded-t-[24px] z-20 transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <button 
                onClick={() => setActiveSubMenu('main')}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
              >
                <ChevronLeft size={16} />
                <span>Back to Menu</span>
              </button>
              <span className="text-xs font-bold text-text-main capitalize">
                {activeSubMenu === 'font' && 'Global Font'}
                {activeSubMenu === 'background' && 'Canvas Background'}
                {activeSubMenu === 'export' && 'Export Video'}
                {activeSubMenu === 'settings' && 'Settings'}
              </span>
            </div>
*/

const goodHeader = `            <div className={\`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg/90 border-b border-panel-border/50 rounded-t-[24px] z-20 transition-opacity duration-300 \${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}\`}>
              <button 
                onClick={() => setActiveSubMenu('main')}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] hover:underline"
              >
                <ChevronLeft size={16} />
                <span>Back to Menu</span>
              </button>
              <span className="text-xs font-bold text-text-main capitalize">
                {activeSubMenu === 'font' && 'Global Font'}
                {activeSubMenu === 'background' && 'Canvas Background'}
                {activeSubMenu === 'export' && 'Export Video'}
                {activeSubMenu === 'settings' && 'Settings'}
              </span>
            </div>`;

content = content.replace(/<div className=\{\`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg\/90 border-b border-panel-border\/50 rounded-t-\[24px\] z-20 transition-opacity duration-300[\s\S]*?<\/div>/, goodHeader);

fs.writeFileSync(file, content);
