const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Instead of setting --theme-*, let's just make the .theme-* classes set the --color-* variables directly!
content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --color-app-bg: #fafafa;
  --color-panel-bg: rgba(255, 255, 255, 0.8);
  --color-panel-border: rgba(0, 0, 0, 0.06);
  --color-text-main: #09090b;
  --color-text-muted: #52525b;
  --color-button-bg: rgba(0, 0, 0, 0.03);
  --color-input-bg: rgba(0, 0, 0, 0.05);
  --color-button-hover: rgba(0, 0, 0, 0.06);
}`);

content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --color-app-bg: #000000;
  --color-panel-bg: rgba(25, 25, 25, 0.5);
  --color-panel-border: rgba(255, 255, 255, 0.08);
  --color-text-main: #ffffff;
  --color-text-muted: #a1a1aa;
  --color-button-bg: rgba(255, 255, 255, 0.05);
  --color-input-bg: rgba(255, 255, 255, 0.05);
  --color-button-hover: rgba(255, 255, 255, 0.1);
}`);

fs.writeFileSync(file, content);
