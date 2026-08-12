const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const hookAnchor = '  const timelineTrackpadMode = useStore((state) => state.timelineTrackpadMode);';
const hookNew = '  const timelineTrackpadMode = useStore((state) => state.timelineTrackpadMode);\n  const uiTheme = useStore((state) => state.uiTheme);\n  const setUiTheme = useStore((state) => state.setUiTheme);';
content = content.replace(hookAnchor, hookNew);

const toggleAnchor = `              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Overlay</label>`;
const toggleNew = `              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">App Theme</label>
                <div className="flex bg-button-bg border border-panel-border rounded-lg overflow-hidden p-0.5">
                  <button 
                    onClick={() => setUiTheme('light')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${uiTheme === 'light' ? 'bg-white text-black shadow-sm' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setUiTheme('dark')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${uiTheme === 'dark' ? 'bg-[#27272a] text-white shadow-sm border border-white/10' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >
                    Dark
                  </button>
                  <button 
                    onClick={() => setUiTheme('black')}
                    className={\`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all \${uiTheme === 'black' ? 'bg-black text-white shadow-sm border border-white/20' : 'text-text-muted hover:text-text-main hover:bg-button-hover'}\`}
                  >
                    OLED
                  </button>
                </div>
              </div>\n\n` + toggleAnchor;
content = content.replace(toggleAnchor, toggleNew);

fs.writeFileSync(file, content);
