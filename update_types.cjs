const fs = require('fs');

let typesContent = fs.readFileSync('src/types.ts', 'utf8');
typesContent = typesContent.replace('textEffect?: string; // For text', 'textEffect?: string; // For text\n  textEffect2?: string;\n  textEffect3?: string;');
fs.writeFileSync('src/types.ts', typesContent);

let storeContent = fs.readFileSync('src/store/useStore.ts', 'utf8');
storeContent = storeContent.replace('textEffect?: string, fontWeight?: number', 'textEffect?: string, textEffect2?: string, textEffect3?: string, fontWeight?: number');
storeContent = storeContent.replace('textEffect: \'none\', fontWeight: 600', 'textEffect: \'none\', textEffect2: \'none\', textEffect3: \'none\', fontWeight: 600');
storeContent = storeContent.replace('textEffect: state.defaults.text.textEffect,', 'textEffect: state.defaults.text.textEffect,\n          textEffect2: state.defaults.text.textEffect2,\n          textEffect3: state.defaults.text.textEffect3,');
fs.writeFileSync('src/store/useStore.ts', storeContent);
