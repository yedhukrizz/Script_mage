const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const regex = /{\/\* Settings & Export Section \*\/}/;
const newSection = `
                    {/* Default Settings Section */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Element Defaults (Quick Settings)</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        <button 
                          onClick={() => setActiveSubMenu('defaultText')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <Type size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Text</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultImage')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <ImageIcon size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Image</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultShape')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <Square size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Shape</span>
                        </button>
                        <button 
                          onClick={() => setActiveSubMenu('defaultPlaceholder')}
                          className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                        >
                          <LayoutTemplate size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Place</span>
                        </button>
                      </div>
                    </div>

                    {/* Settings & Export Section */}`;

if (regex.test(content) && !content.includes('Element Defaults (Quick Settings)')) {
  content = content.replace(regex, newSection);
  fs.writeFileSync('src/components/Toolbar.tsx', content);
  console.log("Added Element Defaults section.");
}
