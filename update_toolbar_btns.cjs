const fs = require('fs');
const files = [
  'src/components/Toolbar.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/border border-panel-border\/50 shadow-sm hover:shadow-md/g, 'border border-transparent hover:border-panel-border/50');
  content = content.replace(/border border-panel-border shadow-sm/g, 'border border-panel-border');
  fs.writeFileSync(file, content);
});
