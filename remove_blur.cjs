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
      
      fs.writeFileSync(fullPath, content);
    }
  });
}

processDir('./src');
