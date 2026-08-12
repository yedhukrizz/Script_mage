const fs = require('fs');

const filesToUpdate = [
  'src/App.tsx',
  'src/components/Toolbar.tsx',
  'src/components/PropertiesPanel.tsx',
  'src/components/Timeline.tsx',
  'src/components/SettingsModal.tsx',
  'src/components/AboutModal.tsx',
  'src/components/ScriptModal.tsx',
  'src/components/ExportButton.tsx',
  'src/components/CustomSelect.tsx',
  'src/components/DonationModal.tsx',
  'src/components/ProjectMenu.tsx',
  'src/components/ProjectScreen.tsx',
  'src/components/Sidebar.tsx',
  'src/components/TextGallery.tsx',
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Toolbar main panels
  content = content.replace(/bg-panel-bg\/95 backdrop-blur-xl border border-panel-border/g, 'glass-panel');
  content = content.replace(/bg-panel-bg backdrop-blur-xl border border-panel-border/g, 'glass-panel-heavy');
  
  // Modals
  content = content.replace(/bg-app-bg text-text-main w-full (.*?) shadow-\[0_30px_60px_-15px_rgba\(0,0,0,0.7\)\] border border-panel-border/g, 'glass-panel-heavy text-text-main w-full $1');
  content = content.replace(/bg-panel-bg\/85 backdrop-blur-2xl border border-panel-border text-text-main w-full (.*?) shadow-\[0_25px_60px_-15px_rgba\(0,0,0,0.7\)\]/g, 'glass-panel-heavy text-text-main w-full $1');
  
  // Export button overlay
  content = content.replace(/bg-panel-bg\/95 backdrop-blur-2xl border border-panel-border text-text-main w-full max-w-sm rounded-\[32px\] shadow-\[0_30px_60px_-15px_rgba\(0,0,0,0.7\)\]/g, 'glass-panel-heavy text-text-main w-full max-w-sm rounded-[32px]');

  // CustomSelect
  content = content.replace(/bg-panel-bg\/95 backdrop-blur-3xl border border-panel-border rounded-2xl shadow-\[0_20px_60px_-15px_rgba\(0,0,0,0.8\)\]/g, 'glass-panel rounded-2xl');

  // TextGallery
  content = content.replace(/bg-button-bg border border-panel-border rounded-2xl p-2 backdrop-blur-xl gap-4 max-w-5xl mx-auto w-full justify-between shadow-\[0_0_40px_rgba\(0,0,0,0.5\)\]/g, 'glass-panel rounded-2xl p-2 gap-4 max-w-5xl mx-auto w-full justify-between');
  content = content.replace(/bg-app-bg border border-panel-border rounded-xl p-4 flex flex-col gap-4 shadow-lg/g, 'glass-panel rounded-xl p-4 flex flex-col gap-4');

  // Timeline & Properties Panel (App.tsx layout)
  content = content.replace(/bg-panel-bg overflow-hidden border-t border-panel-border shadow-\[0_-10px_40px_rgba\(0,0,0,0.8\)\] rounded-t-3xl border-x/g, 'glass-panel rounded-t-[32px] overflow-hidden border-b-0 shadow-[0_-20px_40px_var(--color-shadow)]');
  content = content.replace(/bg-panel-bg overflow-hidden border-t border-panel-border shadow-\[0_-10px_40px_rgba\(0,0,0,0.5\)\] rounded-t-3xl border-x/g, 'glass-panel rounded-t-[32px] overflow-hidden border-b-0 shadow-[0_-20px_40px_var(--color-shadow)]');

  // Sidebar
  content = content.replace(/border-r border-panel-border bg-panel-bg/g, 'glass-panel border-y-0 border-l-0 rounded-r-3xl shadow-[20px_0_40px_var(--color-shadow)]');
  
  // Clean up any remaining hardcoded shadows that match the pattern
  content = content.replace(/shadow-\[0_30px_60px_rgba\(0,0,0,0.9\)\]/g, 'shadow-2xl');
  content = content.replace(/shadow-\[0_10px_40px_rgba\(0,0,0,0.5\)\]/g, 'shadow-xl');

  // Other specific UI updates:
  content = content.replace(/bg-panel-bg border border-panel-border rounded-3xl p-8 max-w-sm w-full shadow-2xl/g, 'glass-panel-heavy rounded-3xl p-8 max-w-sm w-full');
  
  // Toolbar dropdown headers
  content = content.replace(/bg-panel-bg\/50 backdrop-blur-md z-20/g, 'glass-panel border-x-0 border-t-0 rounded-none z-20');

  // Add glass-panel to App.tsx main background overlay if not there
  // Actually, wait, main bg is app-bg, that's fine. 
  
  fs.writeFileSync(file, content);
});
