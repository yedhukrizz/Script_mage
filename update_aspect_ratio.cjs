const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const oldRatioStr = `                  <div className="flex-1 flex items-center gap-2 bg-button-bg/80 p-1.5 rounded-xl border border-panel-border">
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
                  </div>`;

const newRatioBtn = `                  <div className="flex-1 flex items-center gap-2 bg-button-bg/80 p-1.5 rounded-xl border border-panel-border">
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider pl-1.5 shrink-0">Ratio:</span>
                    <button 
                      onClick={() => setActiveSubMenu('aspectRatio')}
                      className="bg-button-bg border border-panel-border rounded-lg w-full text-center h-7 text-xs font-semibold text-text-main hover:bg-button-hover hover:border-[var(--color-accent)] transition-all px-2 flex items-center justify-center gap-2"
                    >
                      {canvasAspectRatio === '9/16' ? '9:16 Portrait' : canvasAspectRatio === '16/9' ? '16:9 Landscape' : canvasAspectRatio === '1/1' ? '1:1 Square' : '4:5 Vertical'}
                    </button>
                  </div>`;

content = content.replace(oldRatioStr, newRatioBtn);


// Also add the new sub menu 
const activeSubMenuMain = `{activeSubMenu === 'main' && (`;
const ratioSubMenu = `          {activeSubMenu === 'aspectRatio' && (
            <div className="flex flex-col gap-2 p-2">
              <span className="text-[10px] text-text-muted uppercase font-semibold px-1">Canvas Aspect Ratio</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '9/16', label: '9:16 Portrait', desc: 'Reels, Shorts' },
                  { value: '16/9', label: '16:9 Landscape', desc: 'YouTube' },
                  { value: '1/1', label: '1:1 Square', desc: 'Feed' },
                  { value: '4/5', label: '4:5 Vertical', desc: 'Instagram' }
                ].map(ratio => (
                  <button
                    key={ratio.value}
                    onClick={() => {
                      setCanvasAspectRatio(ratio.value as any);
                      setActiveSubMenu('main');
                    }}
                    className={\`flex flex-col items-center justify-center p-3 rounded-xl border transition-all \${canvasAspectRatio === ratio.value ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg border-panel-border text-text-main hover:border-[var(--color-accent)]/50'}\`}
                  >
                    <span className="font-bold text-sm">{ratio.label}</span>
                    <span className="text-[10px] opacity-70">{ratio.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeSubMenu === 'main' && (`;

content = content.replace(activeSubMenuMain, ratioSubMenu);

// Also we need to add "ratio" to the activeSubMenu types/checks in Toolbar.tsx if any, wait, it's just a string so it's fine.
// We also need to add a title/header for Aspect Ratio
const menuTitles = `{activeSubMenu === 'overlay' && 'Overlays'}`;
const updatedTitles = `{activeSubMenu === 'aspectRatio' && 'Aspect Ratio'}\n                      {activeSubMenu === 'overlay' && 'Overlays'}`;
content = content.replace(menuTitles, updatedTitles);

fs.writeFileSync('src/components/Toolbar.tsx', content);

