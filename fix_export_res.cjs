const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const resLogic = `
      // Apply selected FPS
      const targetFps = fps;

      // Determine target resolution based on aspect ratio
      let baseRes = 1080;
      if (resolution === '720p') baseRes = 720;
      else if (resolution === '4k') baseRes = 2160;
      else if (resolution === '8k') baseRes = 4320;

      let targetWidth = baseRes;
      let targetHeight = baseRes;
      const [wRatio, hRatio] = canvasAspectRatio.split('/').map(Number);
      if (wRatio && hRatio) {
        if (wRatio > hRatio) {
          targetHeight = baseRes;
          targetWidth = Math.round(baseRes * (wRatio / hRatio));
        } else {
          targetWidth = baseRes;
          targetHeight = Math.round(baseRes * (hRatio / wRatio));
        }
      }
`;

const oldLogic = `      // Determine target resolution based on aspect ratio
      let targetWidth = 1080;
      let targetHeight = 1080;
      const [wRatio, hRatio] = canvasAspectRatio.split('/').map(Number);
      if (wRatio && hRatio) {
        if (wRatio > hRatio) {
          targetHeight = 1080;
          targetWidth = Math.round(1080 * (wRatio / hRatio));
        } else {
          targetWidth = 1080;
          targetHeight = Math.round(1080 * (hRatio / wRatio));
        }
      }`;

content = content.replace(oldLogic, resLogic);

fs.writeFileSync('src/components/ExportButton.tsx', content);
