const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

// 1. Add noise preload
const preloadInsertion = `
        if (postProcessingFx === 'noise') {
           const noiseUrl = 'data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E';
           try {
              const img = new Image();
              const imgPromise = new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
              });
              img.src = noiseUrl;
              await imgPromise;
              imageCache['noise_svg_fx'] = img;
           } catch(e) {}
        }
`;
content = content.replace('// Fetch and decode TTS Audio', preloadInsertion + '\n        // Fetch and decode TTS Audio');

// 2. Add mediaDimness
const drawImageCode = 'ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, element.width, element.height);';
const drawImageWithDimness = `ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, element.width, element.height);
              if (element.mediaDimness !== undefined && element.mediaDimness > 0) {
                 ctx.fillStyle = 'black';
                 ctx.globalAlpha = element.mediaDimness * currentOpacity;
                 ctx.fillRect(0, 0, element.width, element.height);
              }`;
content = content.replace(drawImageCode, drawImageWithDimness);

// 3. Add global overlays at the end of elements.forEach
const overlaysCode = `
        ctx.restore();

        // Render global overlays (grid, keylight, post-processing)
        if (gridOverlay !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'overlay';
           ctx.globalAlpha = 0.3 * 0.2;
           const gridSize = gridOverlay === 'large' ? 150 : 50;
           ctx.strokeStyle = gridColor || '#ffffff';
           ctx.lineWidth = 1;
           ctx.beginPath();
           for (let x = 0; x <= targetWidth; x += gridSize) {
              ctx.moveTo(x, 0); ctx.lineTo(x, targetHeight);
           }
           for (let y = 0; y <= targetHeight; y += gridSize) {
              ctx.moveTo(0, y); ctx.lineTo(targetWidth, y);
           }
           ctx.stroke();
           ctx.restore();
        }

        if (keylightType !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'screen';
           ctx.globalAlpha = 0.8;
           const grad = keylightType === 'up' 
             ? ctx.createLinearGradient(0, targetHeight, 0, 0)
             : ctx.createLinearGradient(0, 0, 0, targetHeight);
           grad.addColorStop(0, 'rgba(0,0,0,0)');
           grad.addColorStop(0.4, 'rgba(0,0,0,0)');
           grad.addColorStop(1, keylightColor || '#ffffff');
           ctx.fillStyle = grad;
           ctx.fillRect(0, 0, targetWidth, targetHeight);
           ctx.restore();
        }

        if (postProcessingFx !== 'none') {
           ctx.save();
           ctx.globalCompositeOperation = 'overlay';
           ctx.globalAlpha = 0.3;
           if (postProcessingFx === 'vhs') {
              ctx.fillStyle = 'rgba(0,0,0,0.1)';
              for (let y = 0; y < targetHeight; y += 4) {
                 ctx.fillRect(0, y + 2, targetWidth, 2);
              }
           } else if (postProcessingFx === 'crt') {
              ctx.fillStyle = 'rgba(0,0,0,0.25)';
              for (let y = 0; y < targetHeight; y += 4) {
                 ctx.fillRect(0, y + 2, targetWidth, 2);
              }
              ctx.globalAlpha = 0.05;
              for (let x = 0; x < targetWidth; x += 6) {
                 ctx.fillStyle = 'red'; ctx.fillRect(x, 0, 2, targetHeight);
                 ctx.fillStyle = 'green'; ctx.fillRect(x+2, 0, 2, targetHeight);
                 ctx.fillStyle = 'blue'; ctx.fillRect(x+4, 0, 2, targetHeight);
              }
           } else if (postProcessingFx === 'noise') {
              const noiseImg = imageCache['noise_svg_fx'];
              if (noiseImg) {
                 const pattern = ctx.createPattern(noiseImg, 'repeat');
                 if (pattern) {
                    ctx.fillStyle = pattern;
                    ctx.fillRect(0, 0, targetWidth, targetHeight);
                 }
              }
           }
           ctx.restore();
        }

        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });`;
content = content.replace(`        ctx.restore();

        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });`, overlaysCode);

fs.writeFileSync('src/components/ExportButton.tsx', content);
