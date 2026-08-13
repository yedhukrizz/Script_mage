const fs = require('fs');
let file = 'src/components/Toolbar.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('const setCustomFonts = useStore')) {
  content = content.replace(
    /const storeCustomFonts = useStore\(\(state\) => state\.customFonts\);/,
    "const storeCustomFonts = useStore((state) => state.customFonts);\n  const setCustomFonts = useStore((state) => state.setCustomFonts);"
  );
  fs.writeFileSync(file, content);
}
