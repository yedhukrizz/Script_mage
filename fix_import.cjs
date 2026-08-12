const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(`import { motion, AnimatePresence } from 'motion/react';`, `import { motion, AnimatePresence } from 'motion/react';\nimport { ThickSlider } from './ThickSlider';`);

fs.writeFileSync(file, content);
