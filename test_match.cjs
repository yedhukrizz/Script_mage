const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const str = content.substring(content.indexOf('{/* Labeled Tool Grid */}'), content.indexOf('{/* Customization Submenus */}'));
console.log("Length:", str.length);
