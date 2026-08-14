const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// The user wants a standard nice colour palette, not a crazy gradient
content = content.replace(
  "background: element.isPlaceholder ? 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)' : (element.trackColor || '#3f3f46')",
  "backgroundColor: element.isPlaceholder ? '#8b5cf6' : (element.trackColor || '#3f3f46')"
);

fs.writeFileSync('src/components/Timeline.tsx', content);
