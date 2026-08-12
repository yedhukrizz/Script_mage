const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove all backdrop-blur-* classes
      content = content.replace(/backdrop-blur-[a-z0-9-]+\b/g, '');
      
      // Also remove bg-black/80, bg-black/60 etc. and replace with bg-black/90 or similar if they were used for modals
      // Let's just leave bg-black/80 as is, it's just a dimming effect for the modal backdrop, which is fine, but since he asked for no glass morphism, maybe he means the panels themselves.
      // The modal backdrop having a semi-transparent black overlay without blur is standard and high performant. 

      // Remove the inner shadow from glass-panel if any inline ones are there
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

processDir('./src');
