const fs = require('fs');
let code = fs.readFileSync('src/components/XYPad.tsx', 'utf8');

code = code.replace(/\\\`\\\$\\\{dotX\\\}\\\%\\\`/g, '`${dotX}%`');
code = code.replace(/\\\`\\\$\\\{dotY\\\}\\\%\\\`/g, '`${dotY}%`');
code = code.replace(/\\\`rotate\\\(\\\$\\\{element\\.rotation \\|\\| 0\\}deg\\) scale\\\(\\\$\\\{Math\\.max\\(0\\.5, Math\\.min\\(2, element\\.width \\/ 400\\)\\)\\}\\\)\\\`/g, '`rotate(${element.rotation || 0}deg) scale(${Math.max(0.5, Math.min(2, element.width / 400))})`');

fs.writeFileSync('src/components/XYPad.tsx', code);
