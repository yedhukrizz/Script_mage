const fs = require('fs');
let content = fs.readFileSync('src/components/Timeline.tsx', 'utf8');

content = content.replace(/className=\{\`p-2 /g, 'className={`w-10 h-10 flex items-center justify-center ');

fs.writeFileSync('src/components/Timeline.tsx', content);
