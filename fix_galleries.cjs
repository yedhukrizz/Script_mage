const fs = require('fs');
['src/components/TextGallery.tsx', 'src/components/PlaceholderGallery.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-white(?!(\/))/g, 'text-text-main');
  content = content.replace(/bg-white\/5/g, 'bg-button-bg');
  content = content.replace(/bg-white\/10/g, 'bg-button-bg hover:bg-button-hover');
  content = content.replace(/border-white\/10/g, 'border-panel-border');
  content = content.replace(/border-white\/5/g, 'border-panel-border');
  content = content.replace(/bg-white text-black/g, 'bg-text-main text-app-bg');
  content = content.replace(/text-white\/50/g, 'text-text-muted');
  content = content.replace(/text-white\/40/g, 'text-text-muted opacity-80');
  content = content.replace(/text-white\/20/g, 'text-text-muted opacity-50');
  
  fs.writeFileSync(file, content);
});
