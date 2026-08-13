const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// The replacement above added addToast a second time. Let's remove the duplicated addToast if it exists.
content = content.replace("  const addToast = useStore((state) => state.addToast);\n  const addToast = useStore((state) => state.addToast);", "  const addToast = useStore((state) => state.addToast);");

fs.writeFileSync('src/components/Toolbar.tsx', content);
