const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{activeSubMenu === 'settings' && \(\s*<div className="flex flex-col gap-3">([\s\S]*?)<\/div> \{\/\* Close hiding wrapper \*\/}\s*<\/div>\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{activeSubMenu === 'settings' && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Quick Settings</span>
${inner}
              </div>
            </div>
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed settings');
} else {
    console.log('Settings not found');
}
