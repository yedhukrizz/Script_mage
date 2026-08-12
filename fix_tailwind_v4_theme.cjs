const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: var(--theme-app-bg);
  --color-panel-bg: var(--theme-panel-bg);
  --color-panel-border: var(--theme-panel-border);
  --color-text-main: var(--theme-text-main);
  --color-text-muted: var(--theme-text-muted);
  --color-button-bg: var(--theme-button-bg);
  --color-input-bg: var(--theme-input-bg);
  --color-button-hover: var(--theme-button-hover);
}`);

content = content.replace(/:root \{[\s\S]*?\}/, `:root {
  --theme-app-bg: #09090b;
  --theme-panel-bg: rgba(24, 24, 27, 0.6);
  --theme-panel-border: rgba(255, 255, 255, 0.08);
  --theme-text-main: #ffffff;
  --theme-text-muted: #a1a1aa;
  --theme-button-bg: rgba(255, 255, 255, 0.04);
  --theme-input-bg: rgba(0, 0, 0, 0.4);
  --theme-button-hover: rgba(255, 255, 255, 0.08);
}`);

content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --theme-app-bg: #fafafa;
  --theme-panel-bg: rgba(255, 255, 255, 0.8);
  --theme-panel-border: rgba(0, 0, 0, 0.06);
  --theme-text-main: #09090b;
  --theme-text-muted: #52525b;
  --theme-button-bg: rgba(0, 0, 0, 0.03);
  --theme-input-bg: rgba(0, 0, 0, 0.05);
  --theme-button-hover: rgba(0, 0, 0, 0.06);
}`);

content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --theme-app-bg: #000000;
  --theme-panel-bg: rgba(25, 25, 25, 0.5);
  --theme-panel-border: rgba(255, 255, 255, 0.08);
  --theme-text-main: #ffffff;
  --theme-text-muted: #a1a1aa;
  --theme-button-bg: rgba(255, 255, 255, 0.05);
  --theme-input-bg: rgba(255, 255, 255, 0.05);
  --theme-button-hover: rgba(255, 255, 255, 0.1);
}`);

fs.writeFileSync(file, content);
