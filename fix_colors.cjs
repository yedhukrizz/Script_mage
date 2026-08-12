const fs = require('fs');
let file = 'src/components/PropertiesPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/text-white(?!(\/))/g, 'text-text-main');
content = content.replace(/bg-white\/5/g, 'bg-button-bg');
content = content.replace(/bg-white\/10/g, 'bg-button-bg hover:bg-button-hover');
content = content.replace(/border-white\/10/g, 'border-panel-border');
content = content.replace(/border-white\/20/g, 'border-[var(--color-accent)]');
content = content.replace(/ring-white\/20/g, 'ring-[var(--color-accent)]/50');
content = content.replace(/hover:bg-white\/20/g, 'hover:bg-button-hover');
content = content.replace(/hover:bg-white\/10/g, 'hover:bg-button-hover');
content = content.replace(/bg-white text-black/g, 'bg-text-main text-app-bg');
content = content.replace(/hover:text-white/g, 'hover:text-text-main');
content = content.replace(/hover:bg-white\/90/g, 'hover:opacity-90');

fs.writeFileSync(file, content);
