const fs = require('fs');
let file = 'src/components/ThickSlider.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-white/g, 'bg-text-main');

fs.writeFileSync(file, content);
