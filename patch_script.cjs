const fs = require('fs');
let content = fs.readFileSync('src/components/ScriptModal.tsx', 'utf8');
content = content.replace('isPlaceholder: !imageUrl,', 'isPlaceholder: true,');
fs.writeFileSync('src/components/ScriptModal.tsx', content);
