const fs = require('fs');
let content = fs.readFileSync('src/components/Toolbar.tsx', 'utf8');

// Add new store hooks
if (!content.includes('gridColor')) {
  content = content.replace(
    "const gridOverlay = useStore((state) => state.gridOverlay);",
    "const gridOverlay = useStore((state) => state.gridOverlay);\n  const gridColor = useStore((state) => state.gridColor);\n  const setGridColor = useStore((state) => state.setGridColor);\n  const postProcessingFx = useStore((state) => state.postProcessingFx);\n  const setPostProcessingFx = useStore((state) => state.setPostProcessingFx);"
  );
}

fs.writeFileSync('src/components/Toolbar.tsx', content);
