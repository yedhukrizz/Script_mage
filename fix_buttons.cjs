const fs = require('fs');

const filesToUpdate = [
  'src/components/Toolbar.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Add subtle shadow to the toolbar buttons so they pop off the glass
  content = content.replace(/border-panel-border\/50 hover:border-\[var\(--color-accent\)\]/g, 'border-panel-border/50 shadow-sm hover:shadow-md hover:border-[var(--color-accent)]');
  
  fs.writeFileSync(file, content);
});
