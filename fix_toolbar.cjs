const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Position the popup near the button instead of inset-0
content = content.replace(
  /className=\{\`fixed inset-0 z-\[150\] flex items-center justify-center/g,
  'className={`fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-[150] flex flex-col justify-end items-end origin-bottom-right'
);
content = content.replace(/bg-black\/40/g, 'bg-transparent');

// 2. Fix active submenu header rounding and styles
content = content.replace(
  /className=\{\`shrink-0 flex items-center justify-between border-b border-panel-border px-4 py-3 glass-panel border-x-0 border-t-0 rounded-none z-20/g,
  'className={`shrink-0 flex items-center justify-between px-4 py-3 bg-panel-bg/90 border-b border-panel-border/50 rounded-t-[24px] z-20'
);

// 3. Fix main menu header rounding and styles
content = content.replace(
  /className=\{\`shrink-0 px-4 pt-4 pb-3 glass-panel border-x-0 border-t-0 rounded-none z-20 border-b border-panel-border/g,
  'className={`shrink-0 px-4 pt-4 pb-3 bg-panel-bg/90 rounded-t-[24px] z-20 border-b border-panel-border/50'
);

// 4. Split Prompts into Script Gen and Placeholders
// Let's first remove the old activeSubMenu === 'prompts' logic
content = content.replace(/\{\s*\/\* MAIN MENU VIEW \*\/\s*\}/, '{/* MAIN MENU VIEW */}');

// We will find the grid and replace the "Prompts" button with two new buttons.
const toolsGridStart = '                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">';
const toolsGridContent = `
                  <button 
                    onClick={() => { setShowScriptModal(true, 'generate'); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Generate Video Script"
                  >
                    <Sparkles size={18} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Gen Script</span>
                  </button>

                  <button 
                    onClick={() => { setShowPlaceholderGallery(true); setIsOpen(false); }}
                    className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group"
                    title="Manage Media Placeholders"
                  >
                    <ImageIcon size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholders</span>
                  </button>
`;

// Remove the old Prompts button
content = content.replace(
  /<button[\s\S]*?onClick=\{\(\) => setActiveSubMenu\('prompts'\)\}[\s\S]*?<\/button>/,
  toolsGridContent.trim()
);

// Remove the Prompts sub-menu view
content = content.replace(
  /\{\s*activeSubMenu === 'prompts' && \([\s\S]*?\}\s*\)/,
  ''
);

// Update Prompts header text to be removed or ignored
content = content.replace(
  /\{activeSubMenu === 'prompts' && 'AI Prompts'\}/,
  ''
);

// Add ImageIcon to imports if missing
if (!content.includes('Image as ImageIcon')) {
  content = content.replace(/Image,/g, 'Image, Image as ImageIcon,');
}

fs.writeFileSync(file, content);
