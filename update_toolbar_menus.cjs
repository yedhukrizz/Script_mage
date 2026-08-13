const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// 1. Move Transition, Backdrop, Overlays into Tools
const targetTools = `<span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">`;

const newToolsButtons = `
                        <button 
                          onClick={() => setActiveSubMenu('speed')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Transition Settings"
                        >
                          <Activity size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Transition</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('background')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Background Settings"
                        >
                          <ImageIcon size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Backdrop</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('overlay')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Overlay Settings"
                        >
                          <Layers size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Overlays</span>
                        </button>
`;

if (!content.includes('title="Background Settings"')) {
  content = content.replace(targetTools, targetTools + newToolsButtons);
}


// 2. Remove the old Settings block from 'main' 
// Actually, let's just replace the entire Settings and Export block at the end of 'main' with a combined 'Settings & Export' section.
const settingsRegex = /{\/\* Settings Section \*\/}[\s\S]*?{\/\* Export Section \*\/}\s*<div className="flex flex-col gap-1.5 mt-2">\s*<span className="text-\[10px\] font-bold text-text-muted uppercase tracking-wider px-1">Export<\/span>\s*<ExportButton \/>\s*<\/div>/;

const newSettingsExport = `
                    {/* Settings & Export Section */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Settings & Export</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('settings')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Quick Settings"
                        >
                          <Settings size={18} className="text-stone-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Settings</span>
                        </button>
                        <div className="col-span-1">
                          <ExportButton />
                        </div>
                      </div>
                    </div>
`;

content = content.replace(settingsRegex, newSettingsExport);

fs.writeFileSync('src/components/Toolbar.tsx', content);

