const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const encoderInit = `
      let encoderError = null;
      videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => {
          console.error("VideoEncoder error:", e);
          encoderError = e;
        }
      });

      let avcLevel = '32'; // 5.0
      const pixels = targetWidth * targetHeight;
      if (pixels > 8912896) {
        avcLevel = '3E'; // 6.2
      } else if (pixels > 5652480) {
        avcLevel = '34'; // 5.2
      }

      setExportLogs(prev => [...prev, '> Video encoder configured. Starting frame generation...']);
      videoEncoder.configure({
        codec: \`avc1.6400\${avcLevel}\`,
        width: targetWidth,
        height: targetHeight,
        bitrate: pixels > 5000000 ? 30_000_000 : 8_000_000, 
        framerate: fps,
      });
`;

content = content.replace(/videoEncoder = new VideoEncoder\(\{[\s\S]*?framerate: fps,\n      \}\);/, encoderInit.trim());

// Also add a check in the encode loop
const encodeStr = "        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });";
const encodeStrWithCheck = `        if (encoderError) throw new Error('Video encoder error: ' + encoderError.message);
        const frame = new VideoFrame(hiddenCanvas, { timestamp: i * 1e6 / fps });`;

content = content.replace(encodeStr, encodeStrWithCheck);

fs.writeFileSync('src/components/ExportButton.tsx', content);
