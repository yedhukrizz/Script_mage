const fs = require('fs');

['src/components/SettingsModal.tsx', 'src/components/ScriptModal.tsx'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/bg-panel-bg\/95 backdrop-blur border-t border-panel-border/g, 'glass-panel border-x-0 border-b-0 rounded-none');
  content = content.replace(/bg-panel-bg\/60 backdrop-blur-md/g, 'glass-panel border-x-0 border-t-0 rounded-none');
  content = content.replace(/bg-panel-bg\/90 backdrop-blur-md border-b border-panel-border/g, 'glass-panel border-x-0 border-t-0 rounded-none');
  content = content.replace(/bg-panel-bg\/90 backdrop-blur-2xl px-4/g, 'glass-panel border-x-0 border-b-0 rounded-none px-4');

  fs.writeFileSync(file, content);
});
