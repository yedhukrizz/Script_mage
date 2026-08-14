const fs = require('fs');
let content = fs.readFileSync('src/components/UndoRedoControls.tsx', 'utf8');

// Replace Heart with Coffee
content = content.replace('Heart, Hand', 'Coffee, Hand');
content = content.replace('<Heart size={24} fill="currentColor" />', '<Coffee size={20} />');

// Remove shadows
content = content.replace(/shadow-lg/g, '');

// Update sizes
content = content.replace(/w-12 h-12 sm:w-14 sm:h-14/g, 'w-11 h-11');
content = content.replace(/h-12 sm:h-14/g, 'h-11');

// Update icon sizes for compactness
content = content.replace(/size=\{24\}/g, 'size={20}');
content = content.replace(/size=\{20\}/g, 'size={18}'); // specifically for Hand, MousePointer

fs.writeFileSync('src/components/UndoRedoControls.tsx', content);
