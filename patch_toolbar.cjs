const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state hooks
const hooksAnchor = `const storeCustomFonts = useStore((state) => state.customFonts);`;
const hooksAddition = `
  const elements = useStore((state) => state.elements);
  const currentTime = useStore((state) => state.currentTime);
  const setCurrentTime = useStore((state) => state.setCurrentTime);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
`;

content = content.replace(hooksAnchor, hooksAnchor + hooksAddition);

// 2. Add slider event handlers
const handleSliderStart = `
  const handleSliderStart = () => {
    setIsDraggingSlider(true);
    
    // Snap to nearest text element in time
    const textElements = elements.filter(e => e.type === 'text' || e.type === 'caption');
    if (textElements.length > 0) {
      let closestText = textElements[0];
      let minDistance = Infinity;
      
      textElements.forEach(el => {
        let distance;
        if (currentTime >= el.startTime && currentTime <= el.endTime) {
           distance = 0;
        } else {
           distance = Math.min(Math.abs(currentTime - el.startTime), Math.abs(currentTime - el.endTime));
        }
        if (distance < minDistance) {
           minDistance = distance;
           closestText = el;
        }
      });
      
      if (currentTime < closestText.startTime || currentTime > closestText.endTime) {
        // Jump to center of the closest text element
        setCurrentTime(closestText.startTime + (closestText.endTime - closestText.startTime) / 2);
      }
    }
  };

  const handleSliderEnd = () => {
    setIsDraggingSlider(false);
  };
`;
// insert before the return statement of Toolbar
const returnAnchor = `  return (
    <>
      {/* Dim overlay */}`;

content = content.replace(returnAnchor, handleSliderStart + "\n" + returnAnchor);

// 3. Apply transparent modal styling
const modalParentOld = `className="bg-panel-bg/95 backdrop-blur-xl border border-panel-border rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col max-h-[85vh] w-[320px] sm:w-[360px] select-none overflow-hidden"`;
const modalParentNew = 'className={`transition-all duration-300 flex flex-col max-h-[85vh] w-[320px] sm:w-[360px] select-none ${isDraggingSlider ? "overflow-visible" : "bg-panel-bg/95 backdrop-blur-xl border border-panel-border rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden"}`}';
content = content.replace(modalParentOld, modalParentNew);

// 4. Hide headers if isDraggingSlider
const submenuHeaderOld = `className="shrink-0 flex items-center justify-between border-b border-panel-border px-4 py-3 bg-panel-bg/50 backdrop-blur-md z-20"`;
const submenuHeaderNew = 'className={`shrink-0 flex items-center justify-between border-b border-panel-border px-4 py-3 bg-panel-bg/50 backdrop-blur-md z-20 transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}';
content = content.replace(submenuHeaderOld, submenuHeaderNew);

const mainMenuHeaderOld = `className="shrink-0 px-4 pt-4 pb-3 bg-panel-bg/50 backdrop-blur-md z-20 border-b border-panel-border"`;
const mainMenuHeaderNew = 'className={`shrink-0 px-4 pt-4 pb-3 bg-panel-bg/50 backdrop-blur-md z-20 border-b border-panel-border transition-opacity duration-300 ${isDraggingSlider ? "opacity-0 pointer-events-none" : "opacity-100"}`}';
content = content.replace(mainMenuHeaderOld, mainMenuHeaderNew);

const scrollableOld = `className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-4"`;
const scrollableNew = 'className={`flex-1 overflow-x-hidden custom-scrollbar p-4 transition-all duration-300 ${isDraggingSlider ? "overflow-y-visible" : "overflow-y-auto"}`}';
content = content.replace(scrollableOld, scrollableNew);

// 5. Update FONT SUBMENU VIEW to use slider
const fontSliderOld = `<div className="flex flex-col gap-1.5 p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Global Font Size</span>
                  <span className="text-[10px] font-mono text-text-muted">{Math.round(globalTextScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={globalTextScale}
                  onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>`;

const fontSliderNew = `<div className={\`flex flex-col gap-1.5 p-3 rounded-xl border transition-all duration-300 \${isDraggingSlider ? 'bg-black/90 backdrop-blur-xl border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-110 -translate-y-6 sm:-translate-x-12 z-50' : 'bg-black/20 border-white/5'}\`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-main">Global Font Size</span>
                  <span className="text-[10px] font-mono text-text-muted">{Math.round(globalTextScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={globalTextScale}
                  onChange={(e) => setGlobalTextScale(parseFloat(e.target.value))}
                  onPointerDown={handleSliderStart}
                  onPointerUp={handleSliderEnd}
                  onPointerCancel={handleSliderEnd}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>`;
content = content.replace(fontSliderOld, fontSliderNew);

// 6. Hide siblings in FONT SUBMENU VIEW
const fontSearchOld = `<input 
                type="text" 
                placeholder="Search fonts..." 
                value={fontSearch}`;
const fontSearchNew = `<div className={\`flex flex-col gap-2.5 transition-opacity duration-300 \${isDraggingSlider ? 'opacity-0 pointer-events-none' : 'opacity-100'}\`}>
              <input 
                type="text" 
                placeholder="Search fonts..." 
                value={fontSearch}`;
content = content.replace(fontSearchOld, fontSearchNew);

const fontListOld = `</button>
                ))}
              </div>`;
const fontListNew = `</button>
                ))}
              </div>
            </div>`;
content = content.replace(fontListOld, fontListNew);

// 7. Hide "Dim overlay" behind modal if dragging
const dimOverlayOld = `className={\`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300 \${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}`;
const dimOverlayNew = `className={\`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300 \${(isOpen && !isDraggingSlider) ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`}`;
content = content.replace(dimOverlayOld, dimOverlayNew);


fs.writeFileSync(file, content);
