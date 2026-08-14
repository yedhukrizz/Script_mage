const fs = require('fs');
let code = fs.readFileSync('src/components/XYPad.tsx', 'utf8');

code = code.replace(/left: \\`\\\$\\{dotX\\}%\\`,/g, 'left: `${dotX}%`,');
code = code.replace(/top: \\`\\\$\\{dotY\\}%\\`,/g, 'top: `${dotY}%`,');
code = code.replace(/transform: \\`rotate\\\(\\\$\\{element\\.rotation \\|\\| 0\\}deg\\) scale\\\(\\\$\\{Math\\.max\\(0\\.5, Math\\.min\\(2, element\\.width \/ 400\\)\\)\\}\\\)\\`/g, 'transform: `rotate(${element.rotation || 0}deg) scale(${Math.max(0.5, Math.min(2, element.width / 400))})`');

fs.writeFileSync('src/components/XYPad.tsx', code);
