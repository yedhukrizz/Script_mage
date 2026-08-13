const fs = require('fs');
let code = fs.readFileSync('/tmp/Toolbar.tsx', 'utf8');

// The messed up header block is between:
// <span className="text-xs font-bold text-text-main capitalize">
// and the corresponding </span> which is located far below.
const headerStart = '<span className="text-xs font-bold text-text-main capitalize">';
const startIdx = code.indexOf(headerStart);

// Let's find the `</span>` that comes right before:
// <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">
const endAnchor = '<button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1" title="Close Menu">';
const endIdx = code.indexOf(endAnchor);

if (startIdx !== -1 && endIdx !== -1) {
    const stringToReplace = code.substring(startIdx, endIdx);
    
    // We want to extract the actual submenus that got trapped inside the span, 
    // mainly the `effect` submenu. Wait, actually I can just recreate the `effect` submenu.
    const newHeader = `${headerStart}
                      {activeSubMenu === 'font' && 'Global Font'}
                      {activeSubMenu === 'effect' && 'Global Text Effect'}
                      {activeSubMenu === 'background' && 'Canvas Background'}
                      {activeSubMenu === 'export' && 'Export Video'}
                      {activeSubMenu === 'settings' && 'Settings'}
                      {activeSubMenu === 'defaultText' && 'Text Defaults'}
                      {activeSubMenu === 'defaultImage' && 'Image Defaults'}
                      {activeSubMenu === 'defaultShape' && 'Shape Defaults'}
                      {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}
                      {activeSubMenu === 'aspectRatio' && 'Aspect Ratio'}
                      {activeSubMenu === 'overlay' && 'Overlays'}
                      {activeSubMenu === 'speed' && 'Transition Settings'}
                      {activeSubMenu === 'prompts' && 'AI Scripts'}
                    </span>
                    `;
    
    code = code.substring(0, startIdx) + newHeader + code.substring(endIdx);
}

// Now we need to remove the activeSubMenu === 'aspectRatio' that was placed OUTSIDE the scrollable area
const aspectRatioOutsideStr = `                        {activeSubMenu === 'aspectRatio' && (
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
          )}`;

code = code.replace(aspectRatioOutsideStr, '');

// Re-add the effect and aspect ratio submenus inside the scrollable area.
const scrollAreaStart = `{/* MAIN MENU VIEW */}`;
const effectSubmenu = `
          {activeSubMenu === 'effect' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Choose Global Effect</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'typewriter', label: 'Typewriter' },
                  { value: 'bounce', label: 'Bounce' },
                  { value: 'pulse', label: 'Pulse' },
                  { value: 'shake', label: 'Shake' },
                  { value: 'neon', label: 'Neon Glow' },
                  { value: 'glitch', label: 'Glitch' },
                  { value: 'fade-slide', label: 'Fade & Slide' },
                ].map(eff => (
                  <button
                    key={eff.value}
                    onClick={() => {
                      applyGlobalTextEffect(eff.value);
                      addToast('Applied global text effect', 'success');
                      setActiveSubMenu('main');
                    }}
                    className="p-2 bg-button-bg hover:bg-button-hover text-left text-xs font-medium rounded-xl text-text-main transition-colors border border-transparent hover:border-[var(--color-accent)]"
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeSubMenu === 'aspectRatio' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Aspect Ratio</span>
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
`;
code = code.replace(scrollAreaStart, effectSubmenu + '\n                                ' + scrollAreaStart);

fs.writeFileSync('src/components/Toolbar.tsx', code);
