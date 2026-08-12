const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const hookAnchor = '  const gridOverlay = useStore((state) => state.gridOverlay);';
const hookNew = '  const gridOverlay = useStore((state) => state.gridOverlay);\n  const timelineTrackpadMode = useStore((state) => state.timelineTrackpadMode);\n  const setTimelineTrackpadMode = useStore((state) => state.setTimelineTrackpadMode);';
content = content.replace(hookAnchor, hookNew);

const exportAnchor = `                  <label 
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
                </div>
              </div>`;
const exportNew = exportAnchor + `
              {/* Export Section */}
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Export</span>
                <ExportButton />
              </div>`;
content = content.replace(exportAnchor, exportNew);

const toggleAnchor = `              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Grid Overlay</label>`;
const toggleNew = `              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-text-muted uppercase font-semibold">Timeline Trackpad (Pan)</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setTimelineTrackpadMode(!timelineTrackpadMode)}
                    className={\`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none \${timelineTrackpadMode ? 'bg-[var(--color-accent)]' : 'bg-gray-600'}\`}
                  >
                    <span className={\`inline-block h-3 w-3 transform rounded-full bg-white transition-transform \${timelineTrackpadMode ? 'translate-x-5' : 'translate-x-1'}\`} />
                  </button>
                  <span className="text-xs text-text-main font-medium">{timelineTrackpadMode ? 'On' : 'Off'}</span>
                </div>
              </div>\n\n` + toggleAnchor;
content = content.replace(toggleAnchor, toggleNew);


fs.writeFileSync(file, content);
