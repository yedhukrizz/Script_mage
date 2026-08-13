const fs = require('fs');

let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const regex = /{activeSubMenu === 'overlay' && \(\s*<div className="flex flex-col gap-3">([\s\S]*?)<\/div>\s*\)}/;

const colorPresets = "['#ffffff', '#000000', '#ff3366', '#33ccff', '#cc33ff', '#33ff99', '#ffcc00']";

const newStr = `{activeSubMenu === 'overlay' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Overlays</span>
              <div className="flex flex-col gap-5">
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Grid Overlay</label>
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
                {gridOverlay !== 'none' && (
                  <div className="flex flex-col gap-2 p-3 bg-panel-bg/50 border border-panel-border rounded-xl">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Color</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {${colorPresets}.map(c => (
                        <button key={'grid-'+c} onClick={() => setGridColor(c)} className={\`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 \${gridColor === c ? 'border-[var(--color-accent)] shadow-md' : 'border-transparent shadow-sm'}\`} style={{backgroundColor: c}} title={c} />
                      ))}
                      <label className="w-7 h-7 rounded-full relative overflow-hidden cursor-pointer shadow-sm border-2 border-transparent hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ml-1">
                        <input type="color" value={gridColor} onChange={(e) => setGridColor(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" title="Custom Color" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="w-full h-px bg-panel-border/50"></div>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Keylight</label>
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
                {keylightType !== 'none' && (
                  <div className="flex flex-col gap-2 p-3 bg-panel-bg/50 border border-panel-border rounded-xl">
                    <label className="text-[10px] text-text-muted uppercase font-semibold">Keylight Color</label>
                    <div className="flex flex-wrap gap-2 items-center">
                      {${colorPresets}.map(c => (
                        <button key={'keylight-'+c} onClick={() => setKeylightColor(c)} className={\`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 \${keylightColor === c ? 'border-[var(--color-accent)] shadow-md' : 'border-transparent shadow-sm'}\`} style={{backgroundColor: c}} title={c} />
                      ))}
                      <label className="w-7 h-7 rounded-full relative overflow-hidden cursor-pointer shadow-sm border-2 border-transparent hover:scale-110 transition-transform flex items-center justify-center bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 ml-1">
                        <input type="color" value={keylightColor} onChange={(e) => setKeylightColor(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" title="Custom Color" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full h-px bg-panel-border/50"></div>

              <div className="flex flex-col gap-3 pb-2">
                <label className="text-[10px] text-text-muted uppercase font-semibold px-1">Post-Processing FX</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'none', label: 'None' },
                    { value: 'crt', label: 'CRT Scanlines' },
                    { value: 'vhs', label: 'VHS Glitch' },
                    { value: 'noise', label: 'Static Noise' }
                  ].map(fx => (
                    <button 
                      key={fx.value}
                      onClick={() => setPostProcessingFx(fx.value as any)}
                      className={\`p-2 text-xs font-semibold rounded-xl border transition-all \${postProcessingFx === fx.value ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg text-text-main border-panel-border hover:border-[var(--color-accent)]/50 hover:bg-button-hover'}\`}
                    >
                      {fx.label}
                    </button>
                  ))}
                </div>
              </div>

              </div>
            </div>
          )}`;

content = content.replace(regex, newStr);
fs.writeFileSync('src/components/Toolbar.tsx', content);
