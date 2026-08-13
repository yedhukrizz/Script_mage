const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{activeSubMenu === 'overlay' && \(\s*<div className="flex flex-col gap-4 p-2 overflow-y-auto max-h-\[300px\] custom-scrollbar">([\s\S]*?)<\/div>\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{activeSubMenu === 'overlay' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Overlays</span>
              <div className="flex flex-col gap-4">
${inner}
              </div>
            </div>
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed overlay');
} else {
    console.log('Overlay not found');
}
