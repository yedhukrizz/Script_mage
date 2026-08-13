const fs = require('fs');

let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// 1. Add imports if needed
if (!content.includes('Layers')) {
  content = content.replace("from 'lucide-react';", ", Layers, Activity } from 'lucide-react';");
}

// 2. Add the JSX
const target = `{/* Export Section */}`;
const injection = `
                    {/* Settings Section */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Settings</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('settings')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Quick Settings"
                        >
                          <Settings size={18} className="text-stone-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Quick</span>
                        </button>
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
                          onClick={() => setActiveSubMenu('settings')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Overlay Settings"
                        >
                          <Layers size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Overlays</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Export Section */}`;

content = content.replace(target, injection);

fs.writeFileSync('src/components/Toolbar.tsx', content);
