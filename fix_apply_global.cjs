const fs = require('fs');

let content = fs.readFileSync('src/store/useStore.ts', 'utf8');
const targetStr = `  applyGlobalTextEffect: (effect) => set((state) => ({
    elements: state.elements.map((el) =>
      el.type === 'text' ? { ...el, textEffect: effect } : el
    ),
  })),`;

const newStr = `  applyGlobalTextEffect: (effect) => set((state) => ({
    elements: state.elements.map((el) =>
      el.type === 'text' ? { ...el, textEffect: effect, textEffect2: 'none', textEffect3: 'none' } : el
    ),
  })),`;

content = content.replace(targetStr, newStr);
fs.writeFileSync('src/store/useStore.ts', content);
