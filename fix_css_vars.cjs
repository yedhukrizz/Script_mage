const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/:root \{[\s\S]*?\}/, `:root {
  --app-bg: #09090b;
  --panel-bg: rgba(24, 24, 27, 0.6);
  --panel-border: rgba(255, 255, 255, 0.08);
  --text-main: #ffffff;
  --text-muted: #a1a1aa;
  --button-bg: rgba(255, 255, 255, 0.04);
  --input-bg: rgba(0, 0, 0, 0.4);
  --button-hover: rgba(255, 255, 255, 0.08);
}`);

content = content.replace(/\.theme-light \{[\s\S]*?\}/, `.theme-light {
  --app-bg: #fafafa;
  --panel-bg: rgba(255, 255, 255, 0.8);
  --panel-border: rgba(0, 0, 0, 0.06);
  --text-main: #09090b;
  --text-muted: #52525b;
  --button-bg: rgba(0, 0, 0, 0.03);
  --input-bg: rgba(0, 0, 0, 0.05);
  --button-hover: rgba(0, 0, 0, 0.06);
}`);

content = content.replace(/\.theme-black \{[\s\S]*?\}/, `.theme-black {
  --app-bg: #000000;
  --panel-bg: rgba(25, 25, 25, 0.5);
  --panel-border: rgba(255, 255, 255, 0.08);
  --text-main: #ffffff;
  --text-muted: #a1a1aa;
  --button-bg: rgba(255, 255, 255, 0.05);
  --input-bg: rgba(255, 255, 255, 0.05);
  --button-hover: rgba(255, 255, 255, 0.1);
}`);

fs.writeFileSync(file, content);
