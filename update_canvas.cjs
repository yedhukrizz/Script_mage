const fs = require('fs');

let content = fs.readFileSync('src/components/Canvas.tsx', 'utf8');

// 1. Add gridColor and postProcessingFx to the store selector
if (!content.includes('const gridColor')) {
  content = content.replace(
    "const gridOverlay = useStore((state) => state.gridOverlay);",
    "const gridOverlay = useStore((state) => state.gridOverlay);\n  const gridColor = useStore((state) => state.gridColor);\n  const postProcessingFx = useStore((state) => state.postProcessingFx);"
  );
}

// 2. Add hexToRgb to safely handle transparency
const hexToRgbStr = `
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16) || 255;
  const g = parseInt(hex.slice(3, 5), 16) || 255;
  const b = parseInt(hex.slice(5, 7), 16) || 255;
  return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
}
`;
if (!content.includes('function hexToRgba')) {
  content = content.replace(
    "export function Canvas() {",
    hexToRgbStr + "\nexport function Canvas() {"
  );
}

// 3. Update the gridOverlay div
const oldGrid = /backgroundImage: \`linear-gradient\(to right, rgba\(255,255,255,0\.2\) 1px, transparent 1px\), linear-gradient\(to bottom, rgba\(255,255,255,0\.2\) 1px, transparent 1px\)\`,/g;
content = content.replace(oldGrid, "backgroundImage: `linear-gradient(to right, ${hexToRgba(gridColor, 0.2)} 1px, transparent 1px), linear-gradient(to bottom, ${hexToRgba(gridColor, 0.2)} 1px, transparent 1px)`,");

// 4. Add the postProcessingFx overlay
if (!content.includes('postProcessingFx !== \'none\'')) {
  const fxMarkup = `
        {postProcessingFx !== 'none' && (
          <div className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-30" style={{
            backgroundImage: postProcessingFx === 'crt' 
              ? 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))'
              : postProcessingFx === 'vhs'
              ? 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)'
              : postProcessingFx === 'noise'
              ? 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
              : 'none',
            backgroundSize: postProcessingFx === 'crt' ? '100% 4px, 6px 100%' : postProcessingFx === 'noise' ? '100px 100px' : '100% 4px'
          }} />
        )}
  `;
  content = content.replace(
    /<div className="absolute inset-0 z-10 pointer-events-none">/,
    fxMarkup + '\n        <div className="absolute inset-0 z-10 pointer-events-none">'
  );
}

fs.writeFileSync('src/components/Canvas.tsx', content);

