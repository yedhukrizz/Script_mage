const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<Gauge size=\{18\}/g, '<FastForward size={18}');
content = content.replace(/<Settings2 size=\{18\}/g, '<Settings size={18}');

fs.writeFileSync(file, content);
