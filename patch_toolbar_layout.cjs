const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update activeSubMenu header
content = content.replace(
  `                {activeSubMenu === 'settings' && 'Quick Settings'}
              </span>`,
  `                {activeSubMenu === 'settings' && 'Quick Settings'}
                {activeSubMenu === 'prompts' && 'AI Prompts'}
              </span>`
);

// Replace MAIN MENU VIEW
const targetMainMenu = `          {/* MAIN MENU VIEW */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-2.5">
              {/* Aspect Ratio Selector - Sticky Header */}
              <div className="sticky top-0 bg-panel-bg z-20 pt-0.5 pb-1 -mt-0.5">
                <div className="flex items-center gap-2 bg-button-bg/80 backdrop-blur-sm p-1.5 rounded-xl border border-panel-border shadow-sm">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider pl-1.5 shrink-0">Ratio:</span>
                  <select 
                    value={canvasAspectRatio} 
                    onChange={(e) => setCanvasAspectRatio(e.target.value)}
                    className="appearance-none bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main outline-none focus:border-[var(--color-accent)] cursor-pointer hover:bg-button-hover transition-colors px-2"
                  >
                    <option value="9/16">9:16 Portrait (Reels/Shorts)</option>
                    <option value="16/9">16:9 Landscape (YouTube)</option>
                    <option value="1/1">1:1 Square (Feed)</option>
                    <option value="4/5">4:5 Vertical (Instagram)</option>
                  </select>
                </div>
              </div>

              {/* Labeled Tool Grid */}
              <div className="grid grid-cols-4 gap-1.5">`;

const replacementMainMenu = `          {/* MAIN MENU VIEW */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-2.5">
              {/* Aspect Ratio Selector - Sticky Header */}
              <div className="sticky top-0 bg-panel-bg z-20 pt-0.5 pb-1 -mt-0.5">
                <div className="flex items-center gap-2 bg-button-bg/80 backdrop-blur-sm p-1.5 rounded-xl border border-panel-border shadow-sm">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider pl-1.5 shrink-0">Ratio:</span>
                  <select 
                    value={canvasAspectRatio} 
                    onChange={(e) => setCanvasAspectRatio(e.target.value)}
                    className="appearance-none bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main outline-none focus:border-[var(--color-accent)] cursor-pointer hover:bg-button-hover transition-colors px-2"
                  >
                    <option value="9/16">9:16 Portrait (Reels/Shorts)</option>
                    <option value="16/9">16:9 Landscape (YouTube)</option>
                    <option value="1/1">1:1 Square (Feed)</option>
                    <option value="4/5">4:5 Vertical (Instagram)</option>
                  </select>
                </div>
              </div>

              {/* Tools Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                <div className="grid grid-cols-4 gap-1.5">`;

content = content.replace(targetMainMenu, replacementMainMenu);


// We need to find the section between "AI & Content Generators" and "Adding Canvas Elements" to replace it with the new buttons.

// Find index of "AI & Content Generators"
let aiIndex = content.indexOf("{/* AI & Content Generators */}");
let addIndex = content.indexOf("{/* Adding Canvas Elements */}");

if (aiIndex > -1 && addIndex > -1) {
  let before = content.substring(0, aiIndex);
  let after = content.substring(addIndex);
  
  let newTools = `{/* AI & Content Generators */}
                <button 
                  onClick={() => setActiveSubMenu('prompts')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Prompts & Generators"
                >
                  <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Prompts</span>
                </button>

                <button 
                  onClick={() => { setShowScriptModal(true, 'paste'); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Paste Script Code"
                >
                  <Terminal size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Paste Script</span>
                </button>

                <button 
                  onClick={() => { setShowGlobalTTSModal(true); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Global Text-to-Speech"
                >
                  <Mic size={18} className="text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">TTS Voice</span>
                </button>

                <button 
                  onClick={() => { setShowGlobalTranslateModal(true); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Global Translation"
                >
                  <Globe size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Translate</span>
                </button>

                <button 
                  onClick={() => { setShowTextGallery(true); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Text Gallery"
                >
                  <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text Gallery</span>
                </button>

                {/* Customization Submenus */}
                <button 
                  onClick={() => setActiveSubMenu('font')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Global Font"
                >
                  <Type size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Global Font</span>
                </button>

                <button 
                  onClick={() => setActiveSubMenu('background')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Canvas Background"
                >
                  <Palette size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Canvas BG</span>
                </button>

                <button 
                  onClick={() => setActiveSubMenu('speed')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Timeline Speed"
                >
                  <Gauge size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Speed</span>
                </button>

                <button 
                  onClick={() => setActiveSubMenu('settings')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Quick Settings"
                >
                  <Settings2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Settings</span>
                </button>
              </div>
              </div>

              {/* Add Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Add</span>
                <div className="grid grid-cols-4 gap-1.5">
`;
  content = before + newTools + after;
}

// Now we need to remove the Customization Submenus from the bottom of the "MAIN MENU VIEW"
// Wait, I already put them into the Tools section. Let's make sure I delete the old ones.
// I will just use regex to remove everything from "{/* Customization Submenus */}" to the end of that div.
// The end of that div is the closing tag for `<div className="grid grid-cols-4 gap-1.5">`
// Wait, let's just do it manually in the code string if possible.
