const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Update themes
content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --color-app-bg: #fbfbfc;
  --color-shadow: rgba(0, 0, 0, 0.03);
  --color-glass-rim: transparent;
  --color-panel-bg: #ffffff;
  --color-panel-border: #f4f4f5;
  --color-text-main: #18181b;
  --color-text-muted: #a1a1aa;
  --color-button-bg: #f4f4f5;
  --color-input-bg: #f4f4f5;
  --color-button-hover: #e4e4e7;
}`);

content = content.replace(/@theme \{[\s\S]*?\}/, `@theme {
  --font-sans: "Inter", "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --color-app-bg: #09090b;
  --color-shadow: rgba(0, 0, 0, 0.25);
  --color-glass-rim: transparent;
  --color-panel-bg: #18181b;
  --color-panel-border: #27272a;
  --color-text-main: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-button-bg: #27272a;
  --color-input-bg: #18181b;
  --color-button-hover: #3f3f46;
}`);

content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --color-app-bg: #000000;
  --color-shadow: rgba(0, 0, 0, 0.5);
  --color-glass-rim: transparent;
  --color-panel-bg: #0a0a0a;
  --color-panel-border: #262626;
  --color-text-main: #ffffff;
  --color-text-muted: #737373;
  --color-button-bg: #171717;
  --color-input-bg: #0a0a0a;
  --color-button-hover: #262626;
}`);

// Inject placeholder style
const placeholderStyle = `
::placeholder {
  color: var(--color-text-muted) !important;
  opacity: 0.7 !important;
}
::-webkit-input-placeholder {
  color: var(--color-text-muted) !important;
  opacity: 0.7 !important;
}
`;

if (!content.includes('::placeholder')) {
  content += '\n' + placeholderStyle;
}

fs.writeFileSync(file, content);
