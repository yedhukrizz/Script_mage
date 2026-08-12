const fs = require('fs');
let file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update App.tsx padding around the canvas
content = content.replace(/p-4 sm:p-12 pb-20 sm:pb-24/g, 'p-4 sm:p-8 pb-20 sm:pb-24');

// Update Timeline panel margins
content = content.replace(/mx-0 sm:mx-2/g, 'mx-0'); // Make timeline edge-to-edge even on desktop for cleaner minimal look
content = content.replace(/rounded-t-\[32px\]/g, 'sm:rounded-t-[32px] rounded-t-2xl');

fs.writeFileSync(file, content);
