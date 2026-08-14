const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

const durationOld = "const totalFrames = Math.ceil((duration / 1000) * fps);";
const durationNew = `
      const maxElementTime = elements.length > 0 ? Math.max(...elements.map(el => el.endTime)) : 0;
      const exportDurationMs = maxElementTime > 0 ? maxElementTime : duration;
      const totalFrames = Math.ceil((exportDurationMs / 1000) * fps);
`;

content = content.replace(durationOld, durationNew);

fs.writeFileSync('src/components/ExportButton.tsx', content);
