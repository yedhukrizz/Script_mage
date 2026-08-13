const fs = require('fs');
let code = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const targetRegex = /{\[\'defaultText\', \'defaultImage\', \'defaultShape\', \'defaultPlaceholder\'\]\.includes\(activeSubMenu\) && \(\s*<div className="flex flex-col gap-3">([\s\S]*?)}\s*\)}/;
const match = code.match(targetRegex);
if(match) {
    const inner = match[1];
    const newReplacement = `{['defaultText', 'defaultImage', 'defaultShape', 'defaultPlaceholder'].includes(activeSubMenu) && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">
                {activeSubMenu === 'defaultText' && 'Text Element Defaults'}
                {activeSubMenu === 'defaultImage' && 'Image Element Defaults'}
                {activeSubMenu === 'defaultShape' && 'Shape Element Defaults'}
                {activeSubMenu === 'defaultPlaceholder' && 'Placeholder Defaults'}
              </span>
${inner}}
          )}`;
    code = code.replace(targetRegex, newReplacement);
    fs.writeFileSync('src/components/Toolbar.tsx', code);
    console.log('Fixed defaults');
} else {
    console.log('Defaults not found');
}
