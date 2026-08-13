const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{activeSubMenu === 'prompts' && \(\s*<div className="flex flex-col gap-2">([\s\S]*?)<\/div>\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{activeSubMenu === 'prompts' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">AI Scripts</span>
              <div className="flex flex-col gap-2">
${inner}
              </div>
            </div>
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed prompts');
} else {
    console.log('Prompts not found');
}
