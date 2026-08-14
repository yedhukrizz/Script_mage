const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const scaleStr = "const scale = 1;";
const newScaleStr = `
      let logicalWidth = 1080;
      if (wRatio && hRatio && wRatio > hRatio) {
         logicalWidth = Math.round(1080 * (wRatio / hRatio));
      }
      const scale = targetWidth / logicalWidth;
`;

content = content.replace(scaleStr, newScaleStr);

fs.writeFileSync('src/components/ExportButton.tsx', content);
