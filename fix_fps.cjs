const fs = require('fs');
let content = fs.readFileSync('src/components/ExportButton.tsx', 'utf8');

content = content.replace("      const targetFps = fps;", "");
content = content.replace("      const fps = 30;", "");

content = content.replace("for (let i = 0; i < totalFrames; i++) {", 
  "for (let i = 0; i < totalFrames; i++) {\n        if (cancelRef.current) {\n          setExportLogs(prev => [...prev, '> Export cancelled by user.']);\n          throw new Error('Cancelled');\n        }");

fs.writeFileSync('src/components/ExportButton.tsx', content);
