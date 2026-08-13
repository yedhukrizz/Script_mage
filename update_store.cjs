const fs = require('fs');

let content = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Add to types
if (!content.includes('gridColor: string;')) {
  content = content.replace(
    "gridOverlay: 'none' | 'small' | 'large';",
    "gridOverlay: 'none' | 'small' | 'large';\n  gridColor: string;\n  postProcessingFx: 'none' | 'crt' | 'vhs' | 'noise';\n  setGridColor: (color: string) => void;\n  setPostProcessingFx: (fx: 'none' | 'crt' | 'vhs' | 'noise') => void;"
  );
}

// Add defaults and setters
if (!content.includes('gridColor: \'#ffffff\',')) {
  content = content.replace(
    "gridOverlay: 'none',",
    "gridOverlay: 'none',\n  gridColor: '#ffffff',\n  postProcessingFx: 'none',\n  setGridColor: (color) => set({ gridColor: color }),\n  setPostProcessingFx: (fx) => set({ postProcessingFx: fx }),"
  );
}

// Add to toJSON
if (!content.includes('gridColor: s.gridColor,')) {
  content = content.replace(
    "gridOverlay: s.gridOverlay,",
    "gridOverlay: s.gridOverlay,\n      gridColor: s.gridColor,\n      postProcessingFx: s.postProcessingFx,"
  );
}

// Add to loadFromJSON
if (!content.includes('gridColor: data.gridColor')) {
  content = content.replace(
    "gridOverlay: data.gridOverlay || 'none',",
    "gridOverlay: data.gridOverlay || 'none',\n        gridColor: data.gridColor || '#ffffff',\n        postProcessingFx: data.postProcessingFx || 'none',"
  );
}

fs.writeFileSync('src/store/useStore.ts', content);

