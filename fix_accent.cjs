const fs = require('fs');
let content = fs.readFileSync('src/store/useStore.ts', 'utf8');
content = content.replace("uiAccentColor: '#6366f1'", "uiAccentColor: '#a3e635'");
fs.writeFileSync('src/store/useStore.ts', content);
