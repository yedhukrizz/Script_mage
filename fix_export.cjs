const fs = require('fs');

let exportBtn = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

// Update main export button to match Settings
exportBtn = exportBtn.replace(
  'export function ExportButton({ className = "flex items-center justify-center gap-2 px-4 h-10 bg-[var(--color-accent)] text-white font-bold rounded-full hover:opacity-90 transition-all disabled:opacity-50 shadow-lg", iconSize = 18 }: { className?: string, iconSize?: number }) {',
  'export function ExportButton({ className = "flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border float-border hover:border-[var(--color-accent)] transition-all gap-1 group", iconSize = 18, showText = true }: { className?: string, iconSize?: number, showText?: boolean }) {'
);

exportBtn = exportBtn.replace(
  '<span className="text-sm">Export</span>',
  '{showText && <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Export</span>}'
);

exportBtn = exportBtn.replace(
  '<Upload size={iconSize} />',
  '<Upload size={iconSize} className="text-stone-400 group-hover:scale-110 transition-transform group-hover:text-[var(--color-accent)]" />'
);


// Grid based settings options for Export Menu
// Replace Resolution dropdown
exportBtn = exportBtn.replace(
  `                    <CustomSelect
                        value={resolution} 
                      onChange={(val) => setResolution(val)} 
                      options={[
                        { value: '720p', label: '720p (HD)' },
                        { value: '1080p', label: '1080p (FHD)' },
                        { value: '4k', label: '4K (UHD)' },
                        { value: '8k', label: '8K (FUHD)' }
                      ]}
                   />`,
  `                    <div className="grid grid-cols-2 gap-2">
                       {[{value: '720p', label: '720p (HD)'}, {value: '1080p', label: '1080p (FHD)'}, {value: '4k', label: '4K (UHD)'}, {value: '8k', label: '8K (FUHD)'}].map(opt => (
                         <button
                           key={opt.value}
                           onClick={() => setResolution(opt.value)}
                           className={\`py-2 px-3 text-xs font-semibold rounded-lg border transition-all \${resolution === opt.value ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg border-panel-border text-text-main hover:bg-button-hover hover:border-text-muted'}\`}
                         >
                           {opt.label}
                         </button>
                       ))}
                    </div>`
);

// Replace FPS dropdown
exportBtn = exportBtn.replace(
  `                    <CustomSelect
                        value={fps.toString()} 
                      onChange={(val) => setFps(parseInt(val, 10))} 
                      options={[
                        { value: '12', label: '12 fps' },
                        { value: '24', label: '24 fps (Cinematic)' },
                        { value: '30', label: '30 fps (Standard)' },
                        { value: '60', label: '60 fps (Smooth)' },
                        { value: '90', label: '90 fps' },
                        { value: '120', label: '120 fps' }
                      ]}
                   />`,
  `                    <div className="grid grid-cols-3 gap-2">
                       {[12, 24, 30, 60, 90, 120].map(val => (
                         <button
                           key={val}
                           onClick={() => setFps(val)}
                           className={\`py-2 px-2 text-xs font-semibold rounded-lg border transition-all \${fps === val ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-button-bg border-panel-border text-text-main hover:bg-button-hover hover:border-text-muted'}\`}
                         >
                           {val} fps
                         </button>
                       ))}
                    </div>`
);

exportBtn = exportBtn.replace('shadow-2xl', 'shadow-none border float-border');
exportBtn = exportBtn.replace('glass-panel ', 'glass-panel-heavy ');

fs.writeFileSync('src/components/ExportButton.tsx', exportBtn);

