const fs = require('fs');
let file = 'src/store/useStore.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('applyGlobalTextEffect:')) {
  // Add signature
  content = content.replace(
    /applyGlobalFont: \(fontFamily: string\) => void;/,
    "applyGlobalFont: (fontFamily: string) => void;\n  applyGlobalTextEffect: (effect: string) => void;"
  );

  // Add implementation
  content = content.replace(
    /applyGlobalFont: \(fontFamily\) => set\(\(state\) => \(\{[\s\S]*?\}\)\),/,
    `applyGlobalFont: (fontFamily) => set((state) => ({
    elements: state.elements.map((el) =>
      el.type === 'text' ? { ...el, fontFamily } : el
    ),
  })),
  applyGlobalTextEffect: (effect) => set((state) => ({
    elements: state.elements.map((el) =>
      el.type === 'text' ? { ...el, textEffect: effect } : el
    ),
  })),`
  );
  
  fs.writeFileSync(file, content);
  console.log("useStore updated with applyGlobalTextEffect");
} else {
  console.log("already updated");
}

