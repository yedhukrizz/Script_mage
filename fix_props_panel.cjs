const fs = require('fs');
let file = 'src/components/PropertiesPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-\[#18181b\]\/95 backdrop-blur-xl p-5 rounded-\[24px\] shadow-2xl border border-panel-border/g, 'glass-panel p-5 rounded-[24px]');
content = content.replace(/bg-\[#18181b\]\/90 backdrop-blur-xl rounded-\[24px\] shadow-xl border border-panel-border/g, 'glass-panel rounded-[24px]');

fs.writeFileSync(file, content);
