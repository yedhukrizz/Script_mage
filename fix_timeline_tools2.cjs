const fs = require('fs');
let timeline = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

timeline = timeline.replace(
  'className="flex-1 flex items-center justify-end gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"',
  'className="flex-1 flex items-center justify-start gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"'
);

timeline = timeline.replace(
  '<div className="flex items-center gap-1 overflow-hidden transition-all duration-300 flex-shrink-0">',
  '<div className="ml-auto flex-shrink-0" /><div className="flex items-center gap-1 overflow-hidden transition-all duration-300 flex-shrink-0">'
);

fs.writeFileSync('src/components/Timeline.tsx', timeline);
