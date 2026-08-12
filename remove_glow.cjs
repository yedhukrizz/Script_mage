const fs = require('fs');
let file = 'src/components/TextGallery.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-\[var\(--color-accent\)\]\/10 blur-\[120px\]/g, 'bg-transparent');

fs.writeFileSync(file, content);
