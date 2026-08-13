const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

content = content.replace(
  /onClick=\{\(\) => setActiveSubMenu\('settings'\)\}\s*className="flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-\[var\(--color-accent\)\] transition-all gap-1 group"\s*title="Overlay Settings"/g,
  "onClick={() => setActiveSubMenu('overlay')}\n                          className=\"flex flex-col items-center justify-center p-2 bg-button-bg hover:bg-button-hover text-text-main rounded-xl border border-transparent hover:border-[var(--color-accent)] transition-all gap-1 group\"\n                          title=\"Overlay Settings\""
);

const settingsRegex = /<div className="flex flex-col gap-1">\s*<label className="text-\[10px\] text-text-muted uppercase font-semibold">Grid Overlay<\/label>[\s\S]*?<\/select>\s*<\/div>\s*<div className="flex flex-col gap-1">\s*<label className="text-\[10px\] text-text-muted uppercase font-semibold">Keylight Direction<\/label>[\s\S]*?<\/select>\s*<\/div>/;

const match = content.match(settingsRegex);
if (match) {
  const extracted = match[0];
  content = content.replace(settingsRegex, '');
  
  const newSubMenu = `
          {activeSubMenu === 'overlay' && (
            <div className="flex flex-col gap-3 p-2">
              <div className="flex flex-col gap-3">
                ${extracted}
              </div>
            </div>
          )}
          
          {activeSubMenu === 'settings' && (
  `;
  
  content = content.replace("{activeSubMenu === 'settings' && (", newSubMenu);
}

content = content.replace(
  /{activeSubMenu === 'settings' && 'Settings'}/,
  "{activeSubMenu === 'settings' && 'Settings'}\n                      {activeSubMenu === 'overlay' && 'Overlays'}"
);

fs.writeFileSync('src/components/Toolbar.tsx', content);

