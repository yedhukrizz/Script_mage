const fs = require('fs');
let file = 'src/components/AboutModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Change from w-full h-full on mobile to a nice rounded popup
content = content.replace(/w-full h-full sm:h-auto sm:max-h-\[90vh\] sm:max-w-2xl rounded-\[40px\]/g, 'w-full max-h-[90vh] max-w-2xl rounded-[32px] sm:rounded-[40px]');
content = content.replace(/className="fixed inset-0 bg-black\/80 flex items-center justify-center z-50  p-4 sm:p-6"/g, 'className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6"');

fs.writeFileSync(file, content);
