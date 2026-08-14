const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

// Replace the right block flex container
const target = 'className="flex-1 flex items-center justify-start gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar"';
const replacement = 'className="flex-1 flex items-center justify-start gap-1 sm:gap-2 px-2 sm:px-4 overflow-x-auto overflow-y-hidden hide-scrollbar [mask-image:linear-gradient(to_right,transparent,black_10px,black_calc(100%-10px),transparent)]"';

content = content.replace(target, replacement);

// Wait, I need a spacer to push them right if there's space.
// Let's add <div className="ml-auto" /> as the first child? No, ml-auto doesn't shrink nicely.
// A better way is: `flex-1` on the timeline controls container, and we can just let them align left. Is it bad if they align left? Actually it's fine if they align left.
// But wait, the user said "ivonld not find the zoom icon". Let me make sure it is actually in the code.
fs.writeFileSync('src/components/Timeline.tsx', content);
