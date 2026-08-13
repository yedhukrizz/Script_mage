const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{activeSubMenu === 'background' && \(\s*<div className="flex flex-col gap-1 max-h-\[260px\] overflow-y-auto custom-scrollbar pr-0\.5">([\s\S]*?)<\/div>\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{activeSubMenu === 'background' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Canvas Background</span>
              <div className="flex flex-col gap-1.5">
${inner}
              </div>
            </div>
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed background');
} else {
    console.log('Background not found');
}
