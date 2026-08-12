const fs = require('fs');
['src/components/TTSModal.tsx', 'src/components/SettingsModal.tsx', 'src/components/AboutModal.tsx', 'src/components/ScriptModal.tsx', 'src/components/CustomSelect.tsx', 'src/components/TextGallery.tsx', 'src/components/Toolbar.tsx'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/border-white\/5(?!0)/g, 'border-panel-border');
  content = content.replace(/border-white\/10/g, 'border-panel-border');
  content = content.replace(/border-white\/20/g, 'border-panel-border');
  fs.writeFileSync(file, content);
});
