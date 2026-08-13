const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const target = "const defaults = useStore((state) => state.defaults);";
const insert = "const defaults = useStore((state) => state.defaults);\n  const updateDefaults = useStore((state) => state.updateDefaults);";

content = content.replace(target, insert);
fs.writeFileSync('src/components/Toolbar.tsx', content);
