const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Use exact tailwind vars in theme classes
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

content = content.replace(/:root \{[\s\S]*?\}/, `:root {
  --color-app-bg: #09090b;
  --color-panel-bg: rgba(24, 24, 27, 0.6);
  --color-panel-border: rgba(255, 255, 255, 0.08);
  --color-text-main: #ffffff;
  --color-text-muted: #a1a1aa;
  --color-button-bg: rgba(255, 255, 255, 0.04);
  --color-input-bg: rgba(0, 0, 0, 0.4);
  --color-button-hover: rgba(255, 255, 255, 0.08);
}`);

content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: var(--color-app-bg);
  --color-panel-bg: var(--color-panel-bg);
  --color-panel-border: var(--color-panel-border);
  --color-text-main: var(--color-text-main);
  --color-text-muted: var(--color-text-muted);
  --color-button-bg: var(--color-button-bg);
  --color-input-bg: var(--color-input-bg);
  --color-button-hover: var(--color-button-hover);
}`);

fs.writeFileSync(file, content);
