const fs = require('fs');
let file = 'src/components/Timeline.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-white/g, 'bg-text-main');
content = content.replace(/ring-white/g, 'ring-text-main');
content = content.replace(/hover:text-white/g, 'hover:text-text-main');
content = content.replace(/bg-button-bg0/g, 'bg-button-bg opacity-50');

fs.writeFileSync(file, content);
