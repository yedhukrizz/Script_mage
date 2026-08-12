const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = '  const gridOverlay = useStore((state) => state.gridOverlay);';
const replace = '  const gridOverlay = useStore((state) => state.gridOverlay);\n  const uiTheme = useStore((state) => state.uiTheme);\n  const setUiTheme = useStore((state) => state.setUiTheme);';

content = content.replace(anchor, replace);

fs.writeFileSync(file, content);
