const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const overlayRegex = /{activeSubMenu === 'overlay' && \([\s\S]*?\}\)[\s\S]*?\}\)[\s\S]*?\n\s*\)}/;
// It might be easier to use the file we extracted. Wait, the extracted file is temp_overlay.txt.

const newOverlayStr = `          {activeSubMenu === 'overlay' && (
            <div className="flex flex-col gap-4 p-2 overflow-y-auto max-h-[300px] custom-scrollbar">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Overlay</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setGridOverlay('none')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${gridOverlay === 'none' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >None</button>
                  <button 
                    onClick={() => setGridOverlay('small')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${gridOverlay === 'small' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >Small</button>
                  <button 
                    onClick={() => setGridOverlay('large')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${gridOverlay === 'large' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >Large</button>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <label className="text-xs text-text-muted flex-1">Grid Color</label>
                  <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                </div>
              </div>
              
              <div className="w-full h-px bg-panel-border/50 my-1"></div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setKeylightType('none')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${keylightType === 'none' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >None</button>
                  <button 
                    onClick={() => setKeylightType('up')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${keylightType === 'up' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >Bottom-Up</button>
                  <button 
                    onClick={() => setKeylightType('down')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${keylightType === 'down' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >Top-Down</button>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <label className="text-xs text-text-muted flex-1">Keylight Color</label>
                  <input type="color" value={keylightColor} onChange={(e) => setKeylightColor(e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer bg-transparent" />
                </div>
              </div>

              <div className="w-full h-px bg-panel-border/50 my-1"></div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Post Processing FX</label>
                <div className="flex flex-wrap bg-button-bg border border-panel-border rounded-lg p-0.5">
                  <button 
                    onClick={() => setPostProcessingFx('none')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${postProcessingFx === 'none' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >None</button>
                  <button 
                    onClick={() => setPostProcessingFx('crt')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${postProcessingFx === 'crt' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >CRT</button>
                  <button 
                    onClick={() => setPostProcessingFx('vhs')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${postProcessingFx === 'vhs' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >VHS</button>
                  <button 
                    onClick={() => setPostProcessingFx('noise')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${postProcessingFx === 'noise' ? 'bg-panel-bg text-text-main shadow-sm border border-panel-border' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >Noise</button>
                </div>
              </div>
            </div>
          )}`;

let oldOverlayStr = fs.readFileSync('temp_overlay.txt', 'utf8');
content = content.replace(oldOverlayStr.trim(), newOverlayStr.trim());

fs.writeFileSync('src/components/Toolbar.tsx', content);

