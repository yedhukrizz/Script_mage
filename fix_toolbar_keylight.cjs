const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const target = `const keylightType = useStore((state) => state.keylightType);`;
const addition = `const keylightType = useStore((state) => state.keylightType);\n  const keylightColor = useStore((state) => state.keylightColor);\n  const setKeylightColor = useStore((state) => state.setKeylightColor);`;

content = content.replace(target, addition);

fs.writeFileSync('src/components/Toolbar.tsx', content);

