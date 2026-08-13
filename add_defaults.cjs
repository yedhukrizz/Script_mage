const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

const anchor = "  const backgroundSpeed = useStore((state) => state.backgroundSpeed);";
const replacement = "  const backgroundSpeed = useStore((state) => state.backgroundSpeed);\n  const defaults = useStore((state) => state.defaults);\n  const updateDefaults = useStore((state) => state.updateDefaults);\n  const addToast = useStore((state) => state.addToast);"; // addToast might already exist, let's check.

fs.writeFileSync('src/components/Toolbar.tsx', content.replace(anchor, replacement));
