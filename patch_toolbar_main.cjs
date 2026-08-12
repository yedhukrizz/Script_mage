const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `              {/* Labeled Tool Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {/* AI & Content Generators */}
                <button 
                  onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="AI Script Generator"
                >
                  <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">AI Script</span>
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
                  onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Placeholder Prompts Gallery"
                >
                  <ImagePlus size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Prompts</span>
                </button>

                <button 
                  onClick={() => { setShowTextGallery(true); setIsOpen(false); }}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Text Gallery"
                >
                  <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text Gallery</span>
                </button>

                {/* Adding Canvas Elements */}
                <button 
                  onClick={handleAddText}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Add Text Block"
                >
                  <Type size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text</span>
                </button>

                <label 
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                  title="Upload Image"
                >
                  <ImageIcon size={18} className="group-hover:scale-110 transition-transform text-indigo-400" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                    onChange={handleAddImage} 
                  />
                </label>

                <label 
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                  title="Upload Background Music / Audio"
                >
                  <Music size={18} className="group-hover:scale-110 transition-transform text-pink-400" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Music</span>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                    onChange={handleAddMusic} 
                  />
                </label>

                <button 
                  onClick={() => handleAddShape('rectangle')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Add Rectangle"
                >
                  <Square size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Rectangle</span>
                </button>

                <button 
                  onClick={() => handleAddShape('circle')}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Add Circle"
                >
                  <Circle size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Circle</span>
                </button>

                <button 
                  onClick={handleAddPlaceholder}
                  className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                  title="Add Background Placeholder"
                >
                  <LayoutTemplate size={18} className="group-hover:scale-110 transition-transform text-purple-400" />
                  <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholder</span>
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
              </div>`;

const replaceStr = `              {/* Tools Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Tools</span>
                <div className="grid grid-cols-4 gap-1.5">
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
                </div>
              </div>

              {/* Add Section */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Add</span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button 
                    onClick={handleAddText}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Text Block"
                  >
                    <Type size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text</span>
                  </button>
                  
                  <button 
                    onClick={() => handleAddShape('circle')}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Circle"
                  >
                    <Circle size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Circle</span>
                  </button>
                  
                  <button 
                    onClick={() => handleAddShape('rectangle')}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Rectangle"
                  >
                    <Square size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Rectangle</span>
                  </button>
                  
                  <label 
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                    title="Upload Image"
                  >
                    <ImageIcon size={18} className="group-hover:scale-110 transition-transform text-indigo-400" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                      onChange={handleAddImage} 
                    />
                  </label>

                  <label 
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 cursor-pointer group"
                    title="Upload Background Music / Audio"
                  >
                    <Music size={18} className="group-hover:scale-110 transition-transform text-pink-400" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Music</span>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                      onChange={handleAddMusic} 
                    />
                  </label>

                  <button 
                    onClick={handleAddPlaceholder}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border/50 hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Add Background Placeholder"
                  >
                    <LayoutTemplate size={18} className="group-hover:scale-110 transition-transform text-purple-400" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholder</span>
                  </button>
                </div>
              </div>`;

content = content.replace(targetStr, replaceStr);

// Add the Prompts submenu at the end before closing tag
const submenuEndTarget = `          {activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">`;

const submenuEndReplace = `          {activeSubMenu === 'prompts' && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">Video Script Prompt</span>
                  <span className="text-[10px] text-text-muted">Generate a script timeline for ChatGPT</span>
                </div>
              </button>

              <button 
                onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                className="flex items-center gap-3 p-3 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-panel-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                  <ImagePlus size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Media Placeholders</span>
                  <span className="text-[10px] text-text-muted">Generate images for canvas placeholders</span>
                </div>
              </button>
            </div>
          )}

          {activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">`;

content = content.replace(submenuEndTarget, submenuEndReplace);

// Also add to header
content = content.replace(
  `{activeSubMenu === 'settings' && 'Quick Settings'}`,
  `{activeSubMenu === 'settings' && 'Quick Settings'}
                {activeSubMenu === 'prompts' && 'AI Prompts'}`
);

fs.writeFileSync(file, content);
