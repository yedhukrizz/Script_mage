const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Replace the glass-panel classes
content = content.replace(/\.glass-panel \{[\s\S]*?\}/, `.glass-panel {
    background-color: var(--color-panel-bg);
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 4px 6px -1px var(--color-shadow), 0 2px 4px -2px var(--color-shadow);
  }`);

content = content.replace(/\.glass-panel-heavy \{[\s\S]*?\}/, `.glass-panel-heavy {
    background-color: var(--color-panel-bg);
    border: 1px solid var(--color-panel-border);
    box-shadow: 0 10px 15px -3px var(--color-shadow), 0 4px 6px -4px var(--color-shadow);
  }`);

// Update Light Theme
content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --color-app-bg: #f3f4f6;
  --color-shadow: rgba(0, 0, 0, 0.05);
  --color-glass-rim: transparent;
  --color-panel-bg: #ffffff;
  --color-panel-border: rgba(0, 0, 0, 0.1);
  --color-text-main: #111827;
  --color-text-muted: #4b5563;
  --color-button-bg: #f9fafb;
  --color-input-bg: #f3f4f6;
  --color-button-hover: #f3f4f6;
}`);

// Update Dark Theme (@theme)
content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: #09090b;
  --color-shadow: rgba(0, 0, 0, 0.4);
  --color-glass-rim: transparent;
  --color-panel-bg: #18181b;
  --color-panel-border: rgba(255, 255, 255, 0.1);
  --color-text-main: #ffffff;
  --color-text-muted: #a1a1aa;
  --color-button-bg: #27272a;
  --color-input-bg: #09090b;
  --color-button-hover: #3f3f46;
}`);

// Update OLED Theme
content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.8);
  --color-glass-rim: transparent;
  --color-panel-bg: #0a0a0a;
  --color-panel-border: rgba(255, 255, 255, 0.1);
  --color-text-main: #ffffff;
  --color-text-muted: #a1a1aa;
  --color-button-bg: #171717;
  --color-input-bg: #000000;
  --color-button-hover: #262626;
}`);

fs.writeFileSync(file, content);
