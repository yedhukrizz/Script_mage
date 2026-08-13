const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add close button to active submenu header
const activeHeaderRegex = /<span className="text-xs font-bold text-text-main capitalize">([\s\S]*?)<\/span>\n\s*<\/div>/;
content = content.replace(activeHeaderRegex, (match, p1) => {
  return `<span className="text-xs font-bold text-text-main capitalize">${p1}</span>
                  <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">
                    <X size={16} />
                  </button>
                </div>`;
});

// 2. Add close button to main menu header and rearrange
const mainHeaderRegex = /<div className="flex items-center gap-2 bg-button-bg\/80 p-1\.5 rounded-xl border border-panel-border">([\s\S]*?)<\/div>\n\s*<\/div>/;
content = content.replace(mainHeaderRegex, (match, p1) => {
  return `<div className="flex-1 flex items-center gap-2 bg-button-bg/80 p-1.5 rounded-xl border border-panel-border">
${p1}</div>
                  <button onClick={() => setIsOpen(false)} className="ml-3 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-button-bg hover:bg-button-hover border border-panel-border transition-colors text-text-muted hover:text-text-main" title="Close Menu">
                    <X size={16} />
                  </button>
                </div>`;
});

// Also need to add flex to the parent div of the main menu header
content = content.replace(/className=\{\`shrink-0 px-4 pt-4 pb-3 bg-panel-bg\/90 rounded-t-\[24px\] z-20 border-b border-panel-border\/50 transition-opacity duration-300 \$\{isDraggingSlider \? "opacity-0 pointer-events-none" : "opacity-100"\}\`\}/, 
'className={`shrink-0 flex items-center px-4 pt-4 pb-3 bg-panel-bg/90 rounded-t-[24px] z-20 border-b border-panel-border/50 transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}');


// 3. Make the popup more compact
content = content.replace(/max-h-\[85vh\] w-\[92vw\] max-w-\[360px\]/, 'max-h-[60vh] sm:max-h-[420px] w-[92vw] max-w-[360px]');

fs.writeFileSync(file, content);
