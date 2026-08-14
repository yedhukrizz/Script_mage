const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// 1. Remove shadows on playhead
content = content.replace(
  'shadow-[0_0_12px_var(--color-accent)]',
  ''
);
content = content.replace(
  'shadow-[0_4px_16px_rgba(0,0,0,0.6)]',
  ''
);

// 2. Remove shadows on replace dot
content = content.replace(
  'shadow-[0_0_8px_rgba(0,0,0,0.5)]',
  ''
);

// 3. Make timeline clip colorful if placeholder
content = content.replace(
  "backgroundColor: element.trackColor || '#3f3f46'",
  "background: element.isPlaceholder ? 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)' : (element.trackColor || '#3f3f46')"
);

// 4. Compact icons with comfortable touch target (w-10 h-10 flex items-center justify-center)
// There are several buttons. We'll replace `className="p-2 ` with `className="w-10 h-10 flex items-center justify-center `
content = content.replace(/className="p-2 /g, 'className="w-10 h-10 flex items-center justify-center ');

fs.writeFileSync('src/components/Timeline.tsx', content);
