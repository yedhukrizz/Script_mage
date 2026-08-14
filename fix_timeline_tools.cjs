const fs = require('fs');
let timeline = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// 1. Fix the parent container
timeline = timeline.replace(
  'className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"',
  'className="flex-1 flex items-center justify-end gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"'
);

// 2. Remove ml-auto from the zoom container
timeline = timeline.replace(
  '<div className="flex items-center gap-1 overflow-hidden transition-all duration-300 ml-auto">',
  '<div className="flex items-center gap-1 overflow-hidden transition-all duration-300 flex-shrink-0">'
);

fs.writeFileSync('src/components/Timeline.tsx', timeline);
