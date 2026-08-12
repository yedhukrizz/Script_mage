const fs = require('fs');
['src/components/ScriptModal.tsx', 'src/components/CustomSelect.tsx', 'src/components/ThickSlider.tsx', 'src/components/Timeline.tsx', 'src/components/ProjectScreen.tsx'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-white\/5/g, 'bg-button-bg');
  content = content.replace(/bg-white\/10/g, 'bg-button-bg hover:bg-button-hover');
  content = content.replace(/border-white\/10/g, 'border-panel-border');
  content = content.replace(/border-white\/15/g, 'border-panel-border');
  fs.writeFileSync(file, content);
});
