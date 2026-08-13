const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

content = content.replace(
  '<span className="text-[10px] font-medium leading-tight text-center truncate w-full">Place</span>',
  '<span className="text-[10px] font-medium leading-tight text-center truncate w-full">Placeholder</span>'
);

fs.writeFileSync('src/components/Toolbar.tsx', content);
