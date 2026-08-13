const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `          {/* Active Submenu Header (Fixed outside scroll area) */}
          {activeSubMenu !== 'main' && (
            <div className={\`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg/90 border-b border-panel-border/50 rounded-t-[24px] z-20 transition-opacity duration-300 \${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}\`}>
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
          )}

          {/* Main Menu Header (Fixed outside scroll area) */}
          {activeSubMenu === 'main' && (
            <div className={\`shrink-0 px-4 pt-4 pb-3 bg-panel-bg/90 rounded-t-[24px] z-20 border-b border-panel-border/50 transition-opacity duration-300 \${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}\`}>
              <div className="flex items-center gap-2 bg-button-bg/80 p-1.5 rounded-xl border border-panel-border">
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
          )}

          {/* Scrollable Content Area */}
          <div className={\`flex-1 overflow-x-hidden custom-scrollbar p-4 transition-all duration-300 \${isDraggingSlider ? "overflow-y-visible" : "overflow-y-auto"}\`}>

          {/* MAIN MENU VIEW */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-2.5">

              {/* Tools Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  <button 
                    onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Generate Video Script"
                  >
                    <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Gen Script</span>
                  </button>

                  <button 
                    onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Manage Media Placeholders"
                  >
                    <ImageIcon size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholders</span>
                  </button>

                  <button 
                    onClick={() => { setShowScriptModal(true, 'paste'); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Paste Script Code"
                  >
                    <Terminal size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Paste Script</span>
                  </button>

                  <button 
                    onClick={() => { setShowGlobalTTSModal(true); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Global Text-to-Speech"
                  >
                    <Mic size={18} className="text-rose-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">TTS Voice</span>
                  </button>

                  <button 
                    onClick={() => { setShowGlobalTranslateModal(true); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Global Translation"
                  >
                    <Globe size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Translate</span>
                  </button>

                  <button 
                    onClick={() => { setShowTextGallery(true); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Manage Text Blocks"
                  >
                    <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text Gallery</span>
                  </button>
                </div>
              </div>
`;

// Regex to replace from {/* Active Submenu Header */} down to before {/* Add Section */}
const regex = /\{\/\*\s*Active Submenu Header.*?\}\s*\)[\s\S]*?(?=\{\/\*\s*Add Section\s*\*\/})/m;
content = content.replace(regex, replacement + '\n\n              ');
fs.writeFileSync(file, content);
