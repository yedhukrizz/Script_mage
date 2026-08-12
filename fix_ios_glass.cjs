const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Update glass panels to include saturation (crucial for iOS look)
content = content.replace(/backdrop-filter: blur\(32px\);/g, 'backdrop-filter: blur(40px) saturate(180%);');
content = content.replace(/-webkit-backdrop-filter: blur\(32px\);/g, '-webkit-backdrop-filter: blur(40px) saturate(180%);');

content = content.replace(/backdrop-filter: blur\(48px\);/g, 'backdrop-filter: blur(50px) saturate(200%);');
content = content.replace(/-webkit-backdrop-filter: blur\(48px\);/g, '-webkit-backdrop-filter: blur(50px) saturate(200%);');

// Update Light Theme for clean iOS look
content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --color-app-bg: #f2f2f7;
  --color-shadow: rgba(0, 0, 0, 0.08);
  --color-panel-bg: rgba(255, 255, 255, 0.65);
  --color-panel-border: rgba(255, 255, 255, 1);
  --color-text-main: #000000;
  --color-text-muted: #6c6c70;
  --color-button-bg: rgba(255, 255, 255, 0.95);
  --color-input-bg: rgba(255, 255, 255, 0.7);
  --color-button-hover: #ffffff;
}`);

// Update Dark Theme
content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.5);
  --color-panel-bg: rgba(28, 28, 30, 0.65);
  --color-panel-border: rgba(255, 255, 255, 0.15);
  --color-text-main: #ffffff;
  --color-text-muted: #ebebf599;
  --color-button-bg: rgba(255, 255, 255, 0.1);
  --color-input-bg: rgba(255, 255, 255, 0.05);
  --color-button-hover: rgba(255, 255, 255, 0.15);
}`);

// Ensure OLED Theme is distinct
content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.8);
  --color-panel-bg: rgba(10, 10, 10, 0.6);
  --color-panel-border: rgba(255, 255, 255, 0.1);
  --color-text-main: #ffffff;
  --color-text-muted: #ebebf599;
  --color-button-bg: rgba(255, 255, 255, 0.08);
  --color-input-bg: rgba(255, 255, 255, 0.05);
  --color-button-hover: rgba(255, 255, 255, 0.12);
}`);

fs.writeFileSync(file, content);
