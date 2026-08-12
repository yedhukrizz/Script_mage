const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: #09090b;
  --color-panel-bg: rgba(24, 24, 27, 0.6);
  --color-panel-border: rgba(255, 255, 255, 0.08);
  --color-text-main: #ffffff;
  --color-text-muted: #a1a1aa;
  --color-button-bg: rgba(255, 255, 255, 0.04);
  --color-input-bg: rgba(0, 0, 0, 0.4);
  --color-button-hover: rgba(255, 255, 255, 0.08);
}`);

content = content.replace(/:root \{[\s\S]*?\}/, ``);

fs.writeFileSync(file, content);
