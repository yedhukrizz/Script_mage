const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Upgrade glass-panel utilities to be borderless and purely reliant on blur/rim
content = content.replace(/\.glass-panel \{[\s\S]*?\}/, `.glass-panel {
    background-color: var(--color-panel-bg);
    backdrop-filter: blur(60px) saturate(200%);
    -webkit-backdrop-filter: blur(60px) saturate(200%);
    box-shadow: 0 24px 48px -12px var(--color-shadow), 0 4px 16px -4px var(--color-shadow), 0 0 0 1px inset var(--color-glass-rim);
  }`);

content = content.replace(/\.glass-panel-heavy \{[\s\S]*?\}/, `.glass-panel-heavy {
    background-color: var(--color-panel-bg);
    backdrop-filter: blur(80px) saturate(250%);
    -webkit-backdrop-filter: blur(80px) saturate(250%);
    box-shadow: 0 32px 64px -16px var(--color-shadow), 0 8px 24px -8px var(--color-shadow), 0 0 0 1px inset var(--color-glass-rim);
  }`);

// Update Light Theme
content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --color-app-bg: #f2f2f7;
  --color-shadow: rgba(0, 0, 0, 0.05);
  --color-glass-rim: rgba(255, 255, 255, 0.7);
  --color-panel-bg: rgba(255, 255, 255, 0.45);
  --color-panel-border: rgba(0, 0, 0, 0.03);
  --color-text-main: #000000;
  --color-text-muted: #6c6c70;
  --color-button-bg: rgba(255, 255, 255, 0.9);
  --color-input-bg: rgba(255, 255, 255, 0.6);
  --color-button-hover: #ffffff;
}`);

// Update Dark Theme (@theme)
content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.4);
  --color-glass-rim: rgba(255, 255, 255, 0.1);
  --color-panel-bg: rgba(30, 30, 32, 0.35);
  --color-panel-border: rgba(255, 255, 255, 0.08);
  --color-text-main: #ffffff;
  --color-text-muted: #ebebf599;
  --color-button-bg: rgba(255, 255, 255, 0.1);
  --color-input-bg: rgba(255, 255, 255, 0.05);
  --color-button-hover: rgba(255, 255, 255, 0.15);
}`);

// Update OLED Theme
content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.6);
  --color-glass-rim: rgba(255, 255, 255, 0.08);
  --color-panel-bg: rgba(10, 10, 10, 0.4);
  --color-panel-border: rgba(255, 255, 255, 0.05);
  --color-text-main: #ffffff;
  --color-text-muted: #ebebf599;
  --color-button-bg: rgba(255, 255, 255, 0.08);
  --color-input-bg: rgba(255, 255, 255, 0.05);
  --color-button-hover: rgba(255, 255, 255, 0.12);
}`);

fs.writeFileSync(file, content);
