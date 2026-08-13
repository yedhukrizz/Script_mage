const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const storeHooksStr = `  const backgroundSpeed = useStore((state) => state.backgroundSpeed) || 1;`;
const newStoreHooksStr = `  const backgroundSpeed = useStore((state) => state.backgroundSpeed) || 1;
  const gridOverlay = useStore((state) => state.gridOverlay);
  const gridColor = useStore((state) => state.gridColor);
  const postProcessingFx = useStore((state) => state.postProcessingFx);
  const keylightType = useStore((state) => state.keylightType);
  const keylightColor = useStore((state) => state.keylightColor);`;
content = content.replace(storeHooksStr, newStoreHooksStr);

// Now for the rendering in export logic
// Where should we put this? After all elements are drawn.
const afterElementsStr = `          // Wait for all elements in this frame to render
          await Promise.all(elementPromises);
          `;

const overlaysRenderStr = `          // Wait for all elements in this frame to render
          await Promise.all(elementPromises);
          
          // Draw Keylight Overlay
          if (keylightType !== 'none') {
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.8;
            const gradient = ctx.createLinearGradient(0, keylightType === 'up' ? targetHeight : 0, 0, keylightType === 'up' ? 0 : targetHeight);
            gradient.addColorStop(0, keylightColor);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
          }

          // Draw Grid Overlay
          if (gridOverlay !== 'none') {
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            const spacing = gridOverlay === 'large' ? 150 : 50;
            ctx.beginPath();
            for (let x = 0; x <= targetWidth; x += spacing) {
              ctx.moveTo(x, 0); ctx.lineTo(x, targetHeight);
            }
            for (let y = 0; y <= targetHeight; y += spacing) {
              ctx.moveTo(0, y); ctx.lineTo(targetWidth, y);
            }
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
          }

          // Draw Post-Processing Effects
          if (postProcessingFx !== 'none') {
            ctx.globalCompositeOperation = 'overlay';
            ctx.globalAlpha = 0.3;
            if (postProcessingFx === 'crt') {
              // Simple scanlines
              ctx.fillStyle = 'rgba(0,0,0,0.3)';
              for (let y = 0; y < targetHeight; y += 4) {
                ctx.fillRect(0, y, targetWidth, 2);
              }
              // RGB separation effect (simplified)
              ctx.globalCompositeOperation = 'screen';
              ctx.fillStyle = 'rgba(255,0,0,0.06)';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
              ctx.fillStyle = 'rgba(0,255,0,0.02)';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
              ctx.fillStyle = 'rgba(0,0,255,0.06)';
              ctx.fillRect(0, 0, targetWidth, targetHeight);
            } else if (postProcessingFx === 'vhs') {
              ctx.fillStyle = 'rgba(0,0,0,0.1)';
              for (let y = (timeSec * 50) % 4; y < targetHeight; y += 4) {
                ctx.fillRect(0, y, targetWidth, 1);
              }
            } else if (postProcessingFx === 'noise') {
              // Static noise is expensive to generate on canvas per frame, so we do a simple fast pseudo-random noise or just skip true noise in export for speed unless we use an image.
              // For now, we will draw a few random dots
              ctx.fillStyle = 'rgba(255,255,255,0.1)';
              for(let i=0; i<3000; i++) {
                ctx.fillRect(Math.random() * targetWidth, Math.random() * targetHeight, 2, 2);
              }
            }
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
          }
`;
content = content.replace(afterElementsStr, overlaysRenderStr);

fs.writeFileSync('src/components/ExportButton.tsx', content);
