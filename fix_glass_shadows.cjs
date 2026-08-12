const fs = require('fs');
let file = 'src/index.css';
let content = fs.readFileSync(file, 'utf8');

// Softer, iOS-like shadows
content = content.replace(/box-shadow: 0 30px 60px -15px var\(--color-shadow\), 0 0 0 1px inset var\(--color-glass-rim\);/g, 'box-shadow: 0 24px 48px -12px var(--color-shadow), 0 4px 16px -4px var(--color-shadow), 0 0 0 1px inset var(--color-glass-rim);');
content = content.replace(/box-shadow: 0 40px 80px -20px var\(--color-shadow\), 0 0 0 1px inset rgba\(255, 255, 255, 0\.05\);/g, 'box-shadow: 0 32px 64px -16px var(--color-shadow), 0 8px 24px -8px var(--color-shadow), 0 0 0 1px inset var(--color-glass-rim);');

// Make light mode buttons pure white so they stand out crisply on the frosted gray/white glass
content = content.replace(/--color-button-bg: rgba\(255, 255, 255, 0\.95\);/g, '--color-button-bg: #ffffff;');
// Soften the light mode outer border to match iOS better
content = content.replace(/--color-panel-border: rgba\(0, 0, 0, 0\.08\);/g, '--color-panel-border: rgba(0, 0, 0, 0.05);');

fs.writeFileSync(file, content);
