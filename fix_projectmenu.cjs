const fs = require('fs');
let content = fs.readFileSync('src/components/ProjectMenu.tsx', 'utf8');

// Update root div
content = content.replace(
  /<div className="relative flex flex-col-reverse items-start gap-3 z-50" ref=\{ref\}>/,
  '<div className="relative flex items-center justify-center z-50" ref={ref}>'
);

// Update motion.div className to absolute
content = content.replace(
  /className="glass-panel p-2 rounded-\[24px\] shadow-2xl mb-2 max-h-\[50vh\] sm:max-h-\[60vh\] overflow-y-auto custom-scrollbar max-w-\[calc\(100vw-2rem\)\]"/,
  'className="absolute bottom-[100%] left-0 mb-4 z-[100] w-[280px] glass-panel p-2 rounded-[24px] shadow-2xl max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar origin-bottom-left"'
);

fs.writeFileSync('src/components/ProjectMenu.tsx', content);
