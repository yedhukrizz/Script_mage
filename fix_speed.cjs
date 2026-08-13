const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{activeSubMenu === 'speed' && \(\s*<div className="flex flex-col gap-1\.5">\s*<span className="text-\[10px\] text-text-muted">Scale all element timings and video duration together:<\/span>\s*<div className="flex flex-col gap-1">([\s\S]*?)<\/div>\s*<\/div>\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{activeSubMenu === 'speed' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Transition Speed</span>
              <p className="text-[10px] text-text-muted px-1 -mt-1 leading-tight">Scale all element timings and video duration together.</p>
              <div className="flex flex-col gap-1.5">
${inner}
              </div>
            </div>
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed speed');
} else {
    console.log('Speed not found');
}
