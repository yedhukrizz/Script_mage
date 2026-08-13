const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add 'effect' to activeSubMenu
content = content.replace(
  /useState\<'main' \| 'settings' \| 'font' \| 'background' \| 'speed' \| 'prompts'\>\('main'\)/,
  "useState<'main' | 'settings' | 'font' | 'background' | 'speed' | 'prompts' | 'effect'>('main')"
);

// 2. Add 'applyGlobalTextEffect' from useStore
if (!content.includes('const applyGlobalTextEffect = useStore')) {
  content = content.replace(
    /const applyGlobalFont = useStore\(\(state\) => state\.applyGlobalFont\);/,
    "const applyGlobalFont = useStore((state) => state.applyGlobalFont);\n  const applyGlobalTextEffect = useStore((state) => state.applyGlobalTextEffect);"
  );
}

// 3. Add 'effect' to Header titles
content = content.replace(
  /\{activeSubMenu === 'settings' && 'Settings'\}/,
  "{activeSubMenu === 'settings' && 'Settings'}\n                      {activeSubMenu === 'effect' && 'Global Text Effect'}"
);

// 4. Add 'effect' button in Main menu (under "Project Tools" next to Global Font)
const fontButtonStr = `<button 
                          onClick={() => setActiveSubMenu('font')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Global Font & Typography"
                        >
                          <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Typography</span>
                        </button>`;

if (content.includes(fontButtonStr) && !content.includes("setActiveSubMenu('effect')")) {
  const effectButtonStr = `${fontButtonStr}
                        <button 
                          onClick={() => setActiveSubMenu('effect')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                          title="Global Text Effect"
                        >
                          <Sparkles size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text Effect</span>
                        </button>`;
  content = content.replace(fontButtonStr, effectButtonStr);
}

// 5. Add Custom Font Input in 'font' activeSubMenu
const searchInputStr = `<input 
                type="text" 
                placeholder="Search fonts..." 
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                className="w-full bg-button-bg border border-panel-border rounded-xl px-3 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-[var(--color-accent)] mt-1"
              />`;
              
if (content.includes(searchInputStr) && !content.includes("Add Custom Font")) {
  const newFontStr = `${searchInputStr}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a Google Font name..."
                  className="flex-1 bg-button-bg border border-panel-border rounded-xl px-3 py-1.5 text-xs text-text-main outline-none focus:border-[var(--color-accent)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value.trim();
                      if (val) {
                         const newFonts = Array.from(new Set([...customFonts, val]));
                         setCustomFonts(newFonts);
                         import(\`idb-keyval\`).then(({ set }) => {
                           set('custom-font:' + val, true);
                         });
                         applyGlobalFont(val);
                         addToast('Added custom font: ' + val, 'success');
                         e.currentTarget.value = '';
                      }
                    }
                  }}
                />
              </div>`;
  content = content.replace(searchInputStr, newFontStr);
}

// 6. Add 'effect' activeSubMenu view
const textEffectsCode = `{activeSubMenu === 'effect' && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Choose Global Effect</span>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
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
                    className="p-2 bg-button-bg hover:bg-button-hover text-left text-xs font-medium rounded-lg text-text-main transition-colors border border-transparent hover:border-[var(--color-accent)]"
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSubMenu === 'background'`;

content = content.replace("{activeSubMenu === 'background'", textEffectsCode);

fs.writeFileSync(file, content);
console.log("Toolbar updated!");
