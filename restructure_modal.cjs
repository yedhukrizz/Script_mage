const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `              className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border p-3 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto overflow-x-hidden custom-scrollbar w-[320px] sm:w-[360px] select-none"
              onClick={(e) => e.stopPropagation()}
            >
            
            {/* Active Submenu Header */}
          {activeSubMenu !== 'main' && (
            <div className="sticky top-0 -mt-3 -mx-3 px-3 pt-4 pb-3 mb-3 bg-panel-bg/95 backdrop-blur-xl z-20 flex items-center justify-between border-b border-panel-border rounded-t-[23px]">
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
                {activeSubMenu === 'speed' && 'Timeline Speed'}
                {activeSubMenu === 'settings' && 'Quick Settings'}
                {activeSubMenu === 'prompts' && 'AI Prompts'}
              </span>
            </div>
          )}

          {/* MAIN MENU VIEW */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-2.5">
              {/* Aspect Ratio Selector - Sticky Header */}
              <div className="sticky top-0 -mt-3 -mx-3 px-3 pt-3 pb-2 mb-2 bg-panel-bg/95 backdrop-blur-xl z-20 border-b border-panel-border rounded-t-[23px]">
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
              </div>`;

const replaceStr = `              className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col max-h-[85vh] w-[320px] sm:w-[360px] select-none overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            
          {/* Active Submenu Header (Fixed outside scroll area) */}
          {activeSubMenu !== 'main' && (
            <div className="shrink-0 flex items-center justify-between border-b border-panel-border px-4 py-3 bg-panel-bg/50 backdrop-blur-md z-20">
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
                {activeSubMenu === 'speed' && 'Timeline Speed'}
                {activeSubMenu === 'settings' && 'Quick Settings'}
                {activeSubMenu === 'prompts' && 'AI Prompts'}
              </span>
            </div>
          )}

          {/* Main Menu Header (Fixed outside scroll area) */}
          {activeSubMenu === 'main' && (
            <div className="shrink-0 px-4 pt-4 pb-3 bg-panel-bg/50 backdrop-blur-md z-20 border-b border-panel-border">
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
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4">

          {/* MAIN MENU VIEW */}
          {activeSubMenu === 'main' && (
            <div className="flex flex-col gap-2.5">`;

content = content.replace(targetStr, replaceStr);

// Now we need to close the scrollable div at the end
const endTargetStr = `            </div>
          )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

const endReplaceStr = `            </div>
          )}

            </div> {/* Close Scrollable Area */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;
      
content = content.replace(endTargetStr, endReplaceStr);

fs.writeFileSync(file, content);
