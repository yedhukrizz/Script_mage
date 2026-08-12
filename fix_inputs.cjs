const fs = require('fs');

// Add --theme-input-bg to index.css
let cssFile = 'src/index.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/--theme-button-bg: rgba\(255, 255, 255, 0.04\);/g, '--theme-button-bg: rgba(255, 255, 255, 0.04);\n  --theme-input-bg: rgba(0, 0, 0, 0.4);');
css = css.replace(/--theme-button-bg: rgba\(0, 0, 0, 0.03\);/g, '--theme-button-bg: rgba(0, 0, 0, 0.03);\n  --theme-input-bg: rgba(0, 0, 0, 0.05);');
css = css.replace(/--theme-button-bg: rgba\(255, 255, 255, 0.05\);/g, '--theme-button-bg: rgba(255, 255, 255, 0.05);\n  --theme-input-bg: rgba(255, 255, 255, 0.05);');
fs.writeFileSync(cssFile, css);

['src/components/ScriptModal.tsx', 'src/components/ExportButton.tsx'].forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-black\/30/g, 'bg-[var(--theme-input-bg)]');
  content = content.replace(/bg-black\/40/g, 'bg-[var(--theme-input-bg)]');
  content = content.replace(/bg-black\/50/g, 'bg-[var(--theme-input-bg)]');
  fs.writeFileSync(file, content);
});
