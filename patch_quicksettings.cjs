const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// Quick Settings children: 
// 1. Theme/Animation container
// 2. Global Text Scale container
// 3. BGM Volume container
// 4. Grid Lines container

// Hide the non-slider parts of Quick Settings
const qsStart = `{activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">`;
const qsStartNew = `{activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">
              <div className={\`flex flex-col gap-3 transition-opacity duration-300 \${isDraggingSlider ? 'opacity-0 hidden' : 'opacity-100'}\`}>`;

content = content.replace(qsStart, qsStartNew);

const textScaleOld = `<div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-text-muted uppercase font-semibold">Global Text Scale</label>
                  <span className="text-[10px] font-mono text-text-main">{globalTextScale.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="3" step="0.05"
                  value={globalTextScale} 
                  onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>`;

const textScaleNew = `</div>
              <div className={\`flex flex-col gap-1 transition-all duration-300 p-2 rounded-xl \${isDraggingSlider ? 'bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-110 -translate-y-6 sm:-translate-x-12 z-50' : ''}\`}>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-text-muted uppercase font-semibold">Global Text Scale</label>
                  <span className="text-[10px] font-mono text-text-main">{globalTextScale.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" max="3" step="0.05"
                  value={globalTextScale} 
                  onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                  onPointerDown={handleSliderStart}
                  onPointerUp={handleSliderEnd}
                  onPointerCancel={handleSliderEnd}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
              <div className={\`flex flex-col gap-3 transition-opacity duration-300 \${isDraggingSlider ? 'opacity-0 hidden' : 'opacity-100'}\`}>`;
              
content = content.replace(textScaleOld, textScaleNew);

const qsEndOld = `Open Full Settings
                </button>
              </div>
            </div>
          )}`;
const qsEndNew = `Open Full Settings
                </button>
              </div>
              </div> {/* Close hiding wrapper */}
            </div>
          )}`;

content = content.replace(qsEndOld, qsEndNew);

fs.writeFileSync(file, content);
